// PCauto spider - https://www.pcauto.com.cn/
// Technik-fokussiert (PCauto Technical Center)

import { load } from 'cheerio'
import type { Article, SourceName } from '../../article'
import { formatDate } from '../../article'
import { sanitizeUrl } from '../ssrf'
import { extractBrand } from '../brands'

const SOURCE_NAME: SourceName = 'PCauto'
const BASE_URL = 'https://www.pcauto.com.cn'
const NEWS_URL = 'https://www.pcauto.com.cn/'

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

interface PCautoArticle {
  title: string
  url: string
  date?: string
  author?: string
  image?: string
}

function parseArticleList(html: string): PCautoArticle[] {
  const $ = load(html)
  const articles: PCautoArticle[] = []

  // PCauto article link patterns
  $('a[href*="/article/"], a[href*="/news/"], a[href*="/auto."]').each((_, el) => {
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

  // Also check specific selectors for news listings
  $('.article-title, .news-title, .list-title, .title, .news-list-title, .article-list-title').each((_, el) => {
    const $el = $(el)
    const title = $el.text().trim()
    const href = $el.attr('href')

    if (title && title.length > 5) {
      const url = href
        ? href.startsWith('http')
          ? href
          : BASE_URL + href
        : ''
      if (url) {
        articles.push({ title: title.slice(0, 200), url })
      }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanContentText($: any, selector: string): string {
  const $el = selector ? $(selector) : $
  if (!$el.length) return ''

  // Remove all interactive/interface elements
  $el.find('script, style, nav, header, footer, aside, iframe, .ad, .advertisement, .comment, .share, .related, .sidebar, .toolbar, .nav-bar, .menu, .btn, .button, .icon, .logo, .hotword, .search-box, .login, .user-info').remove()

  // Remove elements with known interface text patterns
  $el.find('[class*="tag"], [class*="breadcrumb"], [class*="pagination"], [class*="page-"]').remove()

  // Remove any remaining elements that look like navigation
  $el.find('a[href*="javascript"], a[href*="/#"], [class*="city"], [class*="switch"]').remove()

  let text = $el.text().trim()

  // Post-process: remove interface artifacts
  text = text
    // Remove remaining bracket patterns like [切换城市] [综合找]
    .replace(/【.*?】/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    // Remove app download artifacts
    .replace(/App herunterladen.*$/gm, '')
    .replace(/QR-Code.*$/gm, '')
    // Remove navigation text
    .replace(/汽车之家.*$/gm, '')
    .replace(/登录.*发布作品.*$/gm, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim()

  return text
}

function extractArticleContent(html: string): { text: string; image?: string; date?: string; author?: string } {
  const $ = load(html)

  // Remove non-content elements first
  $('script, style, nav, header, footer, aside, iframe, .ad, .advertisement, .comment, .share, .related, .sidebar, .toolbar, .nav-bar, .menu, .btn, .button, .icon, .logo, .hotword, .search-box, .login, .user-info').remove()

  // Try common article selectors
  const articleSelectors = [
    '#article-content',
    '.article-content',
    '.news-content',
    '.article-body',
    '.articleText',
    'article',
    '[itemprop="articleBody"]'
  ]

  let bestText = ''
  let bestLength = 0

  for (const selector of articleSelectors) {
    const text = cleanContentText($, selector)
    if (text.length > bestLength) {
      bestLength = text.length
      bestText = text
    }
  }

  // Only use if we got meaningful content (>500 chars after cleaning)
  if (bestLength < 500) {
    const $article = $('article, .article, .news-article, .post')
    if ($article.length) {
      const text = cleanContentText($article, '')
      if (text.length > bestLength) {
        bestText = text
        bestLength = text.length
      }
    }
  }

  // Extract image
  let image: string | undefined
  $('img').each((_, el) => {
    if (image) return
    const src = $(el).attr('src') || $(el).attr('data-src')
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon')) {
      image = src.startsWith('http') ? src : BASE_URL + src
    }
  })

  // Extract date
  let date: string | undefined
  $('time, [itemprop="datePublished"], .article-time, .news-time, .date, .time').each((_, el) => {
    if (date) return
    const text = $(el).text().trim() || $(el).attr('datetime')
    if (text) date = text
  })

  // Extract author
  let author: string | undefined
  $('[itemprop="author"], .author, .name, .source').each((_, el) => {
    if (author) return
    const text = $(el).text().trim()
    if (text && text.length < 50) author = text
  })

  return { text: bestText, image, date, author }
}

export async function scrapePCauto(maxArticles = 5): Promise<Article[]> {
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

      if (!extracted.text || extracted.text.length < 500) {
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
