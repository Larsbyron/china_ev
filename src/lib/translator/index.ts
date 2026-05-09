/**
 * DeepSeek Translation Module
 *
 * Translates Chinese articles to German using DeepSeek API (OpenAI-compatible).
 * Model: deepseek-v4-flash
 * Rules: SCRAPING-RULES.md (brand glossary, currency, CLTC→WLTP, etc.)
 */

import {
  TRANSLATION_SYSTEM_PROMPT,
  buildTranslationUserPrompt,
  buildChunkTranslationPrompt,
  parseTranslationOutput,
} from './prompts'
import { lookupBrand, buildInDeutschlandSection } from './brand-glossary'

// ============================================================================
// Types
// ============================================================================

export interface TranslationResult {
  title: string
  description: string
  content: string
  inDeutschland: string
  ok: boolean
  error?: string
}

export interface TranslateArticleOptions {
  signal?: AbortSignal
  brand?: string    // detected brand name (from scraper)
}

export interface TranslateBatchOptions {
  onProgress?: (idx: number, total: number) => void
  signal?: AbortSignal
}

// ============================================================================
// Configuration
// ============================================================================

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const API_KEY = process.env.DEEPSEEK_API_KEY

const MODEL = 'deepseek-v4-flash'
const MAX_TOKENS = 8192
const TEMPERATURE = 0.3

const RATE_LIMIT_DELAY_MS = 500
const MAX_CHUNK_CHARS = 8000
const CHUNK_OVERLAP_CHARS = 100

const RETRY_DELAY_MS = 2000
const BACKOFF_DELAYS = [1000, 2000, 4000]

// ============================================================================
// Rate Limiter
// ============================================================================

let lastRequestTime = 0

async function rateLimitedRequest(): Promise<void> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < RATE_LIMIT_DELAY_MS) {
    await sleep(RATE_LIMIT_DELAY_MS - elapsed)
  }
  lastRequestTime = Date.now()
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================================
// Word Count Utilities
// ============================================================================

export function countGermanWords(text: string): number {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0)
  return words.length
}

export function calculateGermanReadTime(text: string): number {
  const words = countGermanWords(text)
  return Math.ceil(words / 180)
}

// ============================================================================
// Chunking Utilities
// ============================================================================

interface TextChunk {
  content: string
  index: number
  total: number
}

function splitIntoChunks(text: string): TextChunk[] {
  if (text.length <= MAX_CHUNK_CHARS) {
    return [{ content: text, index: 0, total: 1 }]
  }

  const chunks: TextChunk[] = []
  let start = 0
  let index = 0

  while (start < text.length) {
    let end = start + MAX_CHUNK_CHARS

    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf('\n\n', end)
      const sentenceBreak = text.lastIndexOf('. ', end)
      const wordBreak = text.lastIndexOf(' ', end)

      const breakPoints = [paragraphBreak, sentenceBreak, wordBreak].filter(
        (bp) => bp > start + MAX_CHUNK_CHARS / 2
      )

      if (breakPoints.length > 0) {
        end = breakPoints[0] + 1
      }
    }

    chunks.push({ content: text.slice(start, end), index, total: 0 })
    start = end - CHUNK_OVERLAP_CHARS
    index++
  }

  const total = chunks.length
  for (const chunk of chunks) {
    chunk.total = total
  }

  return chunks
}

// ============================================================================
// DeepSeek API (OpenAI-compatible)
// ============================================================================

