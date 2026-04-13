/**
 * MiniMax Translation Module
 *
 * Translates Chinese articles to German using MiniMax API.
 * Pure functions, no side effects except API calls.
 */

import {
  TRANSLATION_SYSTEM_PROMPT,
  buildTranslationUserPrompt,
  buildChunkTranslationPrompt,
} from './prompts'

// ============================================================================
// Types
// ============================================================================

export interface TranslationResult {
  title: string
  content: string
  ok: boolean
  error?: string
}

export interface TranslateArticleOptions {
  signal?: AbortSignal
}

export interface TranslateBatchOptions {
  onProgress?: (idx: number, total: number) => void
  signal?: AbortSignal
}

interface MiniMaxMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface MiniMaxRequest {
  model: string
  max_tokens: number
  temperature: number
  messages: MiniMaxMessage[]
  stream?: boolean
}

interface MiniMaxResponse {
  content: string
  stop_reason?: string
  error?: {
    type: string
    message: string
  }
}

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.minimax.io/anthropic/v1'
const API_KEY = process.env.ANTHROPIC_API_KEY

const MODEL = 'MiniMax-M2.7'
const MAX_TOKENS = 15000
const TEMPERATURE = 0.3

const RATE_LIMIT_DELAY_MS = 1000 // 1 request per second
const MAX_CHUNK_CHARS = 10000
const CHUNK_OVERLAP_CHARS = 100

const RETRY_DELAY_MS = 2000
const BACKOFF_DELAYS = [1000, 2000, 4000] // exponential backoff for 429s

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

/**
 * Count words in German text.
 * German has approximately 180 words per minute reading speed.
 */
export function countGermanWords(text: string): number {
  // German word count: split by whitespace, filter empty strings
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0)
  return words.length
}

/**
 * Calculate reading time in minutes for German text.
 */
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

    // If not at the end, try to break at a natural boundary (newline or period)
    if (end < text.length) {
      // Look for paragraph break first, then sentence break, then word break
      const paragraphBreak = text.lastIndexOf('\n\n', end)
      const sentenceBreak = text.lastIndexOf('. ', end)
      const wordBreak = text.lastIndexOf(' ', end)

      // Prefer the closest natural break before the limit
      const breakPoints = [paragraphBreak, sentenceBreak, wordBreak].filter(
        (bp) => bp > start + MAX_CHUNK_CHARS / 2
      )

      if (breakPoints.length > 0) {
        end = breakPoints[0] + 1 // Include the break character
      }
    }

    chunks.push({
      content: text.slice(start, end),
      index: index,
      total: 0, // Will be set after all chunks are determined
    })

    start = end - CHUNK_OVERLAP_CHARS
    index++
  }

  // Set total chunks on each chunk
  const total = chunks.length
  for (const chunk of chunks) {
    chunk.total = total
  }

  return chunks
}

// ============================================================================
// MiniMax API
// ============================================================================

async function callMiniMaxAPI(
  systemPrompt: string,
  userPrompt: string,
  signal?: AbortSignal
): Promise<MiniMaxResponse> {
  if (!API_KEY || API_KEY.trim().length === 0) {
    throw new Error('ANTHROPIC_API_KEY is not configured or is empty')
  }

  const url = `${API_BASE_URL}/messages`

  const requestBody: MiniMaxRequest = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }

  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal,
    })
  } catch (networkError) {
    // Network error - retry once
    await sleep(RETRY_DELAY_MS)

    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal,
    })
  }

  // Handle rate limiting with exponential backoff
  if (response.status === 429) {
    for (const delay of BACKOFF_DELAYS) {
      await sleep(delay)

      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal,
      })

      if (response.status !== 429) {
        break
      }
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // Parse the response
  if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
    throw new Error('Empty response from MiniMax API')
  }

  const textContent = data.content.find((c: { type: string }) => c.type === 'text')
  if (!textContent) {
    throw new Error('No text content in MiniMax response')
  }

  return {
    content: textContent.text || '',
    stop_reason: data.stop_reason,
  }
}

// ============================================================================
// Translation Functions
// ============================================================================

/**
 * Translate a single article (title + content) from Chinese to German.
 */
