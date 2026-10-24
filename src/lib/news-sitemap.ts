import type { ArticleMeta } from './articles'

/**
 * Google News sitemap (news-sitemap.xml).
 *
 * 规则（Google 官方文档，2026-10 核对）：
 * - 只放最近 48 小时内发布的文章；
 * - 每个 <url> 必须带 news:news（publication / publication_date / title）；
 * - publication_date 必须是带时区的 ISO 8601；
 * - 单个文件最多 1,000 条。
 * 站点由 CI 每天 3 次重新构建，因此 48h 窗口会随部署自动滚动。
 */
export const NEWS_SITEMAP_MAX_ITEMS = 1000
export const NEWS_SITEMAP_WINDOW_HOURS = 48
export const PUBLICATION_NAME = 'E-AUTOS'
export const PUBLICATION_LANGUAGE = 'de'

const NEWS_NS = 'http://www.google.com/schemas/sitemap-news/0.9'
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 选出窗口内的可发布文章，按时间倒序，最多 1000 条。
 * 日期解析失败或缺失的文章一律丢弃（宁可少一条，也不要非法 news:publication_date）。
 */
export function selectNewsArticles(
  articles: ArticleMeta[],
  now: Date = new Date(),
  windowHours: number = NEWS_SITEMAP_WINDOW_HOURS
): ArticleMeta[] {
  const nowMs = now.getTime()
  const sinceMs = nowMs - windowHours * 3600 * 1000
  // 允许未来 24h 内的日期（时区/CI 时钟偏差），超过则视为脏数据
  const maxMs = nowMs + 24 * 3600 * 1000

  return articles
    .filter((a) => !a.draft)
    .map((a) => ({ article: a, ts: Date.parse(a.date) }))
    .filter((x) => Number.isFinite(x.ts) && x.ts >= sinceMs && x.ts <= maxMs)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, NEWS_SITEMAP_MAX_ITEMS)
    .map((x) => x.article)
}

export function buildNewsSitemap(
  articles: ArticleMeta[],
  articleUrl: (slug: string) => string,
  now: Date = new Date(),
  windowHours: number = NEWS_SITEMAP_WINDOW_HOURS
): string {
  const selected = selectNewsArticles(articles, now, windowHours)

  const entries = selected
    .map((article) => {
      const loc = escapeXml(articleUrl(article.slug))
      const publishedAt = new Date(Date.parse(article.date)).toISOString()
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        '    <news:news>',
        '      <news:publication>',
        `        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>`,
        `        <news:language>${PUBLICATION_LANGUAGE}</news:language>`,
        '      </news:publication>',
        `      <news:publication_date>${publishedAt}</news:publication_date>`,
        `      <news:title>${escapeXml(article.title)}</news:title>`,
        '    </news:news>',
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}" xmlns:news="${NEWS_NS}">`,
    entries,
    '</urlset>',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n')
}