async function callDeepSeekAPI(
  systemPrompt: string,
  userPrompt: string,
  signal?: AbortSignal
): Promise<string> {
  if (!API_KEY || API_KEY.trim().length === 0) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }

  const url = `${DEEPSEEK_BASE_URL}/chat/completions`

  const body = JSON.stringify({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }

  const doFetch = () =>
    fetch(url, { method: 'POST', headers, body, signal })

  let response: Response

  try {
    response = await doFetch()
  } catch {
    await sleep(RETRY_DELAY_MS)
    response = await doFetch()
  }

  if (response.status === 429) {
    for (const delay of BACKOFF_DELAYS) {
      await sleep(delay)
      response = await doFetch()
      if (response.status !== 429) break
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (!content || content.trim().length === 0) {
    throw new Error('Empty response from DeepSeek API')
  }

  return content.trim()
}

// ============================================================================
// Empty result helper
// ============================================================================

function emptyResult(error: string): TranslationResult {
  return { title: '', description: '', content: '', inDeutschland: '', ok: false, error }
}

// ============================================================================
// Translation Functions
// ============================================================================

/**
 * Translate a single article from Chinese to German.
 * Produces structured output: title, description, content, inDeutschland.
 */
export async function translateArticle(
  title: string,
  content: string,
  options: TranslateArticleOptions = {}
): Promise<TranslationResult> {
  const { signal, brand } = options

  if (!API_KEY) {
    return emptyResult('DEEPSEEK_API_KEY is not configured')
  }

  try {
    await rateLimitedRequest()

    // Build brand context from glossary
    const brandInfo = brand ? lookupBrand(brand) : null
    const inDeutschlandText = brand ? buildInDeutschlandSection(brand) : undefined

    const context = {
      brandOfficialName: brandInfo?.officialName,
      inDeutschlandText,
    }

    if (content.length > MAX_CHUNK_CHARS) {
      return translateChunked(content, title, brand, signal)
    }

    const userPrompt = buildTranslationUserPrompt(title, content, context)
    const raw = await callDeepSeekAPI(TRANSLATION_SYSTEM_PROMPT, userPrompt, signal)

    if (raw.length < 50) {
      return emptyResult('Translation response too short')
    }

    // Try structured output first
    const parsed = parseTranslationOutput(raw)
    if (parsed && parsed.titel && parsed.inhalt) {
      return {
        title: parsed.titel,
        description: parsed.beschreibung,
        content: parsed.inhalt,
        inDeutschland: parsed.inDeutschland || (inDeutschlandText ?? ''),
        ok: true,
      }
    }

    // Fallback: treat whole response as content (old format)
    const titleMatch = raw.match(/^\*{0,2}TITEL\*{0,2}[:\s]+(.+?)(?:\n|$)/im)
    let fallbackTitle = title
    let fallbackContent = raw

    if (titleMatch) {
      fallbackTitle = titleMatch[1].replace(/\*+/g, '').trim()
      fallbackContent = raw.slice(raw.indexOf(titleMatch[0]) + titleMatch[0].length).trim()
      fallbackContent = fallbackContent.replace(/^\*{0,2}INHALT\*{0,2}[:\s]*/im, '').trim()
    } else {
      const lines = raw.split('\n').filter((l) => l.trim())
      if (lines.length > 1 && lines[0].length < 200) {
        fallbackTitle = lines[0].trim()
        fallbackContent = lines.slice(1).join('\n').trim()
      }
    }

    return {
      title: fallbackTitle,
      description: '',
      content: fallbackContent,
      inDeutschland: inDeutschlandText ?? '',
      ok: true,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown translation error'
    if (msg.includes('aborted') || msg.includes('canceled')) {
      return emptyResult('Translation aborted')
    }
    return emptyResult(msg)
  }
}

/**
 * Translate long content by splitting into chunks.
 * Only the first chunk gets the structured format; subsequent chunks are plain translation.
 */
async function translateChunked(
  content: string,
  originalTitle: string,
  brand?: string,
  signal?: AbortSignal
): Promise<TranslationResult> {
  const chunks = splitIntoChunks(content)

  if (chunks.length === 1) {
    return translateArticle(originalTitle, content, { signal, brand })
  }

  const translatedChunks: string[] = []
  let translatedTitle = originalTitle
  let translatedDescription = ''
  let inDeutschland = ''

  const brandInfo = brand ? lookupBrand(brand) : null
  const inDeutschlandText = brand ? buildInDeutschlandSection(brand) : undefined

  for (const chunk of chunks) {
    const isFirst = chunk.index === 0

    const chunkPrompt = isFirst
      ? buildTranslationUserPrompt(originalTitle, chunk.content, {
          brandOfficialName: brandInfo?.officialName,
          inDeutschlandText,
        })
      : buildChunkTranslationPrompt(chunk.content, chunk.index + 1, chunk.total)

    try {
      const result = await callDeepSeekAPI(TRANSLATION_SYSTEM_PROMPT, chunkPrompt, signal)

      if (isFirst) {
        const parsed = parseTranslationOutput(result)
        if (parsed && parsed.titel && parsed.inhalt) {
          translatedTitle = parsed.titel
          translatedDescription = parsed.beschreibung
          inDeutschland = parsed.inDeutschland || (inDeutschlandText ?? '')
          translatedChunks.push(parsed.inhalt)
        } else {
          // Fallback for first chunk
          const titleMatch = result.match(/^\*{0,2}TITEL\*{0,2}[:\s]+(.+?)(?:\n|$)/im)
          if (titleMatch) {
            translatedTitle = titleMatch[1].replace(/\*+/g, '').trim()
            translatedChunks.push(result.slice(result.indexOf(titleMatch[0]) + titleMatch[0].length).trim())
          } else {
            const lines = result.split('\n').filter((l) => l.trim())
            if (lines.length > 0 && lines[0].length < 200) {
              translatedTitle = lines[0].trim()
              translatedChunks.push(lines.slice(1).join('\n').trim())
            } else {
              translatedChunks.push(result)
            }
          }
          inDeutschland = inDeutschlandText ?? ''
        }
      } else {
        translatedChunks.push(result)
      }
    } catch (err) {
      return emptyResult(
        `Chunk ${chunk.index + 1}/${chunk.total} failed: ${err instanceof Error ? err.message : 'unknown'}`
      )
    }
  }

  return {
    title: translatedTitle,
    description: translatedDescription,
    content: translatedChunks.join('\n\n'),
    inDeutschland,
    ok: true,
  }
}

/**
 * Translate a batch of articles.
 */
export async function translateBatch(
  articles: Array<{ title: string; content: string; brand?: string }>,
  options: TranslateBatchOptions = {}
): Promise<TranslationResult[]> {
  const { onProgress, signal } = options

  if (!API_KEY) {
    return articles.map(() => emptyResult('DEEPSEEK_API_KEY is not configured'))
  }

  const results: TranslationResult[] = []

  for (let i = 0; i < articles.length; i++) {
    if (signal?.aborted) {
      results.push(emptyResult('Batch translation aborted'))
      continue
    }

    const result = await translateArticle(
      articles[i].title,
      articles[i].content,
      { signal, brand: articles[i].brand }
    )
    results.push(result)

    if (onProgress) {
      onProgress(i + 1, articles.length)
    }
  }

  return results
}

export type { TextChunk }
