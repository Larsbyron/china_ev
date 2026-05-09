// Autohome NewEnergy spider - https://www.autohome.com.cn/newenergy/
// Dedicated EV section of China's biggest auto portal

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { toISODateString } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'Autohome NewEnergy'
const BASE_URL = 'https://www.autohome.com.cn'
const NEWS_URL = 'https://www.autohome.com.cn/newenergy/'

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
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  // Article pages are UTF-8 (Next.js); listing page may be GB2312
  // Check Content-Type header first
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('utf-8') || contentType.includes('UTF-8')) {
    return response.text()
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Check for UTF-8 BOM or meta charset=utf-8 in first 2KB
  const preview = buffer.slice(0, 2048).toString('latin1')
  if (preview.includes('charset="utf-8"') || preview.includes("charset='utf-8'") || preview.includes('charSet="utf-8"')) {
    return buffer.toString('utf8')
  }

  // Detect GB2312 by byte pattern analysis
  let gbScore = 0
  for (let i = 0; i < Math.min(buffer.length, 1000); i++) {
    const b = buffer[i]
    if (b >= 0xa1 && b <= 0xf7 && i + 1 < buffer.length) {
      const b2 = buffer[i + 1]
      if (b2 >= 0xa1 && b2 <= 0xfe) { gbScore++; i++ }
    }
  }
  return gbScore > 10 ? buffer.toString('latin1') : buffer.toString('utf8')
}

function parseArticleList(html: string): { title: string; url: string }[] {
  const $ = load(html)
  const articles: { title: string; url: string }[] = []

  $('a[href*="/news/"]').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href')
    const title = $el.text().trim()

    if (!href || !title || title.length < 8 || title.length > 200) return
    if (href.includes('javascript')) return

    // Strip tracking hash fragments (#pvareaid=...) before processing
    const cleanHref = href.split('#')[0]

    const fullUrl = cleanHref.startsWith('http') ? cleanHref
      : cleanHref.startsWith('//') ? 'https:' + cleanHref
      : BASE_URL + cleanHref

    // Only keep actual article URLs (contain numeric ID pattern /news/YYYYMM/ID.html)
    if (!/\/news\/\d{6}\/\d+\.html/.test(fullUrl)) return

    articles.push({ title: title.replace(/[\[【].*?[\]】]/g, '').trim(), url: fullUrl })
  })

  const seen = new Set<string>()
  return articles.filter(a => { if (seen.has(a.url)) return false; seen.add(a.url); return true })
}

function extractContent(html: string): { text: string; image?: string; date?: string } {
  // Autohome is a Next.js app — article content is embedded in __NEXT_DATA__ JSON
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]+?)<\/script>/)
  if (nextDataMatch) {
    try {
      const data = JSON.parse(nextDataMatch[1])
      const props = data?.props?.pageProps || {}
      const ac = props.articleContent || {}

      // articleContent is an object with .content (HTML), .img, .publishDate
      const rawContent: string = typeof ac.content === 'string' ? ac.content : ''
      const text = rawContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()

      const image: string | undefined = typeof ac.img === 'string' && ac.img.startsWith('http') ? ac.img : undefined
      const date: string | undefined = typeof ac.publishDate === 'string' ? ac.publishDate : undefined

      if (text.length > 100) return { text, image, date }
    } catch {
      // Fall through to DOM parsing
    }
  }

  // Fallback: DOM parsing
  const $ = load(html)
  $('script, style, nav, header, footer, aside, iframe').remove()

  const selectors = ['#article-content', '.article-content', '.news-content', '[itemprop="articleBody"]']
  let bestText = ''
  for (const sel of selectors) {
    const text = $(sel).text().replace(/\s+/g, ' ').trim()
    if (text.length > bestText.length) bestText = text
  }

  let image: string | undefined
  $('img').each((_, el) => {
    if (image) return
    const src = $(el).attr('src') || $(el).attr('data-src')
    if (src && !src.includes('avatar') && !src.includes('logo')) {
      image = src.startsWith('http') ? src : BASE_URL + src
    }
  })

  return { text: bestText, image }
}

export async function scrapeAutohomeNewEnergy(maxArticles = 5): Promise<Article[]> {
  console.log(`[${SOURCE_NAME}] Fetching article list...`)

  const html = await fetchPage(NEWS_URL)
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

      if (!extracted.text || extracted.text.length < 300) {
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
