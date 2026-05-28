import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'
import { TOPICS, TOPIC_BY_SLUG, isValidTopicSlug } from '@/lib/topics'
import { getArticlesByTopic } from '@/lib/articles'
import { MIN_SHELF_ARTICLES } from '@/lib/ranking-config'
import styles from './page.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!isValidTopicSlug(slug)) return {}
  const topic = TOPIC_BY_SLUG[slug]
  return {
    title: `${topic.label} — China EV News`,
    description: topic.description,
  }
}

export const revalidate = 600

export default async function TopicPage({ params }: Props) {
  const { slug } = await params

  if (!isValidTopicSlug(slug)) notFound()

  const topic = TOPIC_BY_SLUG[slug]
  const articles = getArticlesByTopic(slug)
  const isThinState = articles.length < MIN_SHELF_ARTICLES

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <a href="/themen" className={styles.breadcrumbLink}>Themen</a>
              <span className={styles.breadcrumbSep} aria-hidden="true">›</span>
              <span>{topic.label}</span>
            </div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{topic.label}</h1>
              {articles.length > 0 && (
                <span className={styles.articleCount}>
                  {articles.length} {articles.length === 1 ? 'Artikel' : 'Artikel'}
                </span>
              )}
            </div>
            <p className={styles.description}>{topic.description}</p>
          </header>

          {isThinState ? (
            <div className={styles.thinState}>
              <p className={styles.thinStateText}>
                Noch wenige Artikel in diesem Bereich — schau bald wieder vorbei.
              </p>
              <p className={styles.thinStateHint}>Andere gut gefüllte Themen:</p>
              <div className={styles.thinStateLinks}>
                {TOPICS.filter((t) => t.slug !== slug).map((t) => (
                  <a key={t.slug} href={`/themen/${t.slug}`} className={styles.thinStateLink}>
                    {t.label} →
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <section className={styles.articleGrid} aria-label={`Artikel: ${topic.label}`}>
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
