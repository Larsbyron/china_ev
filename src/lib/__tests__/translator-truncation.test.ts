/**
 * 截断（finish_reason='length'）行为回归测试。
 *
 * 背景：7d 实测 translate 截断率 5.2%、editorial 21.7%，且 43% 的截断调用仍返回
 * 非空 content —— 半截译文/半截复审会静默流下去。这组测试锁死三件事：
 *   1. 截断永远不算成功（哪怕 content 非空）
 *   2. 截断只换更大预算重试一次，不在同预算上反复烧钱
 *   3. 复审截断绝不能被 EDITORIAL_ON_UNAVAILABLE 的 approve 回退当成放行
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.hoisted(() => {
  // translator/index.ts 与 editorial-review.ts 都在模块加载时读 API_KEY，
  // 必须在 import 之前就位
  process.env.DEEPSEEK_API_KEY = 'test-key-not-real'
})

// 拦截 runlog：既不往仓库里 .runlog.jsonl 追加垃圾，也方便断言每次尝试都落了一条
vi.mock('../runlog', () => ({ appendRunLog: vi.fn() }))

import { translateArticle, TruncatedResponseError } from '../translator/index'
import { editorialReview } from '../translator/editorial-review'
import { classifyArticle } from '../classify'
import { appendRunLog } from '../runlog'

// ── helpers ──────────────────────────────────────────────────────────────────

interface CapturedRequest {
  url: string
  body: Record<string, unknown>
}

function jsonResponse(payload: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => payload,
    text: async () => JSON.stringify(payload),
  } as unknown as Response
}

function chatPayload(finishReason: string, content: string, completionTokens = 0) {
  return {
    choices: [
      {
        message: { content, reasoning_content: '思考过程（不是结果）' },
        finish_reason: finishReason,
      },
    ],
    usage: { prompt_tokens: 120, completion_tokens: completionTokens },
  }
}

/** 按顺序返回 payload；调用次数超出时复用最后一个（便于断言「不该发生第 3 次」）。 */
function stubFetchSequence(payloads: unknown[]): CapturedRequest[] {
  const calls: CapturedRequest[] = []
  const fn = vi.fn(async (url: unknown, init: { body?: string }) => {
    calls.push({ url: String(url), body: JSON.parse(init.body ?? '{}') })
    const idx = Math.min(calls.length - 1, payloads.length - 1)
    return jsonResponse(payloads[idx])
  })
  vi.stubGlobal('fetch', fn)
  return calls
}

const PARTIAL_GERMAN =
  'BYD hat den neuen Seal 06 vorgestellt. Das Fahrzeug bietet eine Reichweite von 600 Kilometern nach CLTC und kostet umgerechnet rund 21.000 Euro.'
const FULL_GERMAN =
  PARTIAL_GERMAN +
  ' Der Marktstart in China ist für November 2026 geplant, eine europäische Version wurde bislang nicht bestätigt.'
const CHINESE_SOURCE = '比亚迪发布了全新海豹06，续航600公里，售价约12万元。'

function loggedBudgets(): number[] {
  return vi
    .mocked(appendRunLog)
    .mock.calls.map((c) => (c[0] as { max_tokens?: number }).max_tokens ?? -1)
}

