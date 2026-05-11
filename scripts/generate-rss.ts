import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://china-autonews.de').trim()
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const OUT_DIR = path.join(process.cwd(), 'out')

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRss(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory, skipping RSS generation')
    return
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))

  const articles = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      if (data.draft) return null

      const slug = file.replace(/\.md$/, '')
      const wordCount = content.split(/\s+/).filter(Boolean).length
      const readTime = Math.max(1, Math.ceil(wordCount / 200))

      return {
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        slug,
        source: data.source as string,
        brand: data.brand as string | undefined,
        image: data.image as string | undefined,
        readTime,
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())

  const items = articles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article!.title)}</title>
      <link>${BASE_URL}/articles/${article!.slug}/</link>
      <guid isPermaLink="true">${BASE_URL}/articles/${article!.slug}/</guid>
      <description>${escapeXml(article!.description)}</description>
      <pubDate>${new Date(article!.date).toUTCString()}</pubDate>
      <category>${escapeXml(article!.source)}</category>
      ${article!.brand ? `<category>${escapeXml(article!.brand)}</category>` : ''}
      ${article!.image ? `<enclosure url="${escapeXml(BASE_URL + article!.image)}" type="image/webp" length="0" />` : ''}
    </item>`
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>E-AUTOS — China EV News auf Deutsch</title>
    <link>${BASE_URL}/</link>
    <description>Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.</description>
    <language>de</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  fs.writeFileSync(path.join(OUT_DIR, 'feed.xml'), rss, 'utf-8')
  console.log(`RSS feed generated: ${articles.length} items → out/feed.xml`)
}

generateRss()
