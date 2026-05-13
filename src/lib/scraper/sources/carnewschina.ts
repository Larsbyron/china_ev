// CarNewsChina - https://carnewschina.com
// English-language Chinese auto news aggregator — content needs German translation

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { toISODateString } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'CarNewsChina'
const BASE_URL = 'https://carnewschina.com'
const NEWS_URL = 'https://carnewschina.com'

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
      'Accept-Language': 'en-US,en;q=0.9'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.text()
}

function parseArticleList(html: string): Array<{ title: string; url: string; image?: string }> {
  const $ = load(html)
  const links: Array<{ title: string; url: string; image?: string }> = []
  const seen = new Set<string>()

  $('article a, .post a, .entry a, h2 a, h3 a').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href')
    const title = $el.text().trim()

    if (href && title && title.length > 8 && !href.includes('javascript') && !seen.has(href)) {
      seen.add(href)
      const fullUrl = href.startsWith('http') ? href : BASE_URL + href
      links.push({ title: title.slice(0, 200), url: fullUrl })
    }
  })

  return links
}

function extractArticleContent(html: string): { text: string; image?: string; date?: string } {
  const $ = load(html)

  $('script, style, nav, header, footer, aside, iframe, .ad, .comment, .share, .sidebar, .related').remove()

  const selectors = ['.entry-content', '.post-content', '.article-content', 'article', '.content']
  let bestText = ''
  for (const sel of selectors) {
    const text = $(sel).text().trim().replace(/\s+/g, ' ')
    if (text.length > bestText.length) {
      bestText = text
    }
  }

  if (bestText.length < 300) {
    bestText = $('article, .post').text().trim().replace(/\s+/g, ' ')
  }

  let image: string | undefined
  $('img').each((_, el) => {
    if (image) return
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon') && !src.includes('emoji')) {
      image = src.startsWith('http') ? src : BASE_URL + src
    }
  })

  let date: string | undefined
  $('time, .date, .entry-date, .post-date').each((_, el) => {
    if (date) return
    const text = $(el).text().trim() || $(el).attr('datetime')
    if (text) date = text
  })

  return { text: bestText, image, date }
}

export async function scrapeCarNewsChina(maxArticles = 5): Promise<Article[]> {
  console.log(`[${SOURCE_NAME}] Fetching article list...`)

  const html = await fetchPage(NEWS_URL)
  const articleLinks = parseArticleList(html)

  console.log(`[${SOURCE_NAME}] Found ${articleLinks.length} article links`)

  const articles: Article[] = []

  for (const link of articleLinks) {
    if (articles.length >= maxArticles) break

    try {
      await delay(DELAY_MS)

      console.log(`[${SOURCE_NAME}] Scraping: ${link.title.slice(0, 50)}...`)
      const articleHtml = await fetchPage(link.url)
      const extracted = extractArticleContent(articleHtml)

      if (!extracted.text || extracted.text.length < 400) {
        console.log(`[${SOURCE_NAME}] Skipping (insufficient content: ${extracted.text?.length || 0} chars)`)
        continue
      }

      articles.push({
        title: link.title,
        content: extracted.text,
        date: extracted.date || toISODateString(new Date()),
        image: extracted.image || link.image,
        source: SOURCE_NAME,
        originalUrl: link.url,
        brand: extractBrand(link.title, extracted.text),
      })

      console.log(`[${SOURCE_NAME}] OK (${extracted.text.length} chars)`)
    } catch (error) {
      console.error(`[${SOURCE_NAME}] Error scraping ${link.url}:`, error)
    }
  }

  return articles
}

export { SOURCE_NAME }
