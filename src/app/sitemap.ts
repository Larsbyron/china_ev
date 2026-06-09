import type { MetadataRoute } from 'next'
import { getAllArticles, getAllBrands } from '@/lib/articles'
import { TOPICS } from '@/lib/topics'
import { canonicalUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: canonicalUrl('/articles/'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: canonicalUrl('/themen/'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: canonicalUrl('/deutschland/'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: canonicalUrl('/brands/'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: canonicalUrl('/weekly/'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: canonicalUrl('/about/'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const topicPages: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: canonicalUrl(`/themen/${topic.slug}/`),
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const brandPages: MetadataRoute.Sitemap = getAllBrands().map((brand) => ({
    url: canonicalUrl(`/brands/${brand.slug}/`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: canonicalUrl(`/articles/${article.slug}/`),
    lastModified: article.date,
    changeFrequency: 'never' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...topicPages, ...brandPages, ...articlePages]
}
