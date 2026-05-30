import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Hero from '@/components/Hero'
import ArticleCard from '@/components/ArticleCard'
import ArticleListItem from '@/components/ArticleListItem'
import StatusBadge from '@/components/StatusBadge'
import NewsletterForm from '@/components/NewsletterForm'
import {
  getAllArticles,
  getFeaturedArticle,
  getArticlesByTopic,
  getDeutschlandArticles,
} from '@/lib/articles'
import type { ArticleMeta } from '@/lib/articles'
import { rankArticles } from '@/lib/ranking'
import { TOPICS } from '@/lib/topics'
import {
  MIN_SHELF_ARTICLES,
  SHELF_ARTICLES_PER_TOPIC,
  HOMEPAGE_ARTICLE_TARGET,
  DEUTSCHLAND_SHELF_COUNT,
} from '@/lib/ranking-config'
import styles from './page.module.css'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'E-AUTOS | China EV News auf Deutsch',
  description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.',
}

// Shelf grid is 4 columns on desktop (2 / 1 on smaller screens).
const SHELF_COLUMNS = 4

// Reorder shelf articles image-first, then tag each with whether to show its
// image. Only *whole rows* (multiples of the column count) show images, so
// every rendered row is uniform — no image card ever sits next to a text card.
// A shelf with fewer than one full row of images goes fully text-only, which
// looks cleaner than a ragged partial image row (uniform over decorative).
// Multiples of 4 are also multiples of 2 and 1, so rows stay uniform at every
// breakpoint. Stable partition preserves ranking order within each group.
function shelfCards(
  articles: ArticleMeta[],
): { article: ArticleMeta; showImage: boolean }[] {
  const withImage = articles.filter((a) => a.image)
  const withoutImage = articles.filter((a) => !a.image)
  const ordered = [...withImage, ...withoutImage]
  const imageCards = Math.floor(withImage.length / SHELF_COLUMNS) * SHELF_COLUMNS
  return ordered.map((article, i) => ({ article, showImage: i < imageCards }))
}

const BRAND_QUICK_LINKS = [
  { name: 'BYD', slug: 'byd', initial: 'B' },
  { name: 'NIO', slug: 'nio', initial: 'N' },
  { name: 'Li Auto', slug: 'li-auto', initial: 'L' },
  { name: 'MG', slug: 'mg', initial: 'M' },
  { name: 'Geely', slug: 'geely', initial: 'G' },
  { name: 'Zeekr', slug: 'zeekr', initial: 'Z' },
]

