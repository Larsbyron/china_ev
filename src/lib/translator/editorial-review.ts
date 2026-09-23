/**
 * 责任编辑审核模块
 *
 * 使用 DeepSeek V4 Pro 对翻译后的文章进行全面审核：
 * 翻译质量、新闻价值、标题吸引力、结构排版、事实核查
 * 不通过的文章退回重翻（最多 2 次）
 */

import { appendRunLog } from '../runlog'

// ============================================================================
// Types
// ============================================================================

export interface EditorialScores {
  translationQuality: number   // 1-5
  newsValue: number            // 1-5
  titleAppeal: number          // 1-5
  structure: number            // 1-5
  factCheck: number            // 1-5
}

export interface EditorialReviewResult {
  approved: boolean
  scores: EditorialScores
  feedback: string
  averageScore: number
  /** 五维评分与 ===URTEIL=== 是否都成功解析；false = 模型输出不可用（不等于译文有问题） */
  parseOk: boolean
}

// ============================================================================
// Configuration
// ============================================================================

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const API_KEY = process.env.DEEPSEEK_API_KEY
// 复审模型：与翻译同为 deepseek-flash，但它是【独立的一次 API 调用、独立的 system prompt、
// 独立的上下文】——复审只看德文成稿与站内规范，看不到翻译过程、也看不到中文原文，
// 所以不存在「自己审自己」的自我确认偏差。两个 agent 的分工在 prompts 层就分开了。
// 要临时回滚到 v4-pro：设 EDITORIAL_MODEL=deepseek-v4-pro 即可（无需改代码）。
const REVIEW_MODEL = process.env.EDITORIAL_MODEL ?? 'deepseek-flash'
const MAX_RETRIES = 2

// ============================================================================
// System Prompt
// ============================================================================

const EDITORIAL_SYSTEM_PROMPT = `Du bist Chefredakteur bei E-AUTOS, einem deutschen Online-Fachmagazin für chinesische Elektroautos. Deine Aufgabe: AI-übersetzte Artikel vor der Veröffentlichung prüfen.

## THEMENBEREICH
Der Magazin deckt ab:
- Chinesische E-Auto-Neuheiten, Modellvorstellungen, Technik, Verkäufe
- Sowie branchenbezogene Politik und Wirtschaft: Zollpolitik, EU-Antisubventionsuntersuchungen, staatliche Förderung, Handelskonflikte, Joint-Venture-Veränderungen, Makro-Industriepolitik (z.B. Doppel-Karbon-Ziele, NEV-Quote)

## BEWERTUNGSKRITERIEN (jeweils 1-5 Punkte)

1. **Übersetzungsqualität**: Ist das Deutsch natürlich und flüssig? Sind Fachbegriffe korrekt (z.B. Reichweite, Batteriekapazität, Ladeleistung)? Keine grammatikalischen Fehler?
2. **Nachrichtenwert**: Enthält der Artikel genügend konkrete Informationen (Zahlen, Daten, Fakten)? Ist er für deutsche Autofahrer relevant? Verdient er Veröffentlichung?
3. **Titelattraktivität**: Enthält der Titel Markenname + konkreten Wert (Preis, Reichweite, PS, Datum)? Ist er ≤ 60 Zeichen? Neu formuliert statt direkt übersetzt?
4. **Struktur & Layout**: Sinnvolle Absätze (2-4 Sätze)? H2-Zwischenüberschriften alle ~3 Absätze? Technische Specs als Liste? 5W-Erstabsatz?
5. **Faktenprüfung**: Preisumrechnung korrekt (1 元 = 0,128 €, auf 100 € gerundet)? CLTC-Reichweite mit Hinweis versehen? Keine offensichtlichen Zahlenfehler?

## BEWERTUNGSREGELN
- Jedes Kriterium 1 (mangelhaft) bis 5 (hervorragend)
- 3 = akzeptabel, keine Beanstandungen
- Einzelwert ≤ 2 → zwingend REVISION
- Durchschnitt ≥ 3.5 UND kein Einzelwert ≤ 2 → APPROVE
- Durchschnitt < 3.5 → REVISION

## AUSGABEFORMAT (exakt einhalten)
===BEWERTUNG===
Übersetzungsqualität: [1-5]
Nachrichtenwert: [1-5]
Titelattraktivität: [1-5]
Struktur: [1-5]
Faktenprüfung: [1-5]

===URTEIL===
[APPROVE oder REVISION]

===FEEDBACK===
[Bei APPROVE: Kurze Bestätigung (1-2 Sätze)]
[Bei REVISION: Konkrete Probleme als nummerierte Liste. Jeder Punkt enthält: (a) Was falsch ist, (b) Wo im Text, (c) Verbesserungsvorschlag. Gib klare Anweisungen für die Neuübersetzung.]`

