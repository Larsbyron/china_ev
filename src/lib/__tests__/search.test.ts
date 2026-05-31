import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// URL 尾部斜杠规范化（与 SearchPage.tsx 中的逻辑一致）
// Pagefind 从 .html 文件索引，生成的 URL 缺少尾部斜杠，
// 但 next.config 配置了 trailingSlash: true，需要补齐。
// ---------------------------------------------------------------------------
function normalizeSearchUrl(raw: string): string | null {
  if (typeof raw !== 'string' || raw.length === 0) return null
  return raw.endsWith('/') ? raw : `${raw}/`
}

// ---------------------------------------------------------------------------
// allSettled 结果处理（模拟 SearchPage 中的 Promise.allSettled 逻辑）
// ---------------------------------------------------------------------------
interface PagefindResultData {
  url: string
  meta: { title?: string }
  excerpt: string
}

function processSearchResults(
  settled: PromiseSettledResult<PagefindResultData>[]
): PagefindResultData[] {
  const valid: PagefindResultData[] = []
  for (const s of settled) {
    if (
      s.status === 'fulfilled' &&
      typeof s.value?.url === 'string' &&
      s.value.url.length > 0
    ) {
      const url = normalizeSearchUrl(s.value.url)
      if (url) {
        valid.push({ ...s.value, url })
      }
    }
  }
  return valid
}

// ===========================================================================

describe('normalizeSearchUrl', () => {
  it('给缺少尾部斜杠的 URL 补上 /', () => {
    expect(normalizeSearchUrl('/articles/some-slug')).toBe('/articles/some-slug/')
  })

  it('已有尾部斜杠的 URL 保持不变', () => {
    expect(normalizeSearchUrl('/articles/some-slug/')).toBe('/articles/some-slug/')
  })

  it('根路径保持 /', () => {
    expect(normalizeSearchUrl('/')).toBe('/')
  })

  it('相对路径也补斜杠', () => {
    expect(normalizeSearchUrl('articles/hello')).toBe('articles/hello/')
  })

  it('带查询参数的 URL 也补斜杠', () => {
    expect(normalizeSearchUrl('/articles/slug?ref=search')).toBe('/articles/slug?ref=search/')
  })

  it('空字符串返回 null', () => {
    expect(normalizeSearchUrl('')).toBeNull()
  })

  it('非字符串类型返回 null', () => {
    expect(normalizeSearchUrl(undefined as unknown as string)).toBeNull()
    expect(normalizeSearchUrl(null as unknown as string)).toBeNull()
  })
})

describe('processSearchResults', () => {
  it('处理所有成功的结果', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      {
        status: 'fulfilled',
        value: { url: '/articles/a', meta: { title: 'A' }, excerpt: '...' },
      },
      {
        status: 'fulfilled',
        value: { url: '/articles/b/', meta: { title: 'B' }, excerpt: '...' },
      },
    ]
    const results = processSearchResults(settled)
    expect(results).toHaveLength(2)
    expect(results[0].url).toBe('/articles/a/')
    expect(results[1].url).toBe('/articles/b/')
  })

  it('部分失败时保留成功的结果（allSettled 核心优势）', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      {
        status: 'fulfilled',
        value: { url: '/articles/good', meta: { title: 'Good' }, excerpt: '...' },
      },
      { status: 'rejected', reason: new Error('WASM 内部错误') },
      {
        status: 'fulfilled',
        value: { url: '/articles/also-good', meta: { title: 'Also Good' }, excerpt: '...' },
      },
      { status: 'rejected', reason: new Error('索引片段损坏') },
    ]
    const results = processSearchResults(settled)
    expect(results).toHaveLength(2)
    expect(results[0].meta.title).toBe('Good')
    expect(results[1].meta.title).toBe('Also Good')
  })

  it('全部失败时返回空数组', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      { status: 'rejected', reason: new Error('fail') },
      { status: 'rejected', reason: new Error('fail') },
    ]
    expect(processSearchResults(settled)).toHaveLength(0)
  })

  it('过滤掉 URL 为空的结果', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      {
        status: 'fulfilled',
        value: { url: '', meta: { title: 'No URL' }, excerpt: '...' },
      },
      {
        status: 'fulfilled',
        value: { url: '/articles/ok', meta: { title: 'OK' }, excerpt: '...' },
      },
    ]
    const results = processSearchResults(settled)
    expect(results).toHaveLength(1)
    expect(results[0].meta.title).toBe('OK')
  })

  it('过滤掉 value 为 null 的 fulfilled 结果', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      {
        status: 'fulfilled',
        value: null as unknown as PagefindResultData,
      },
      {
        status: 'fulfilled',
        value: { url: '/articles/valid', meta: { title: 'Valid' }, excerpt: 'x' },
      },
    ]
    const results = processSearchResults(settled)
    expect(results).toHaveLength(1)
  })

  it('所有 URL 都补上尾部斜杠', () => {
    const settled: PromiseSettledResult<PagefindResultData>[] = [
      {
        status: 'fulfilled',
        value: { url: '/articles/no-slash', meta: { title: 'T1' }, excerpt: 'x' },
      },
      {
        status: 'fulfilled',
        value: { url: '/articles/has-slash/', meta: { title: 'T2' }, excerpt: 'x' },
      },
      {
        status: 'fulfilled',
        value: { url: '/weekly/', meta: { title: 'T3' }, excerpt: 'x' },
      },
    ]
    const results = processSearchResults(settled)
    expect(results.every((r) => r.url.endsWith('/'))).toBe(true)
  })

  it('空输入返回空数组', () => {
    expect(processSearchResults([])).toHaveLength(0)
  })
})