export default async function HomePage() {
  const featured = getFeaturedArticle()
  const allArticles = getAllArticles()

  // Smart ranking with reactions
  let reactionMap: Map<string, number> = new Map()
  try {
    const { getReactionTotalsBySlug } = await import('@/lib/reactions')
    const candidates = allArticles.slice(0, 100)
    reactionMap = await getReactionTotalsBySlug(candidates.map((a) => a.slug))
  } catch {
    // KV unavailable — reactions default to 0, ranking still works
  }

  const reactionTotals = { get: (slug: string) => reactionMap.get(slug) }

  // "Heute wichtig" — top 5 ranked (skip featured hero article)
  const rankPool = allArticles.filter((a) => a.slug !== featured?.slug)
  const topRanked = rankArticles(rankPool, reactionTotals, HOMEPAGE_ARTICLE_TARGET)
  const heuteWichtig = topRanked.slice(0, 5)

  // "Für Deutschland relevant" shelf
  const deutschlandArticles = getDeutschlandArticles()
    .filter((a) => a.slug !== featured?.slug)
    .slice(0, DEUTSCHLAND_SHELF_COUNT)

  // Topic shelves — only show if ≥ MIN_SHELF_ARTICLES.
  // Snap article count down to the nearest multiple of 4 so the grid rows are always full.
  const topicShelves = TOPICS
    .map((topic) => {
      const raw = getArticlesByTopic(topic.slug).slice(0, SHELF_ARTICLES_PER_TOPIC)
      const snapped = Math.floor(raw.length / 4) * 4
      return { topic, articles: raw.slice(0, Math.max(snapped, 0)) }
    })
    .filter((shelf) => shelf.articles.length >= MIN_SHELF_ARTICLES)

  // "Neueste Meldungen" — compact list of remaining articles
  const shownSlugs = new Set([
    featured?.slug,
    ...heuteWichtig.map((a) => a.slug),
    ...deutschlandArticles.map((a) => a.slug),
    ...topicShelves.flatMap((s) => s.articles.map((a) => a.slug)),
  ])
  const neueste = allArticles
    .filter((a) => !shownSlugs.has(a.slug))
    .slice(0, 18)

  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <div className={styles.heroBackdrop} aria-hidden="true" />

        <div className={styles.heroLayer}>
          {featured && <Hero article={featured} />}
        </div>

        {/* ── Heute wichtig: smart-ranked lead section ── */}
        {heuteWichtig.length > 0 && (
          <section className={styles.section} aria-label="Heute wichtig">
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLine} aria-hidden="true" />
                <h2 className={styles.sectionTitle}>Heute wichtig</h2>
              </div>
              <div className={styles.heuteGrid}>
                {heuteWichtig[0] && (
                  <div className={styles.heuteFeatured}>
                    <ArticleCard article={heuteWichtig[0]} featured={Boolean(heuteWichtig[0].image)} />
                  </div>
                )}
                <div className={styles.heuteSecondary}>
                  {heuteWichtig.slice(1).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Für Deutschland relevant: the differentiator ── */}
        {deutschlandArticles.length >= MIN_SHELF_ARTICLES && (
          <section className={styles.deutschlandSection} aria-label="Für Deutschland relevant">
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLine} aria-hidden="true" />
                <h2 className={styles.sectionTitle}>Für Deutschland relevant</h2>
                <StatusBadge relevance="de_available" size="sm" />
                <Link href="/deutschland" className={styles.sectionMoreLink}>
                  Alle ansehen →
                </Link>
              </div>
              <div className={styles.shelfGrid}>
                {shelfCards(deutschlandArticles).map(({ article, showImage }) => (
                  <ArticleCard key={article.slug} article={article} hideImage={!showImage} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Topic shelves ── */}
        {topicShelves.map(({ topic, articles }) => (
          <section key={topic.slug} className={styles.topicShelf} aria-label={topic.label}>
            <div className={styles.container}>
              <div className={styles.shelfHeader}>
                <div className={styles.shelfAccent} aria-hidden="true" />
                <h2 className={styles.shelfTitle}>{topic.label}</h2>
                <Link href={`/themen/${topic.slug}`} className={styles.sectionMoreLink}>
                  Alle →
                </Link>
              </div>
              <div className={styles.shelfGrid}>
                {shelfCards(articles).map(({ article, showImage }) => (
                  <ArticleCard key={article.slug} article={article} hideImage={!showImage} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Fallback: wenn noch keine Klassifizierung ── */}
        {topicShelves.length === 0 && heuteWichtig.length === 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLine} aria-hidden="true" />
                <h2 className={styles.sectionTitle}>Neueste Artikel</h2>
              </div>
              <div className={styles.articleGrid}>
                {allArticles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Neueste Meldungen: compact list ── */}
        {neueste.length > 0 && (
          <section className={styles.section} aria-label="Neueste Meldungen">
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionLine} aria-hidden="true" />
                <h2 className={styles.sectionTitle}>Neueste Meldungen</h2>
              </div>
              <div className={styles.kompaktList}>
                {neueste.map((article) => (
                  <ArticleListItem key={article.slug} article={article} />
                ))}
              </div>
              {allArticles.length > 20 && (
                <div className={styles.viewAll}>
                  <Link href="/articles" className={styles.viewAllLink}>
                    Alle Artikel ansehen
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Brand Quick Links ── */}
        <section className={styles.brandSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLine} aria-hidden="true" />
              <h2 className={styles.sectionTitle}>Marken</h2>
              <Link href="/brands" className={styles.sectionMoreLink}>Alle Marken →</Link>
            </div>
            <div className={styles.brandGrid}>
              {BRAND_QUICK_LINKS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className={styles.brandCard}
                >
                  <span className={styles.brandInitial}>{brand.initial}</span>
                  <span className={styles.brandName}>{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterInner}>
            <h2 className={styles.newsletterTitle}>Bleib auf dem Laufenden</h2>
            <p className={styles.newsletterText}>
              Erhalte die wichtigsten China-EV-Nachrichten direkt in dein Postfach.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
