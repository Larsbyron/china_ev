import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'
import StatusBadge from '@/components/StatusBadge'
import { getDeutschlandArticles, getArticlesByMarketRelevance } from '@/lib/articles'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'In Deutschland — China EV News',
  description: 'Chinesische Elektroautos, die in Deutschland erhältlich sind oder kommen — BYD, NIO, MG und mehr.',
}

export const revalidate = 600

export default function DeutschlandPage() {
  const available = getArticlesByMarketRelevance('de_available')
  const euAvailable = getArticlesByMarketRelevance('eu_available')
  const planned = getArticlesByMarketRelevance('eu_planned')

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <div className={styles.headerBadge}>
              <StatusBadge relevance="de_available" size="md" />
            </div>
            <h1 className={styles.title}>In Deutschland</h1>
            <p className={styles.subtitle}>
              Chinesische E-Autos, die du in Deutschland kaufen kannst — oder die bald kommen.
              <br />
              Das ist die Achse, die kein anderes deutschsprachiges EV-Portal so zeigt.
            </p>
          </header>

          {available.length > 0 && (
            <section className={styles.section} aria-label="In Deutschland erhältlich">
              <div className={styles.sectionHeader}>
                <StatusBadge relevance="de_available" size="md" />
                <h2 className={styles.sectionTitle}>In Deutschland erhältlich</h2>
                <span className={styles.sectionCount}>{available.length} Artikel</span>
              </div>
              <div className={styles.articleGrid}>
                {available.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}

          {euAvailable.length > 0 && (
            <section className={styles.section} aria-label="In Europa erhältlich">
              <div className={styles.sectionHeader}>
                <StatusBadge relevance="eu_available" size="md" />
                <h2 className={styles.sectionTitle}>In Europa erhältlich</h2>
                <span className={styles.sectionCount}>{euAvailable.length} Artikel</span>
              </div>
              <div className={styles.articleGrid}>
                {euAvailable.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}

          {planned.length > 0 && (
            <section className={styles.section} aria-label="Für Europa geplant">
              <div className={styles.sectionHeader}>
                <StatusBadge relevance="eu_planned" size="md" />
                <h2 className={styles.sectionTitle}>Für Europa geplant</h2>
                <span className={styles.sectionCount}>{planned.length} Artikel</span>
              </div>
              <div className={styles.articleGrid}>
                {planned.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}

          {available.length === 0 && euAvailable.length === 0 && planned.length === 0 && (
            <div className={styles.emptyState}>
              <p>Die Artikel werden nach der Klassifizierung hier angezeigt.</p>
              <p className={styles.emptyHint}>
                Führe <code>npm run backfill-topics</code> aus, um bestehende Artikel zu klassifizieren.
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
