// Ifeng spider - https://auto.ifeng.com/
// Phoenix Auto - high quality journalism

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { formatDate } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'Ifeng'
const BASE_URL = 'https://auto.ifeng.com'
const NEWS_URL = 'https://auto.ifeng.com/'

// Rate limit: 1 request per second
const DELAY_MS = 1000

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<string> {
  sanitizeUrl(url)
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.text()
}

interface IfengArticle {
  title: string
  url: string
  date?: string
  author?: string
  image?: string
}

function parseArticleList(html: string): IfengArticle[] {
  const $ = load(html)
  const articles: IfengArticle[] = []

  // Ifeng auto article patterns
  $('a[href*="/auto."]').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href')
    const title = $el.text().trim()

    if (href && title && title.length > 5 && !href.includes('javascript')) {
      const fullUrl = href.startsWith('http') ? href : BASE_URL + href
      articles.push({
        title: title.slice(0, 200),
        url: fullUrl
      })
    }
  })

  // Also check specific selectors
  $('.title a, .news_title a, .article-title a, .list-title a').each((_, el) => {
    const $el = $(el)
    const title = $el.text().trim()
    const href = $el.attr('href')

    if (title && title.length > 5 && href) {
      const url = href.startsWith('http') ? href : BASE_URL + href
      articles.push({ title: title.slice(0, 200), url })
    }
  })

  // Remove duplicates
  const seen = new Set<string>()
  return articles.filter(article => {
    if (seen.has(article.url)) return false
    seen.add(article.url)
    return true
  })
}

function extractArticleContent(html: string): { text: string; image?: string; date?: string; author?: string } {
  const $ = load(html)
  const content: { text: string; image?: string; date?: string; author?: string } = {
    text: '',
    image: undefined
  }

  // Remove non-content elements
  $('script, style, nav, header, footer, aside, .ad, .advertisement, .comment, .share, .related, .sidebar, .tag, .source').remove()

  // Try common article selectors
  const articleSelectors = [
    '#articleContent',
    '.article-content',
    '.news-content',
    '.article_text',
    '.main-text',
    'article',
    '.content'
  ]

  let articleEl: ReturnType<typeof $> | null = null
  for (const selector of articleSelectors) {
    articleEl = $(selector)
    if (articleEl.length && articleEl.text().trim().length > 200) {
      break
    }
  }

  if (!articleEl || articleEl.text().trim().length < 200) {
    let bestEl: ReturnType<typeof $> | undefined = undefined
    let bestLength = 0

    $('div, section').each((_, el) => {
      const $el = $(el)
      const text = $el.text().trim()
      if (text.length > 500 && text.length > bestLength) {
        bestLength = text.length
        bestEl = $el
      }
    })

    if (bestEl !== undefined) {
      articleEl = bestEl
    }
  }

  if (articleEl && articleEl.length) {
    content.text = articleEl.text().trim().replace(/\s+/g, ' ')
  }

  // Extract image
  $('img').each((_, el) => {
    if (content.image) return
    const src = $(el).attr('src')
    const dataSrc = $(el).attr('data-src')
    if (src && !src.includes('avatar') && !src.includes('logo')) {
      content.image = src.startsWith('http') ? src : BASE_URL + src
    } else if (dataSrc) {
      content.image = dataSrc.startsWith('http') ? dataSrc : BASE_URL + dataSrc
    }
  })

  // Extract date
  $('time, .date, .time, [itemprop="datePublished"]').each((_, el) => {
    if (content.date) return
    const dateText = $(el).text().trim() || $(el).attr('datetime')
    if (dateText) {
      content.date = dateText
    }
  })

  // Extract author
  $('[itemprop="author"], .author, .source-name').each((_, el) => {
    if (content.author) return
    content.author = $(el).text().trim()
  })

  return content
}

export async function scrapeIfeng(maxArticles = 5): Promise<Article[]> {
  console.log(`[${SOURCE_NAME}] Fetching article list...`)

  const html = await fetchPage(NEWS_URL)
  const articleLinks = parseArticleList(html)

  console.log(`[${SOURCE_NAME}] Found ${articleLinks.length} article links`)

  const articles: Article[] = []
  const processedUrls = new Set<string>()

  for (const link of articleLinks) {
    if (articles.length >= maxArticles) break
    if (processedUrls.has(link.url)) continue
    processedUrls.add(link.url)

    try {
      await delay(DELAY_MS)

      console.log(`[${SOURCE_NAME}] Scraping: ${link.title.slice(0, 50)}...`)
      const articleHtml = await fetchPage(link.url)
      const extracted = extractArticleContent(articleHtml)

      if (!extracted.text || extracted.text.length < 100) {
        console.log(`[${SOURCE_NAME}] Skipping (insufficient content: ${extracted.text?.length || 0} chars)`)
        continue
      }

      const article: Article = {
        title: link.title,
        content: extracted.text,
        date: extracted.date || formatDate(new Date()),
        author: extracted.author,
        image: extracted.image,
        source: SOURCE_NAME,
        originalUrl: link.url,
        brand: extractBrand(link.title, extracted.text)
      }

      articles.push(article)
      console.log(`[${SOURCE_NAME}] OK (${extracted.text.length} chars, img: ${!!extracted.image})`)
    } catch (error) {
      console.error(`[${SOURCE_NAME}] Error scraping ${link.url}:`, error)
    }
  }

  return articles
}

export { SOURCE_NAME }
