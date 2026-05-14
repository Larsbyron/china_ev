// D1EV (第一电动) - https://www.d1ev.com/news
// Professional NEV media covering electric vehicles, policy, and industry

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { toISODateString } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'D1EV'
const BASE_URL = 'https://www.d1ev.com'
const NEWS_URL = 'https://www.d1ev.com/news'

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

function parseArticleList(html: string): Array<{ title: string; url: string }> {
  const $ = load(html)
  const links: Array<{ title: string; url: string }> = []
  const seen = new Set<string>()

  // D1EV 文章列表结构: .article--wraped > .article--content > .article_p > a
  $('.article--wraped .article_p a[href^="/news/"]').each((_, el) => {
    const $el = $(el)
    const href = $el.attr('href')
    const title = $el.text().trim()

    if (href && title && title.length > 5) {
      const fullUrl = BASE_URL + href
      if (!seen.has(fullUrl)) {
        seen.add(fullUrl)
        links.push({ title: title.slice(0, 200), url: fullUrl })
      }
    }
  })

  // 如果主选择器没找到，回退到宽泛匹配
  if (links.length === 0) {
    $('a[href^="/news/"]').each((_, el) => {
      const $el = $(el)
      const href = $el.attr('href')
      const title = $el.text().trim()

      if (href && title && title.length > 10 && !href.includes('javascript') && !href.includes('list-')) {
        const fullUrl = BASE_URL + href
        if (!seen.has(fullUrl)) {
          seen.add(fullUrl)
          links.push({ title: title.slice(0, 200), url: fullUrl })
        }
      }
    })
  }

  return links
}

function extractArticleContent(html: string): { text: string; image?: string; date?: string } {
  const $ = load(html)

  $('script, style, nav, header, footer, aside, iframe, .ad, .comment, .share, .sidebar, .ws-right, .ws-hotdoc, .ws-newsflash-wrap').remove()

  // 主要选择器: .ws-newscon（D1EV 文章正文区域）
  let bestText = ''
  const selectors = ['.ws-newscon', '.articles--wraped', '.article-content', '#article_content', '.news-content', 'article', '.post-content']

  for (const sel of selectors) {
    const text = $(sel).text().trim().replace(/\s+/g, ' ')
    if (text.length > bestText.length) {
      bestText = text
    }
  }

  // 如果内容不够，尝试更宽泛的匹配
  if (bestText.length < 500) {
    bestText = $('.ws-content, .main_content, article, .article').text().trim().replace(/\s+/g, ' ')
  }

  let image: string | undefined
  $('img').each((_, el) => {
    if (image) return
    const src = $(el).attr('src') || $(el).attr('data-src')
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon') && !src.includes('no-picture')) {
      image = src.startsWith('http') ? src : (src.startsWith('//') ? 'https:' + src : BASE_URL + src)
    }
  })

  let date: string | undefined
  $('time, .date, .time, .pub-time, .article--time, .timeago').each((_, el) => {
    if (date) return
    const text = $(el).text().trim() || $(el).attr('datetime')
    if (text) date = text
  })

  return { text: bestText, image, date }
}

export async function scrapeD1EV(maxArticles = 5): Promise<Article[]> {
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

      if (!extracted.text || extracted.text.length < 500) {
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
