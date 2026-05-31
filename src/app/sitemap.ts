import type { MetadataRoute } from 'next'
import { getAllArticles, getAllBrands } from '@/lib/articles'
import { TOPICS } from '@/lib/topics'

export const dynamic = 'force-static'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://china-autonews.de').trim()

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/articles/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/themen/`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/deutschland/`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/brands/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/weekly/`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const topicPages: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${BASE_URL}/themen/${topic.slug}/`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const brandPages: MetadataRoute.Sitemap = getAllBrands().map((brand) => ({
    url: `${BASE_URL}/brands/${brand.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}/`,
    lastModified: article.date,
    changeFrequency: 'never' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...topicPages, ...brandPages, ...articlePages]
}