export async function translateArticle(
  title: string,
  content: string,
  options: TranslateArticleOptions = {}
): Promise<TranslationResult> {
  const { signal } = options

  if (!API_KEY) {
    return {
      title: '',
      content: '',
      ok: false,
      error: 'ANTHROPIC_API_KEY is not configured',
    }
  }

  try {
    await rateLimitedRequest()

    // For long content, split into chunks and translate each
    if (content.length > MAX_CHUNK_CHARS) {
      return translateChunked(content, title, signal)
    }

    // Translate title and content together
    const userPrompt = buildTranslationUserPrompt(title, content)

    const response = await callMiniMaxAPI(
      TRANSLATION_SYSTEM_PROMPT,
      userPrompt,
      signal
    )

    if (!response.content || response.content.trim().length === 0) {
      return {
        title: '',
        content: '',
        ok: false,
        error: 'Empty translation response',
      }
    }

    // Parse the response - the translation should contain both title and content
    const translated = response.content.trim()

    // Try to extract title and content from the response
    // The response might be structured or just the content
    const titleMatch = translated.match(/^TITEL[:\s]*(.+?)\n/i)
    const contentStart = translated.indexOf('\n\n', titleMatch ? translated.indexOf(titleMatch[1]) : 0)

    let translatedTitle = title
    let translatedContent = translated

    if (titleMatch && contentStart > -1) {
      translatedTitle = titleMatch[1].trim()
      translatedContent = translated.slice(contentStart + 2).trim()
    } else if (translated.length < 200) {
      // Short response - might be incomplete translation, mark as failed
      return {
        title: '',
        content: '',
        ok: false,
        error: 'Translation response too short, may indicate incomplete translation',
      }
    }

    return {
      title: translatedTitle,
      content: translatedContent,
      ok: true,
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown translation error'

    // Handle abort
    if (errorMessage.includes('aborted') || errorMessage.includes('canceled')) {
      return {
        title: '',
        content: '',
        ok: false,
        error: 'Translation aborted',
      }
    }

    return {
      title: '',
      content: '',
      ok: false,
      error: errorMessage,
    }
  }
}

/**
 * Translate long content by chunking and combining.
 */
async function translateChunked(
  content: string,
  originalTitle: string,
  signal?: AbortSignal
): Promise<TranslationResult> {
  const chunks = splitIntoChunks(content)

  if (chunks.length === 1) {
    return translateArticle(originalTitle, content, { signal })
  }

  const translatedChunks: string[] = []
  let translatedTitle = originalTitle

  for (const chunk of chunks) {
    const chunkPrompt = buildChunkTranslationPrompt(
      chunk.content,
      chunk.index + 1,
      chunk.total
    )

    // First chunk also translates the title
    const isFirstChunk = chunk.index === 0
    const systemPrompt = isFirstChunk
      ? TRANSLATION_SYSTEM_PROMPT
      : `${TRANSLATION_SYSTEM_PROMPT}\n\nDies ist eine Fortsetzung eines Artikels. Übersetze nur den folgenden Inhalt, gib keine Einleitung.`

    try {
      const response = await callMiniMaxAPI(systemPrompt, chunkPrompt, signal)

      if (!response.content || response.content.trim().length === 0) {
        return {
          title: '',
          content: '',
          ok: false,
          error: `Empty response for chunk ${chunk.index + 1}/${chunk.total}`,
        }
      }

      if (isFirstChunk) {
        // Try to extract title from first chunk response
        const titleMatch = response.content.match(/^TITEL[:\s]*(.+?)\n/i)
        if (titleMatch) {
          translatedTitle = titleMatch[1].trim()
          translatedChunks.push(response.content.replace(titleMatch[0], '').trim())
        } else {
          // The title might be the first line
          const lines = response.content.split('\n').filter((l) => l.trim())
          if (lines.length > 0 && lines[0].length < 150) {
            translatedTitle = lines[0].trim()
            translatedChunks.push(lines.slice(1).join('\n').trim())
          } else {
            translatedChunks.push(response.content)
          }
        }
      } else {
        translatedChunks.push(response.content.trim())
      }
    } catch (err) {
      return {
        title: '',
        content: '',
        ok: false,
        error: `Failed to translate chunk ${chunk.index + 1}/${chunk.total}: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }
    }
  }

  return {
    title: translatedTitle,
    content: translatedChunks.join('\n\n'),
    ok: true,
  }
}

/**
 * Translate a batch of articles with progress reporting.
 */
export async function translateBatch(
  articles: Array<{ title: string; content: string }>,
  options: TranslateBatchOptions = {}
): Promise<TranslationResult[]> {
  const { onProgress, signal } = options

  if (!API_KEY) {
    return articles.map(() => ({
      title: '',
      content: '',
      ok: false,
      error: 'ANTHROPIC_API_KEY is not configured',
    }))
  }

  const results: TranslationResult[] = []

  for (let i = 0; i < articles.length; i++) {
    // Check if already aborted
    if (signal?.aborted) {
      results.push({
        title: '',
        content: '',
        ok: false,
        error: 'Batch translation aborted',
      })
      continue
    }

    const article = articles[i]
    const result = await translateArticle(article.title, article.content, { signal })

    results.push(result)

    // Report progress
    if (onProgress) {
      onProgress(i + 1, articles.length)
    }
  }

  return results
}

export type { TextChunk }
