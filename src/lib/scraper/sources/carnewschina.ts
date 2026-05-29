// CarNewsChina - https://carnewschina.com
// English-language Chinese auto news aggregator — content needs German translation

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { toISODateString } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'CarNewsChina'
const BASE_URL = 'https://carnewschina.com'

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

  // CarNewsChina 是 WordPress 网站，文章链接格式为 /YYYY/MM/DD/slug/
  const articleUrlPattern = /\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/

  // 查找所有文章链接
  $('a[href]').each((_, el) => {
    const $el = $(el)
    const href = ($el.attr('href') || '').trim()
    const title = $el.text().trim()

    if (!href || !title || title.length < 10) return
    if (seen.has(href)) return

    // 只匹配文章详情页链接
    if (articleUrlPattern.test(href)) {
      seen.add(href)
      const fullUrl = href.startsWith('http') ? href : BASE_URL + href
      links.push({ title: title.slice(0, 200), url: fullUrl })
    }
  })

  // 如果按 URL 模式没找到，回退到宽松匹配
  if (links.length === 0) {
    $('article a, h2 a, h3 a').each((_, el) => {
      const $el = $(el)
      const href = $el.attr('href')
      const title = $el.text().trim()

      if (href && title && title.length > 8 && !href.includes('javascript') && !seen.has(href)) {
        seen.add(href)
        const fullUrl = href.startsWith('http') ? href : BASE_URL + href
        links.push({ title: title.slice(0, 200), url: fullUrl })
      }
    })
  }

  return links
}

// URL fragments that indicate non-article images (ads, tracking, UI chrome).
// Use path-segment forms (/ad/, /ads/) to avoid false matches on words like "uploads".
const SKIP_IMAGE_PATTERNS = [
  'avatar', 'logo', 'icon', 'emoji', 'banner', '/ad/', '/ads/',
  'sponsor', 'pixel', 'track', 'beacon', 'analytics',
  'button', 'arrow', 'placeholder', 'blank', 'spacer', 'separator',
]

function isArticleImage(src: string): boolean {
  const lower = src.toLowerCase()
  return SKIP_IMAGE_PATTERNS.every((pat) => !lower.includes(pat))
}

function resolveUrl(src: string): string {
  if (src.startsWith('http')) return src
  if (src.startsWith('//')) return 'https:' + src
  return BASE_URL + src
}

function extractArticleContent(html: string): { text: string; image?: string; images: string[]; date?: string } {
  const $ = load(html)

  $('script, style, nav, header, footer, aside, iframe, .ad, .comment, .share, .sidebar, .related, .block__newsletter, .block__popular_topics, .block__popular_col_wrapper').remove()

  // CarNewsChina 文章正文 class: .article_detail__content
  let bestText = ''
  const selectors = ['.article_detail__content', '.entry-content', '.post-content', '.article-content', 'article', '.content']

  for (const sel of selectors) {
    const text = $(sel).text().trim().replace(/\s+/g, ' ')
    if (text.length > bestText.length) {
      bestText = text
    }
  }

  if (bestText.length < 300) {
    bestText = $('article, .post, .article_detail__main_area').text().trim().replace(/\s+/g, ' ')
  }

  // Collect all article images (deduplicated, filtered, capped at 6)
  const seenUrls = new Set<string>()
  const allImages: string[] = []

  $('img').each((_, el) => {
    if (allImages.length >= 6) return
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || ''
    if (!src || !isArticleImage(src)) return
    const resolved = resolveUrl(src)
    if (!seenUrls.has(resolved)) {
      seenUrls.add(resolved)
      allImages.push(resolved)
    }
  })

  // Fallback: accept fly-images thumbnails if nothing found
  if (allImages.length === 0) {
    $('img').each((_, el) => {
      if (allImages.length >= 6) return
      const src = $(el).attr('src') || $(el).attr('data-src') || ''
      if (src && (src.includes('fly-images') || src.includes('wp-content'))) {
        const resolved = resolveUrl(src)
        if (!seenUrls.has(resolved)) {
          seenUrls.add(resolved)
          allImages.push(resolved)
        }
      }
    })
  }

  const [image, ...extraImages] = allImages

  let date: string | undefined
  $('time, .article_detail_meta__date, .entry-date, .post-date, [datetime]').each((_, el) => {
    if (date) return
    const text = $(el).text().trim() || $(el).attr('datetime')
    if (text) date = text
  })

  return { text: bestText, image, images: extraImages, date }
}

export async function scrapeCarNewsChina(maxArticles = 5): Promise<Article[]> {
  console.log(`[${SOURCE_NAME}] Fetching article list...`)

  const html = await fetchPage(BASE_URL)
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
        images: extracted.images,
        source: SOURCE_NAME,
        originalUrl: link.url,
        brand: extractBrand(link.title, extracted.text),
      })

      console.log(`[${SOURCE_NAME}] OK (${extracted.text.length} chars, imgs: ${1 + extracted.images.length})`)
    } catch (error) {
      console.error(`[${SOURCE_NAME}] Error scraping ${link.url}:`, error)
    }
  }

  return articles
}

export { SOURCE_NAME }
