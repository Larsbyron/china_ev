import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { articleFrontmatterSchema } from '@/lib/schemas'
import { markdownToHtml } from '@/lib/markdown'

export interface Article {
  slug: string
  title: string
  date: string
  description: string
  source: string
  image?: string
  category: string
  brand?: string
  tags: string[]
  draft: boolean
  original_url: string
  read_time_minutes: number
  ev_model?: string
  content: string
}

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  description: string
  source: string
  image?: string
  category: string
  brand?: string
  tags: string[]
  draft: boolean
  original_url: string
  read_time_minutes: number
  ev_model?: string
}

export type Brand = {
  name: string
  slug: string
  articleCount: number
  latestArticle?: ArticleMeta
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
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

    return {
      slug,
      title: validated.title,
      date: validated.date,
      description: validated.description,
      source: validated.source,
      image: validated.image,
      category: validated.category,
      brand: validated.brand,
      tags: validated.tags,
      draft: validated.draft,
      original_url: validated.original_url,
      read_time_minutes: validated.read_time_minutes ?? calculateReadTime(content),
      ev_model: validated.ev_model,
      content,
    }
  } catch {
    return null
  }
}

export function getAllArticles(): ArticleMeta[] {
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
  return getAllArticles().filter(
    (article) =>
      article.brand?.toLowerCase() === brand.toLowerCase()
  )
}

export function getAllBrands(): { name: string; slug: string; articleCount: number }[] {
  const brands = [
    { name: 'BYD', slug: 'byd' },
    { name: 'NIO', slug: 'nio' },
    { name: 'XPeng', slug: 'xpeng' },
    { name: 'Li Auto', slug: 'li-auto' },
    { name: 'MG', slug: 'mg' },
    { name: 'Geely', slug: 'geely' },
    { name: 'Zeekr', slug: 'zeekr' },
    { name: 'Xiaomi', slug: 'xiaomi' },
  ]

  const articles = getAllArticles()

  return brands.map((brand) => {
    const brandArticles = articles.filter(
      (a) => a.brand?.toLowerCase() === brand.slug.toLowerCase()
    )
    return {
      ...brand,
      articleCount: brandArticles.length,
    }
  }).filter((b) => b.articleCount > 0)
}

export function getFeaturedArticle(): ArticleMeta | null {
  const articles = getAllArticles()
  return articles[0] || null
}

export function getLatestArticles(count: number = 6): ArticleMeta[] {
  return getAllArticles().slice(0, count)
}

export { formatDate, formatDateShort } from '@/lib/date-utils'