import { getAllArticles } from '@/lib/articles'
import { canonicalUrl } from '@/lib/site'
import { buildNewsSitemap } from '@/lib/news-sitemap'

export const dynamic = 'force-static'

export function GET() {
  const xml = buildNewsSitemap(getAllArticles(), (slug) => canonicalUrl(`/articles/${slug}/`))

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
