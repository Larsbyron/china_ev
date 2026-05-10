// Article types and utilities for E-Auto Blog scraper pipeline

export interface Article {
  title: string
  content: string
  date: string // ISO8601
  author?: string
  image?: string
  source: SourceName
  originalUrl: string
  description?: string
  brand?: string
}

export type SourceName = 'Autohome' | 'Ifeng' | 'Sina' | 'PCauto' | 'Autohome NewEnergy' | 'OFweek NEV' | 'ChooseAuto'

export interface ArticleFrontmatter {
  title: string
  date: string
  description: string
  source: SourceName
  image?: string
  category: 'news' | 'weekly'
  brand?: string
  tags: string[]
  draft: boolean
  original_url: string
  read_time_minutes: number
}

export interface FingerprintRecord {
  title: string
  source: string
  date: string
}

export interface ProcessedArticles {
  [fingerprint: string]: FingerprintRecord
}

export interface ScraperOptions {
  sources?: string[]
  weekly?: boolean
}

export interface ScraperResult {
  source: SourceName
  articles: Article[]
  errors: string[]
}

/**
 * Generate a slug from article title
 */
export function generateSlug(title: string, sourceKey: string): string {
  const hashSuffix = title
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    .toString(16)
    .slice(-6)

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // Remove invalid chars but keep Chinese chars
    .replace(/[\s_]+/g, '-')               // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')               // Trim leading/trailing hyphens
    .trim()
    .slice(0, 50)

  const safeSourceKey = sourceKey.toLowerCase().replace(/[\s_]+/g, '-')

  return `${slug}-${safeSourceKey}-${hashSuffix}`
}

/**
 * Estimate read time in minutes based on content length
 */
export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length

  // Chinese chars count as words too
  const totalUnits = wordCount + chineseChars
  return Math.max(1, Math.ceil(totalUnits / wordsPerMinute))
}

export function toISODateString(date: Date): string {
  return date.toISOString()
}

/**
 * Parse HTML and extract text content
 */
export function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