beforeEach(() => {
  vi.clearAllMocks()
  // 让 editorial / translate 的预算回到代码默认值，避免本机 env 干扰断言
  delete process.env.EDITORIAL_MAX_TOKENS
  delete process.env.EDITORIAL_MAX_TOKENS_RETRY
  delete process.env.EDITORIAL_ON_UNAVAILABLE
  delete process.env.TRANSLATION_REASONING_EFFORT
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// ── translate ───────────────────────────────────────────────────────────────

describe('translate: finish_reason=length', () => {
  it('retries exactly once with a doubled budget (16384 → 32768) and succeeds', async () => {
    const calls = stubFetchSequence([
      chatPayload('length', PARTIAL_GERMAN, 16384),
      chatPayload('stop', FULL_GERMAN, 900),
    ])

    const result = await translateArticle(CHINESE_SOURCE, '比亚迪海豹06上市，续航600km。')

    expect(result.ok).toBe(true)
    expect(calls).toHaveLength(2)
    expect(calls.map((c) => c.body.max_tokens)).toEqual([16384, 32768])
    // 两次尝试都必须留在 runlog 里，且记录的是当次实际预算
    expect(loggedBudgets()).toEqual([16384, 32768])
    expect(
      vi.mocked(appendRunLog).mock.calls.map((c) => (c[0] as { finish_reason?: string }).finish_reason)
    ).toEqual(['length', 'stop'])
  })

  it('gives up after the escalated retry: result.ok=false and exactly 2 requests', async () => {
    const calls = stubFetchSequence([
      chatPayload('length', PARTIAL_GERMAN, 16384),
      chatPayload('length', PARTIAL_GERMAN, 32768),
    ])

    const result = await translateArticle(CHINESE_SOURCE, '比亚迪海豹06上市，续航600km。')

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/Truncated/i)
    expect(calls).toHaveLength(2)
    expect(calls.map((c) => c.body.max_tokens)).toEqual([16384, 32768])
  })

  it('does not accept non-empty truncated content (silent-corruption guard)', async () => {
    // 这是最危险的一类：译文看起来有内容，其实被切在半截
    const calls = stubFetchSequence([chatPayload('length', PARTIAL_GERMAN, 16384)])

    const result = await translateArticle(CHINESE_SOURCE, '比亚迪海豹06上市，续航600km。')

    expect(result.ok).toBe(false)
    expect(result.content).toBe('')
    expect(result.error).toContain('Truncated')
    // 错误信息要带够定位信息：预算 / completion / 思考长度 / 内容长度
    // （抛出的是翻倍后的第二次尝试，所以是 32768）
    expect(result.error).toMatch(/max_tokens=32768/)
    expect(result.error).toMatch(/content_chars=\d+/)
    expect(calls).toHaveLength(2)
  })

  it('exposes TruncatedResponseError with the budget it used', () => {
    const err = new TruncatedResponseError('boom', 16384)
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('TruncatedResponseError')
    expect(err.budget).toBe(16384)
  })
})

// ── editorial ───────────────────────────────────────────────────────────────

describe('editorial: finish_reason=length', () => {
  it('is never approved by default, retries once at the escalated budget only', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = stubFetchSequence([
      chatPayload('length', '===BEWERTUNG===\nÜbersetzungsqualität: 4', 8192),
      chatPayload('length', '===BEWERTUNG===\nÜbersetzungsqualität: 4', 16384),
    ])

    const review = await editorialReview({
      title: 'BYD Seal 06: 600 km für 21.000 Euro',
      description: 'Reichweite und Preis',
      content: FULL_GERMAN,
      originalContent: CHINESE_SOURCE,
      brand: 'BYD',
    })

    // on_unavailable 默认是 approve —— 截断必须绕过这个回退
    expect(review.approved).toBe(false)
    expect(review.truncated).toBe(true)
    expect(review.parseOk).toBe(false)
    expect(review.feedback).toMatch(/truncated/i)

    // 8192 → 16384，恰好两次；不能因为外层 attempt 循环再烧两次同预算
    expect(calls).toHaveLength(2)
    expect(calls.map((c) => c.body.max_tokens)).toEqual([8192, 16384])
    // 每次尝试各一条 llm 日志（第 3 条是 editorialReview 的失败记录，无预算字段）
    expect(loggedBudgets().slice(0, 2)).toEqual([8192, 16384])

    const logs = vi.mocked(appendRunLog).mock.calls.map((c) => c[0] as Record<string, unknown>)
    expect(logs[logs.length - 1]).toMatchObject({
      truncated: true,
      approved: false,
      on_unavailable: 'truncation',
    })
    expect(errorSpy).toHaveBeenCalled()
  })

  it('clamps an out-of-range EDITORIAL_MAX_TOKENS so the quality gate cannot be silently bypassed', async () => {
    // 旧写法：设 500000 会原样发出 → API 400（上限 393216）→ 通用 catch → approve（静默放行未审稿）
    const prev = process.env.EDITORIAL_MAX_TOKENS
    process.env.EDITORIAL_MAX_TOKENS = '500000'
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const calls = stubFetchSequence([
        chatPayload('length', '===BEWERTUNG===', 393216),
      ])

      const review = await editorialReview({
        title: 'BYD Seal 06: 600 km für 21.000 Euro',
        description: 'Reichweite und Preis',
        content: FULL_GERMAN,
        originalContent: CHINESE_SOURCE,
        brand: 'BYD',
      })

      // 预算被 clamp 到 API 硬上限；重试预算同样被 clamp（不会变成 1000000）
      expect(calls[0].body.max_tokens).toBe(393216)
      // 已达上限 → 无更大预算可升 → 只发一次，且不放行
      expect(calls).toHaveLength(1)
      expect(review.approved).toBe(false)
      expect(review.truncated).toBe(true)
      expect(errorSpy).toHaveBeenCalled()
    } finally {
      if (prev === undefined) delete process.env.EDITORIAL_MAX_TOKENS
      else process.env.EDITORIAL_MAX_TOKENS = prev
      errorSpy.mockRestore()
    }
  })
})

// ── classify ────────────────────────────────────────────────────────────────

describe('classify: finish_reason=length', () => {
  it('returns defaults instead of throwing (daily run must not abort)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const calls = stubFetchSequence([chatPayload('length', '', 2048)])

    const result = await classifyArticle('BYD Seal 06', 'Inhalt', { apiKey: 'test-key' })

    expect(result.primaryTopic).toBeUndefined()
    expect(result.brands).toEqual([])
    expect(result.confidence).toBe(0.5)
    expect(calls).toHaveLength(1)
    // 请求侧：降档 + 抬高预算，否则 1024 会被思考吃满
    expect(calls[0].body.max_tokens).toBe(2048)
    expect(calls[0].body.reasoning_effort).toBe('low')
    // 留痕但不中断
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('finish_reason=length'))
  })
})
