/**
 * Shared article classifier (lean, classify-only — no translation).
 *
 * Single source of truth for the DeepSeek classification prompt + parsing.
 * Used by:
 *   - scripts/backfill-topics.ts  (one-time backfill of existing articles)
 *   - scripts/eval-classification.ts  (golden-set quality gate)
 *
 * The live translation pipeline (src/lib/translator/) classifies in the SAME
 * call as translation and uses its own fuller prompt — this module is the
 * standalone classifier that the eval exercises when the taxonomy or
 * tie-breaker rules change.
 */

import { isValidTopicSlug, isValidMarketRelevance } from './topics'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
export const CLASSIFY_MODEL = 'deepseek-v4-flash'

export interface ClassificationResult {
  primaryTopic?: string
  secondaryTopics: string[]
  marketRelevance?: string
  brands: string[]
  confidence: number
}

// ============================================================================
// Classification prompt (lean — just taxonomy, no translation)
// ============================================================================

export const CLASSIFY_SYSTEM = `Du klassifizierst deutsche Automobilnews-Artikel. Gib NUR die Marker und Werte aus, KEINE Erklärungen.

Erlaubte Themen (exakt so schreiben):
modelle-marktstarts | preise-rabatte-wettbewerb | markt-absatz-zulassungen | politik-zoelle-regulierung | batterie-laden-reichweite | software-assistenz-autonomes-fahren | industrie-produktion-lieferkette | unternehmen-finanzen-kooperationen

Erlaubte Marktwerte: de_available | eu_available | eu_planned | china_only | global_industry

BEISPIELAUSGABE (genau so, kein anderes Format):
===THEMA===
modelle-marktstarts
===SEKUNDAERE_THEMEN===
preise-rabatte-wettbewerb
===MARKTRELEVANZ===
de_available
===MARKEN===
BYD, NIO
===KONFIDENZ===
0.9

Tie-Breaker: neues Modell/Marktstart → modelle-marktstarts; Preissenkung/Preiskampf → preise-rabatte-wettbewerb; Verkaufszahlen → markt-absatz-zulassungen; Zölle/Regulierung → politik-zoelle-regulierung`

export function buildClassifyPrompt(title: string, excerpt: string): string {
  return `TITEL: ${title}\n\nINHALT (Auszug):\n${excerpt.slice(0, 1500)}`
}

// ============================================================================
// Parsing — pure function (no I/O), so it can be unit-tested directly
// ============================================================================

export function parseClassification(raw: string): ClassificationResult {
  const extract = (marker: string, end: string): string => {
    const si = raw.indexOf(marker)
    if (si === -1) return ''
    const start = si + marker.length
    const ei = raw.indexOf(end, start)
    return raw.slice(start, ei === -1 ? raw.length : ei).trim()
  }

  // Only use first non-empty line — DeepSeek sometimes appends explanations
  const firstLine = (s: string) =>
    s.split('\n').map((l) => l.trim()).find((l) => l.length > 0) ?? ''

  const themaRaw = firstLine(extract('===THEMA===', '===SEKUNDAERE_THEMEN===')).toLowerCase()
  const sekRaw = extract('===SEKUNDAERE_THEMEN===', '===MARKTRELEVANZ===')
  const mktRaw = firstLine(extract('===MARKTRELEVANZ===', '===MARKEN===')).toLowerCase()
  const markenRaw = extract('===MARKEN===', '===KONFIDENZ===')
  const konfRaw = firstLine(extract('===KONFIDENZ===', '===END==='))

  const primaryTopic = isValidTopicSlug(themaRaw) ? themaRaw : undefined
  const secondaryTopics = sekRaw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s && isValidTopicSlug(s) && s !== primaryTopic)
    .slice(0, 2)
  const marketRelevance = isValidMarketRelevance(mktRaw) ? mktRaw : undefined
  const brands = markenRaw.split(',').map((b) => b.trim()).filter(Boolean)
  const confidence = parseFloat(konfRaw) || 0.5

  return { primaryTopic, secondaryTopics, marketRelevance, brands, confidence }
}

// ============================================================================
// DeepSeek call
// ============================================================================

export async function classifyArticle(
  title: string,
  content: string,
  opts: { apiKey?: string } = {}
): Promise<ClassificationResult> {
  const apiKey = opts.apiKey ?? process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set')
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: CLASSIFY_MODEL,
      max_tokens: 1024,
      temperature: 0.1,
      messages: [
        { role: 'system', content: CLASSIFY_SYSTEM },
        { role: 'user', content: buildClassifyPrompt(title, content) },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  const raw: string = data?.choices?.[0]?.message?.content ?? ''
  return parseClassification(raw)
}