// ============================================================================
// Output Parser
// ============================================================================

function parseReviewOutput(raw: string): EditorialReviewResult {
  const scores: EditorialScores = {
    translationQuality: 3,
    newsValue: 3,
    titleAppeal: 3,
    structure: 3,
    factCheck: 3,
  }

  // Extract scores
  const scorePatterns: Array<[keyof EditorialScores, RegExp]> = [
    ['translationQuality', /Übersetzungsqualität:\s*(\d)/i],
    ['newsValue', /Nachrichtenwert:\s*(\d)/i],
    ['titleAppeal', /Titelattraktivität:\s*(\d)/i],
    ['structure', /Struktur:\s*(\d)/i],
    ['factCheck', /Faktenprüfung:\s*(\d)/i],
  ]

  let scoresFound = 0
  for (const [key, regex] of scorePatterns) {
    const match = raw.match(regex)
    if (match) {
      scores[key] = Math.min(5, Math.max(1, parseInt(match[1], 10)))
      scoresFound++
    }
  }

  // Extract verdict —— 不再缺省为 APPROVE：解析不到就是解析不到
  const verdictMatch = raw.match(/===URTEIL===\s*\n\s*(APPROVE|REVISION)/i)
  const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : null

  // Extract feedback
  const feedbackMatch = raw.match(/===FEEDBACK===\s*\n([\s\S]+?)$/)
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : ''

  // Calculate average
  const values = Object.values(scores)
  const average = values.reduce((a, b) => a + b, 0) / values.length

  // Determine approval
  const hasLowScore = values.some(v => v <= 2)
  const parseOk = scoresFound === 5 && verdict !== null
  // parseOk=false（模型输出根本不可解析）时不能凭默认分 3 判 REVISION——
  // 实测 531 次复审里 356 次(67%) 都是这种「avg 恰好 3.0 + 空 feedback」，
  // 直接触发了 334 次没有具体意见的整篇重翻。把它标明出来交给调用方决策。
  const approved = parseOk && verdict === 'APPROVE' && !hasLowScore && average >= 3.5

  return { approved, scores, feedback, averageScore: average, parseOk }
}

// ============================================================================
// API Call
// ============================================================================

