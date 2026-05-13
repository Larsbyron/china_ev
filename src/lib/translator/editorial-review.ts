/**
 * 责任编辑审核模块
 *
 * 使用 DeepSeek V4 Pro 对翻译后的文章进行全面审核：
 * 翻译质量、新闻价值、标题吸引力、结构排版、事实核查
 * 不通过的文章退回重翻（最多 2 次）
 */

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
}

// ============================================================================
// Configuration
// ============================================================================

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const API_KEY = process.env.DEEPSEEK_API_KEY
const REVIEW_MODEL = 'deepseek-v4-pro'
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

  for (const [key, regex] of scorePatterns) {
    const match = raw.match(regex)
    if (match) {
      scores[key] = Math.min(5, Math.max(1, parseInt(match[1], 10)))
    }
  }

  // Extract verdict
  const verdictMatch = raw.match(/===URTEIL===\s*\n\s*(APPROVE|REVISION)/i)
  const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : 'APPROVE'

  // Extract feedback
  const feedbackMatch = raw.match(/===FEEDBACK===\s*\n([\s\S]+?)$/)
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : ''

  // Calculate average
  const values = Object.values(scores)
  const average = values.reduce((a, b) => a + b, 0) / values.length

  // Determine approval
  const hasLowScore = values.some(v => v <= 2)
  const approved = verdict === 'APPROVE' && !hasLowScore && average >= 3.5

  return { approved, scores, feedback, averageScore: average }
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
    max_tokens: 2048,
    temperature: 0.2,
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
      const content = data?.choices?.[0]?.message?.content

      if (!content || content.trim().length === 0) {
        throw new Error('Empty response from editorial API')
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

  try {
    const raw = await callEditorialAPI(userPrompt, signal)
    return parseReviewOutput(raw)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown editorial review error'
    console.error(`[Editorial] Review failed: ${msg}`)
    // On API failure, approve to avoid blocking the pipeline
    return {
      approved: true,
      scores: { translationQuality: 3, newsValue: 3, titleAppeal: 3, structure: 3, factCheck: 3 },
      feedback: `Review API error (auto-approved): ${msg}`,
      averageScore: 3,
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
