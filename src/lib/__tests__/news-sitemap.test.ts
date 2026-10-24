import { describe, it, expect } from 'vitest'
import { buildNewsSitemap, selectNewsArticles, escapeXml, NEWS_SITEMAP_MAX_ITEMS } from '../news-sitemap'
import type { ArticleMeta } from '../articles'

function article(overrides: Partial<ArticleMeta> = {}): ArticleMeta {
  return {
    slug: 'beispiel-artikel',
    title: 'Beispiel: BYD Seal 07 mit 875 km Reichweite',
    date: '2026-10-23T10:00:00.000Z',
    description: 'Beschreibung',
    source: 'CarNewsChina',
    category: 'news',
    brands: ['BYD'],
    tags: [],
    draft: false,
    original_url: 'https://example.com/a',
    read_time_minutes: 3,
    secondaryTopics: [],
    ...overrides,
  } as ArticleMeta
}

const NOW = new Date('2026-10-24T06:00:00.000Z')
const url = (slug: string) => `https://china-autonews.de/articles/${slug}/`

describe('news-sitemap / selectNewsArticles', () => {
  it('keeps only articles from the last 48 hours', () => {
    const fresh = article({ slug: 'frisch', date: '2026-10-23T10:00:00.000Z' })
    const old = article({ slug: 'alt', date: '2026-10-20T10:00:00.000Z' })
    const selected = selectNewsArticles([fresh, old], NOW)
    expect(selected.map((a) => a.slug)).toEqual(['frisch'])
  })

  it('drops drafts and unparseable dates', () => {
    const draft = article({ slug: 'draft', draft: true })
    const broken = article({ slug: 'kaputt', date: 'irgendwann' })
    expect(selectNewsArticles([draft, broken], NOW)).toEqual([])
  })

  it('sorts newest first and caps at the sitemap limit', () => {
    const many = Array.from({ length: NEWS_SITEMAP_MAX_ITEMS + 5 }, (_, i) =>
      article({
        slug: `a${i}`,
        date: new Date(NOW.getTime() - i * 60_000).toISOString(),
      })
    )
    const selected = selectNewsArticles([article({ slug: 'older', date: '2026-10-23T09:00:00.000Z' }), ...many], NOW)
    expect(selected).toHaveLength(NEWS_SITEMAP_MAX_ITEMS)
    expect(selected[0].slug).toBe('a0')
  })
})

describe('news-sitemap / buildNewsSitemap', () => {
  it('emits the Google News namespace and required child elements', () => {
    const xml = buildNewsSitemap([article()], url, NOW)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"')
    expect(xml).toContain('<loc>https://china-autonews.de/articles/beispiel-artikel/</loc>')
    expect(xml).toContain('<news:name>E-AUTOS</news:name>')
    expect(xml).toContain('<news:language>de</news:language>')
    expect(xml).toContain('<news:publication_date>2026-10-23T10:00:00.000Z</news:publication_date>')
    expect(xml).toContain('<news:title>Beispiel: BYD Seal 07 mit 875 km Reichweite</news:title>')
  })

  it('escapes XML-special characters in titles', () => {
    const xml = buildNewsSitemap([article({ title: 'Preis & Technik < 30.000 € "neu"' })], url, NOW)
    expect(xml).toContain('Preis &amp; Technik &lt; 30.000 € &quot;neu&quot;')
    expect(xml).not.toContain('<news:title>Preis & Technik')
  })

  it('returns a valid empty urlset when nothing is recent', () => {
    const xml = buildNewsSitemap([article({ date: '2026-01-01T00:00:00.000Z' })], url, NOW)
    expect(xml).toContain('<urlset')
    expect(xml).toContain('</urlset>')
    expect(xml).not.toContain('<url>')
  })

  it('escapeXml covers all five predefined entities', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;')
  })
})
