// OFweek NEV spider - https://nev.ofweek.com/
// Professional EV industry media

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { toISODateString } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'OFweek NEV'
const BASE_URL = 'https://nev.ofweek.com'
const LIST_URL = 'https://nev.ofweek.com/CATList-71000-8200-nev.html'

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
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Referer': BASE_URL
    }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}

function parseArticleList(html: string): { title: string; url: string }[] {
  const $ = load(html)
  const articles: { title: string; url: string }[] = []

  // OFweek article URLs contain /ART-
  $('a[href*="/ART-"]').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href')
    const title = $el.text().trim()

    if (!href || !title || title.length < 8 || title.length > 200) return
    if (href.includes('javascript')) return

    const fullUrl = href.startsWith('http') ? href
      : href.startsWith('//') ? 'https:' + href
      : BASE_URL + href

    articles.push({ title, url: fullUrl })
  })

  const seen = new Set<string>()
  return articles.filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true })
}

function extractContent(html: string): { text: string; image?: string; date?: string } {
  const $ = load(html)

  // Remove boilerplate
  $('script, style, nav, header, footer, aside, iframe').remove()
  $('[class*="header"], [class*="nav"], [class*="footer"], [class*="side"], [class*="recommend"], [class*="related"]').remove()
  $('[id*="header"], [id*="nav"], [id*="footer"], [id*="side"]').remove()

  const selectors = [
    '.article-content',
    '.news-content',
    '#article-content',
    '.content-text',
    '.main-content',
    '[itemprop="articleBody"]',
    '.article-body'
  ]

  let bestText = ''
  for (const sel of selectors) {
    const text = $(sel).text().replace(/\s+/g, ' ').trim()
    if (text.length > bestText.length) bestText = text
  }

  if (bestText.length < 200) {
    // Fallback: grab largest text block
    $('div, section').each((_, el) => {
      const text = $(el).clone().children('div, section, nav, header, footer').remove().end().text().replace(/\s+/g, ' ').trim()
      if (text.length > bestText.length && text.length < 20000) bestText = text
    })
  }

  let image: string | undefined
  $('img').each((_, el) => {
    if (image) return
    const src = $(el).attr('src') || $(el).attr('data-src') || ''
    if (!src) return
    const skip = ['avatar', 'logo', 'icon', 'gif', '1x1', 'loading', 'qrcode', 'weixin', 'bar/', 'ofweek/images']
    if (skip.some(s => src.includes(s))) return
    image = src.startsWith('http') ? src : src.startsWith('//') ? 'https:' + src : BASE_URL + src
  })

  let date: string | undefined
  $('time, [itemprop="datePublished"], .pub-time, .article-time, .date, .time').each((_, el) => {
    if (date) return
    date = $(el).text().trim() || $(el).attr('datetime')
  })

  return { text: bestText, image, date }
}

export async function scrapeOfweekNev(maxArticles = 5): Promise<Article[]> {
  console.log(`[${SOURCE_NAME}] Fetching article list...`)

  const html = await fetchPage(LIST_URL)
  const links = parseArticleList(html)
  console.log(`[${SOURCE_NAME}] Found ${links.length} article links`)

  const articles: Article[] = []
  const seen = new Set<string>()

  for (const link of links) {
    if (articles.length >= maxArticles) break
    if (seen.has(link.url)) continue
    seen.add(link.url)

    try {
      await delay(DELAY_MS)
      console.log(`[${SOURCE_NAME}] Scraping: ${link.title.slice(0, 50)}...`)

      const articleHtml = await fetchPage(link.url)
      const extracted = extractContent(articleHtml)

      if (!extracted.text || extracted.text.length < 200) {
        console.log(`[${SOURCE_NAME}] Skipping (insufficient content: ${extracted.text?.length || 0} chars)`)
        continue
      }

      articles.push({
        title: link.title,
        content: extracted.text,
        date: extracted.date || toISODateString(new Date()),
        image: extracted.image,
        source: SOURCE_NAME,
        originalUrl: link.url,
        brand: extractBrand(link.title, extracted.text)
      })

      console.log(`[${SOURCE_NAME}] OK (${extracted.text.length} chars, img: ${!!extracted.image})`)
    } catch (error) {
      console.error(`[${SOURCE_NAME}] Error scraping ${link.url}:`, error)
    }
  }

  return articles
}

export { SOURCE_NAME }
