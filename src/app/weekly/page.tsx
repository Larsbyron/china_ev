import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getAllArticles, formatDate } from '@/lib/articles'
import { canonicalUrl } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Top 5 diese Woche',
  description: 'Die kuratierten Top 5 China-EV-News der Woche — handverlesen und kommentiert.',
  alternates: {
    canonical: canonicalUrl('/weekly/'),
  },
}

export default function WeeklyPage() {
  const allArticles = getAllArticles()
  // Take top 5 most recent articles for the weekly
  const topArticles = allArticles.slice(0, 5)

  const now = new Date()
  const weekNumber = getWeekNumber(now)
  const currentWeek = `KW ${weekNumber}, ${now.getFullYear()}`

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Hero Header */}
          <header className={styles.header}>
            <div className={styles.badge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Redaktionelle Auswahl</span>
            </div>
            <h1 className={styles.title}>Top 5 diese Woche</h1>
            <p className={styles.subtitle}>{currentWeek}</p>
          </header>

          {/* Top 5 List */}
          <section className={styles.list}>
            {topArticles.map((article, index) => (
              <article key={article.slug} className={styles.item}>
                <div className={styles.number}>
                  <span className={styles.numberText}>{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className={styles.content}>
                  <div className={styles.meta}>
                    {article.brand && (
                      <span className={styles.brand}>{article.brand}</span>
                    )}
                    <span className={styles.source}>{article.source}</span>
                  </div>

                  <h2 className={styles.articleTitle}>
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  {article.description && (
                    <p className={styles.excerpt}>{article.description}</p>
                  )}

                  <div className={styles.footer}>
                    <time className={styles.date} dateTime={article.date}>
                      {formatDate(article.date)}
                    </time>
                    <Link href={`/articles/${article.slug}`} className={styles.readMore}>
                      Weiterlesen
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {article.image && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={article.image}
                      alt=""
                      width={480}
                      height={270}
                      loading="lazy"
                      decoding="async"
                      className={styles.image}
                    />
                  </div>
                )}
              </article>
            ))}
          </section>

          {/* Navigation */}
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Alle Artikel
            </Link>
            <Link href="/brands" className={styles.navLink}>
              Nach Marken
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
