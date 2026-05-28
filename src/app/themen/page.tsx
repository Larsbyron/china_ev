import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { TOPICS } from '@/lib/topics'
import { getArticlesByTopic } from '@/lib/articles'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Themen — China EV News',
  description: 'Alle Themenbereiche: Modelle, Preise, Markt, Politik, Batterie, Software, Industrie und Unternehmen.',
}

export const revalidate = 600

export default function ThemenPage() {
  const topicsWithCount = TOPICS.map((topic) => ({
    ...topic,
    count: getArticlesByTopic(topic.slug).length,
  }))

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <h1 className={styles.title}>Themen</h1>
            <p className={styles.subtitle}>
              Chinesische EV-News nach Thema sortiert — wähle deinen Einstieg.
            </p>
          </header>

          <div className={styles.grid}>
            {topicsWithCount.map((topic) => (
              <Link
                key={topic.slug}
                href={`/themen/${topic.slug}`}
                className={styles.topicCard}
              >
                <div className={styles.cardTop}>
                  <h2 className={styles.topicLabel}>{topic.label}</h2>
                  {topic.count > 0 && (
                    <span className={styles.count}>{topic.count} Artikel</span>
                  )}
                </div>
                <p className={styles.topicDesc}>{topic.description}</p>
                {topic.count === 0 && (
                  <span className={styles.emptyNote}>Noch keine Artikel</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
