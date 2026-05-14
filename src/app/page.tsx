import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Hero from '@/components/Hero'
import ArticleCard from '@/components/ArticleCard'
import ArticleListItem from '@/components/ArticleListItem'
import NewsletterForm from '@/components/NewsletterForm'
import {
  getAllArticles,
  getFeaturedArticle,
  getLatestArticles,
} from '@/lib/articles'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'E-AUTOS | China EV News auf Deutsch',
  description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.',
}

const brands = [
  { name: 'BYD', slug: 'byd', initial: 'B' },
  { name: 'NIO', slug: 'nio', initial: 'N' },
  { name: 'Li Auto', slug: 'li-auto', initial: 'L' },
  { name: 'MG', slug: 'mg', initial: 'M' },
  { name: 'Geely', slug: 'geely', initial: 'G' },
  { name: 'Zeekr', slug: 'zeekr', initial: 'Z' },
]

export default function HomePage() {
  const featured = getFeaturedArticle()
  const allArticles = getAllArticles()

  // Strict chronological order, no image filter — newest is always first.
  // Skip the featured article so it doesn't double up with the Hero.
  const latestArticles = getLatestArticles(12).filter(
    (a) => a.slug !== featured?.slug,
  )
  const gridArticles = latestArticles.slice(0, 6)
  const listArticles = latestArticles.slice(6, 11)

  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        {featured && <Hero article={featured} />}

        {/* Latest Articles — editorial grid */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLine} aria-hidden="true" />
              <h2 className={styles.sectionTitle}>Neueste Artikel</h2>
            </div>

            {gridArticles.length > 0 && (
              <div className={styles.articleGrid}>
                {gridArticles.map((article, i) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    featured={i === 0 && Boolean(article.image)}
                  />
                ))}
              </div>
            )}

            {listArticles.length > 0 && (
              <div className={styles.kompakt}>
                <div className={styles.kompaktHeader}>
                  <div className={styles.kompaktLine} aria-hidden="true" />
                  <h3 className={styles.kompaktTitle}>Mehr Meldungen</h3>
                </div>
                <div className={styles.kompaktList}>
                  {listArticles.map((article) => (
                    <ArticleListItem key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}

            {allArticles.length > 6 && (
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

        {/* Brand Showcase */}
        <section className={styles.brandSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLine} aria-hidden="true" />
              <h2 className={styles.sectionTitle}>Marken</h2>
            </div>
            <div className={styles.brandGrid}>
              {brands.map((brand) => (
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

        {/* Newsletter Signup */}
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