async function callEditorialAPI(
  userPrompt: string,
  signal?: AbortSignal
): Promise<string> {
  if (!API_KEY || API_KEY.trim().length === 0) {
    throw new Error('DEEPSEEK_API_KEY is not configured for editorial review')
  }

  const url = `${DEEPSEEK_BASE_URL}/chat/completions`

  const body = JSON.stringify({
    model: REVIEW_MODEL,
    // 2048 太紧：思考 token 也计入 max_tokens，实测把预算吃满导致返回空/不可解析
    max_tokens: Number(process.env.EDITORIAL_MAX_TOKENS ?? 4096),
    temperature: 0.2,
    // 默认降档：DeepSeek 系列默认开启思考且默认 effort=high；实测 67% 的复审输出不可解析。
    // 不设 EDITORIAL_REASONING_EFFORT 即用 low（要回滚可设为 high）。
    reasoning_effort: process.env.EDITORIAL_REASONING_EFFORT ?? 'low',
    messages: [
      { role: 'system', content: EDITORIAL_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }

  // Retry with backoff
  const delays = [1000, 2000, 4000]
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', headers, body, signal })

      if (response.status === 429 && attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]))
        continue
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`Editorial API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const message = data?.choices?.[0]?.message
      const content = message?.content
      const finishReason = data?.choices?.[0]?.finish_reason

      // 用量埋点（P1-1）：复审占本流水线约一半花费，此前完全没有本地记录
      appendRunLog({
        kind: 'llm',
        model: REVIEW_MODEL,
        phase: 'editorial',
        finish_reason: finishReason ?? null,
        max_tokens: Number(process.env.EDITORIAL_MAX_TOKENS ?? 4096),
        prompt_tokens: data?.usage?.prompt_tokens ?? null,
        completion_tokens: data?.usage?.completion_tokens ?? null,
        reasoning_chars: (message?.reasoning_content ?? '').length,
        content_chars: (content ?? '').length,
      })

      // 不再回退 reasoning_content：思考预算被吃满时那是不完整的思维链，
      // 拿它去解析只会得到「五维默认 3 分 + 空反馈」，再触发无意义的重翻。
      if (!content || content.trim().length === 0) {
        throw new Error(
          `Empty response from editorial API (finish_reason=${finishReason}, ` +
            `reasoning_chars=${message?.reasoning_content?.length ?? 0})`
        )
      }

      return content.trim()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < delays.length && !signal?.aborted) {
        await new Promise(r => setTimeout(r, delays[attempt]))
        continue
      }
    }
  }

  throw lastError || new Error('Editorial review failed after retries')
}

// ============================================================================
// Public API
// ============================================================================

export interface EditorialReviewInput {
  title: string
  description: string
  content: string
  originalContent: string
  brand?: string
}

/**
 * Run editorial review on a translated article.
 * Returns structured review result with scores and approval status.
 */
export async function editorialReview(
  input: EditorialReviewInput,
  signal?: AbortSignal
): Promise<EditorialReviewResult> {
  const { title, description, content, originalContent, brand } = input

  const userPrompt = `## Artikel zur Prüfung

**Titel:** ${title}

**Beschreibung:** ${description}

${brand ? `**Marke:** ${brand}\n` : ''}

**Artikelinhalt:**
${content}

---
Prüfe diesen Artikel nach den 5 Kriterien. Gib Bewertung, Urteil und Feedback.`

  // 复审不可用（API 报错 / 输出不可解析）时的行为开关：默认 approve = 保持既有行为
  // （避免故障期间丢稿）；设 EDITORIAL_ON_UNAVAILABLE=revision 即改为不放行。
  // 无论哪种，都不再静默——每次都会落一条 runlog 记录。
  const onUnavailable = (process.env.EDITORIAL_ON_UNAVAILABLE ?? 'approve').toLowerCase()
  const unavailableApproved = onUnavailable !== 'revision'

  try {
    const raw = await callEditorialAPI(userPrompt, signal)
    const parsed = parseReviewOutput(raw)
    if (!parsed.parseOk) {
      console.error(
        `[Editorial] Unparseable review output (avg=${parsed.averageScore.toFixed(1)}, ` +
          `raw=${raw.length} chars) — onUnavailable=${onUnavailable}`
      )
      appendRunLog({
        kind: 'editorial',
        model: REVIEW_MODEL,
        parse_ok: false,
        on_unavailable: onUnavailable,
        raw_chars: raw.length,
        approved: unavailableApproved,
      })
      return unavailableApproved
        ? {
            ...parsed,
            approved: true,
            feedback:
              parsed.feedback ||
              `Review output unparseable (auto-approved by EDITORIAL_ON_UNAVAILABLE=${onUnavailable})`,
          }
        : { ...parsed, approved: false }
    }
    return parsed
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown editorial review error'
    console.error(`[Editorial] Review failed: ${msg} — onUnavailable=${onUnavailable}`)
    appendRunLog({
      kind: 'editorial',
      model: REVIEW_MODEL,
      parse_ok: null,
      error: msg,
      on_unavailable: onUnavailable,
      approved: unavailableApproved,
    })
    return {
      approved: unavailableApproved,
      scores: { translationQuality: 3, newsValue: 3, titleAppeal: 3, structure: 3, factCheck: 3 },
      feedback: `Review API error (${unavailableApproved ? 'auto-approved' : 'blocked'}): ${msg}`,
      averageScore: 3,
      parseOk: false,
    }
  }
}

/**
 * Build a re-translation prompt that incorporates editorial feedback.
 */
export function buildRevisionPrompt(
  originalTitle: string,
  originalContent: string,
  previousTranslation: string,
  editorialFeedback: string,
  brand?: string
): string {
  return `Der folgende Artikel wurde übersetzt, aber die Redaktion hat Beanstandungen.
Bitte neu übersetzen und die genannten Probleme beheben.

${brand ? `MARKE: ${brand}\n` : ''}

=== REDAKTIONELLES FEEDBACK ===
${editorialFeedback}
=== ENDE FEEDBACK ===

=== VORHERIGE ÜBERSETZUNG (zur Referenz, NICHT einfach kopieren) ===
${previousTranslation.slice(0, 2000)}
=== ENDE VORHERIGE ÜBERSETZUNG ===

=== ORIGINAL ===
Titel: ${originalTitle}

${originalContent}
=== ENDE ORIGINAL ===

Übersetze den Artikel NEU unter Berücksichtigung des Feedbacks.`
}

/** Maximum re-translation attempts before giving up */
export const MAX_RETRANSLATION_ATTEMPTS = MAX_RETRIES
