import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Hero from '@/components/Hero'
import ArticleCard from '@/components/ArticleCard'
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
  { name: 'BYD', slug: 'byd' },
  { name: 'NIO', slug: 'nio' },
  { name: 'XPeng', slug: 'xpeng' },
  { name: 'Li Auto', slug: 'li-auto' },
  { name: 'MG', slug: 'mg' },
  { name: 'Geely', slug: 'geely' },
]

export default function HomePage() {
  const featured = getFeaturedArticle()
  const latestArticles = getLatestArticles(6)
  const allArticles = getAllArticles()

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        {/* Hero Section */}
        {featured && <Hero article={featured} />}

        {/* Latest Articles Grid */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Neueste Artikel</h2>

            <div className={styles.articleGrid}>
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {allArticles.length > 6 && (
              <div className={styles.viewAll}>
                <Link href="/articles" className={styles.viewAllLink}>
                  Alle Artikel ansehen
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Brand Quick Links */}
        <section className={styles.brandSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Marken</h2>
            <div className={styles.brandGrid}>
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands#${brand.slug}`}
                  className={styles.brandLink}
                >
                  {brand.name}
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