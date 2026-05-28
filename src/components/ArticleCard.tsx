import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { formatDateShort } from '@/lib/date-utils'
import { TOPIC_BY_SLUG } from '@/lib/topics'
import FallbackImage from './FallbackImage'
import StatusBadge from './StatusBadge'
import styles from './ArticleCard.module.css'

interface ArticleCardProps {
  article: ArticleMeta
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const topicLabel = article.primaryTopic
    ? TOPIC_BY_SLUG[article.primaryTopic]?.label
    : null

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
    >
      {article.image && (
        <div className={styles.imageWrapper}>
          <FallbackImage
            src={article.image}
            alt={article.title}
            className={styles.image}
            width={480}
            height={270}
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.meta}>
          {article.brand && (
            <span className={styles.brand}>{article.brand}</span>
          )}
          {topicLabel && (
            <span className={styles.topic}>{topicLabel}</span>
          )}
          {article.marketRelevance && (
            <StatusBadge relevance={article.marketRelevance} size="sm" />
          )}
        </div>

        <h3 className={styles.title}>{article.title}</h3>

        {article.description && (
          <p className={styles.excerpt}>{article.description}</p>
        )}

        <div className={styles.footer}>
          <time className={styles.date} dateTime={article.date}>
            {formatDateShort(article.date)}
          </time>
          <span className={styles.readTime}>
            {article.read_time_minutes} Min.
          </span>
        </div>
      </div>
    </Link>
  )
}