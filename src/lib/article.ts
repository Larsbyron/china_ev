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

export type SourceName = 'Autohome' | 'Ifeng' | 'Sina' | 'PCauto' | 'Autohome NewEnergy' | 'OFweek NEV' | 'ChooseAuto' | 'D1EV' | 'CarNewsChina'

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
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (non-ASCII, non-alphanumeric)
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

/**
 * Strip markdown syntax from text (bold, italic, headings, links, code)
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*{1,3}([^*]+?)\*{1,3}/g, '$1')  // bold/italic
    .replace(/_{1,3}([^_]+?)_{1,3}/g, '$1')       // underline bold/italic
    .replace(/`{1,3}([^`]+?)`{1,3}/g, '$1')       // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')       // links
    .replace(/^#{1,6}\s+/gm, '')                    // headings
    .replace(/^[>\s]*[>-]\s+/gm, '')                // blockquotes / lists
    .trim()
}

/**
 * Remove common scraping artifacts from article descriptions.
 * Matches patterns from Chinese auto news sources that leak into content.
 */
export function stripScrapingArtifacts(text: string): string {
  return text
    // Source site metadata lines
    .replace(/(?:Original|原)?\s*(?:AutoLab|Auto\s*Talk|Car\s*Impression|Aiwangerche|Autonome\s*Fahrtechnologie)[^0-9\n]*/gi, '')
    // Date/time/view patterns: "2026/5/10 0:31:00 0 Aufrufe", "2026/5/10 0:48:19 0 Ansichten"
    .replace(/\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}:\d{2}\s+\d+\s*(?:Aufrufe|Ansichten|Views?|Aufrufe?|views?)/gi, '')
    // "0 Kommentare", "0 Aufrufe" remnants
    .replace(/\d+\s*(?:Kommentare?|Aufrufe|Ansichten|Views?)/gi, '')
    // "Schriftgröße Standard Klein Modus Scrollen"
    .replace(/Schriftgr(?:ö|o)(?:ß|ss)e\s*(?:Standard|Klein|Gro(?:ß|ss)|Mittel)\s*(?:Modus\s*)?(?:Scrollen)?/gi, '')
    // "Quelle: <source> | VR China |" metadata prefix only — not the whole line
    .replace(/Quelle:\s*(?:Autonome\s*Fahrtechnologie|Auto\s*Talk|AutoLab|Car\s*Impression|Aiwangerche)\s*(?:\|\s*VR\s*China\s*\|)?\s*/gi, '')
    // Multiple consecutive spaces
    .replace(/\s{2,}/g, ' ')
    // Leading/trailing whitespace and empty lines
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Sanitize article description: strip markdown, remove scraping artifacts,
 * and derive a clean fallback from content if the result is too short.
 */
export function sanitizeDescription(description: string, content: string): string {
  let cleaned = description

  // Strip markdown syntax
  cleaned = stripMarkdown(cleaned)

  // Remove scraping artifacts
  cleaned = stripScrapingArtifacts(cleaned)

  // If the cleaned description is too short or empty, derive from content
  if (cleaned.length < 30) {
    cleaned = content
      .replace(/\*{1,3}[^*]+\*{1,3}/g, '')  // strip bold
      .replace(/[#>\[\]`]/g, '')              // strip markdown chars
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200)
    if (cleaned.length > 180) {
      cleaned = cleaned.slice(0, 180) + '...'
    }
  }

  return cleaned.slice(0, 300)
}
