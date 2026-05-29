import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { articleFrontmatterSchema } from '@/lib/schemas'
import { markdownToHtml } from '@/lib/markdown'

import type { TopicSlug, MarketRelevance } from '@/lib/topics'

export interface Article {
  slug: string
  title: string
  date: string
  description: string
  source: string
  image?: string | null
  category: string
  brand?: string
  brands: string[]
  tags: string[]
  draft: boolean
  original_url: string
  read_time_minutes: number
  ev_model?: string
  primaryTopic?: TopicSlug
  secondaryTopics: TopicSlug[]
  marketRelevance?: MarketRelevance
  confidence?: number
  content: string
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  description: string
  source: string
  image?: string | null
  category: string
  brand?: string
  brands: string[]
  tags: string[]
  draft: boolean
  original_url: string
  read_time_minutes: number
  ev_model?: string
  primaryTopic?: TopicSlug
  secondaryTopics: TopicSlug[]
  marketRelevance?: MarketRelevance
  confidence?: number
}

export type Brand = {
  name: string
  slug: string
  articleCount: number
  latestArticle?: ArticleMeta
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Module-level memo — avoids re-reading 694 files per call during a single request
let _articlesCache: ArticleMeta[] | null = null
let _articlesCacheTime = 0
const CACHE_TTL_MS = 60_000

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Resolves an article image path to null if the file is missing on disk.
// External URLs (http/https) pass through unchanged — they can only be
// validated at runtime via FallbackImage.onError.
function resolveImage(image: string | null | undefined): string | null {
  if (!image) return null
  if (/^https?:\/\//i.test(image)) return image
  if (!image.startsWith('/')) return null
  const diskPath = path.join(PUBLIC_DIR, image)
  return fs.existsSync(diskPath) ? image : null
}

function parseMarkdownFile(filePath: string): Article | null {
  try {
    const fileName = path.basename(filePath, '.md')
    const rawContent = fs.readFileSync(filePath, 'utf-8')

    // Use gray-matter for robust frontmatter parsing
    const { data: frontmatter, content: bodyContent } = matter(rawContent)
    const content = bodyContent.trim()

    // Validate frontmatter with Zod
    const parsed = articleFrontmatterSchema.safeParse(frontmatter)
    if (!parsed.success) {
      console.warn(`Invalid frontmatter in ${filePath}:`, parsed.error.format())
      return null
    }

    const validated = parsed.data
    const slug = fileName

    // brands[]: prefer explicit array, fall back to single brand field
    const brands = validated.brands.length > 0
      ? validated.brands
      : validated.brand ? [validated.brand] : []

    return {
      slug,
      title: validated.title,
      date: validated.date,
      description: validated.description,
      source: validated.source,
      image: resolveImage(validated.image),
      category: validated.category,
      brand: validated.brand,
      brands,
      tags: validated.tags,
      draft: validated.draft,
      original_url: validated.original_url,
      read_time_minutes: validated.read_time_minutes ?? calculateReadTime(content),
      ev_model: validated.ev_model,
      primaryTopic: validated.primaryTopic,
      secondaryTopics: validated.secondaryTopics ?? [],
      marketRelevance: validated.marketRelevance,
      confidence: validated.confidence,
      content,
    }
  } catch {
    return null
  }
}

export function getAllArticles(forceRefresh = false): ArticleMeta[] {
  const now = Date.now()
  if (!forceRefresh && _articlesCache && now - _articlesCacheTime < CACHE_TTL_MS) {
    return _articlesCache
  }

  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR)
  const articles: ArticleMeta[] = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue
    const filePath = path.join(POSTS_DIR, file)
    const article = parseMarkdownFile(filePath)
    if (article && !article.draft) {
      const { content: _content, ...meta } = article
      articles.push(meta as ArticleMeta)
    }
  }

  // Sort by date, newest first
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  _articlesCache = articles
  _articlesCacheTime = now
  return articles
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const article = parseMarkdownFile(filePath)
  if (!article) return null

  // Convert markdown content to HTML via remark/rehype pipeline
  const htmlContent = await markdownToHtml(article.content)
  return { ...article, content: htmlContent }
}

export function getArticlesByBrand(brand: string): ArticleMeta[] {
  return getAllArticles().filter((article) => {
    const lc = brand.toLowerCase()
    return (
      article.brands.some((b) => b.toLowerCase() === lc) ||
      article.brand?.toLowerCase() === lc
    )
  })
}

export function getArticlesByTopic(topicSlug: string): ArticleMeta[] {
  return getAllArticles().filter(
    (article) => article.primaryTopic === topicSlug
  )
}

export function getArticlesByMarketRelevance(relevance: string): ArticleMeta[] {
  return getAllArticles().filter(
    (article) => article.marketRelevance === relevance
  )
}

export function getDeutschlandArticles(): ArticleMeta[] {
  return getAllArticles().filter(
    (article) =>
      article.marketRelevance === 'de_available' ||
      article.marketRelevance === 'eu_planned'
  )
}

// URL slug for a brand name. Lowercase, diacritics stripped (Škoda → skoda),
// non-alphanumeric runs collapsed to hyphens. Reproduces the legacy slugs
// (BYD→byd, Li Auto→li-auto, XPeng→xpeng) so existing links keep working.
export function slugifyBrand(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Brand list derived from the dominant `brand` field (one canonical brand per
// article — clean, unlike the fragmented brands[] mention array). Count and
// detail page both use getArticlesByBrand, so the tile number matches the page.
export function getAllBrands(): { name: string; slug: string; articleCount: number }[] {
  const slugToName = new Map<string, string>()
  for (const article of getAllArticles()) {
    if (!article.brand) continue
    const slug = slugifyBrand(article.brand)
    if (slug && !slugToName.has(slug)) slugToName.set(slug, article.brand)
  }

  return Array.from(slugToName, ([slug, name]) => ({
    name,
    slug,
    articleCount: getArticlesByBrand(name).length,
  }))
    .filter((b) => b.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount)
}

export function getBrandBySlug(
  slug: string
): { name: string; slug: string; articleCount: number } | null {
  return getAllBrands().find((b) => b.slug === slug) ?? null
}

export function getFeaturedArticle(): ArticleMeta | null {
  const articles = getAllArticles()
  return articles[0] || null
}

export function getLatestArticles(count: number = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}

/**
 * Returns the most "popular" articles within the last `days` window,
 * ranked by total reactions count (sum of all 4 reaction types).
 * Articles with zero reactions fall back to publication-time ordering.
 * On KV failure, returns the latest `count` articles from the window.
 */
export async function getPopularArticles(
  count: number = 6,
  days: number = 14
): Promise<ArticleMeta[]> {
  const { getReactionTotalsBySlug } = await import('@/lib/reactions')

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const candidates = getAllArticles().filter(
    (a) => new Date(a.date).getTime() >= cutoff
  )
  if (candidates.length === 0) return getLatestArticles(count)

  const totals = await getReactionTotalsBySlug(candidates.map((a) => a.slug))

  return candidates
    .map((a) => ({ article: a, score: totals.get(a.slug) ?? 0 }))
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score
      return y.article.date.localeCompare(x.article.date)
    })
    .slice(0, count)
    .map((entry) => entry.article)
}

export { formatDate, formatDateShort } from '@/lib/date-utils'