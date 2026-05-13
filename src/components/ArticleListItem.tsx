import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { formatDateShort } from '@/lib/date-utils'
import styles from './ArticleListItem.module.css'

interface ArticleListItemProps {
  article: ArticleMeta
}

export default function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <Link href={`/articles/${article.slug}`} className={styles.item}>
      <div className={styles.accent} aria-hidden="true" />
      <div className={styles.body}>
        <div className={styles.meta}>
          {article.brand && (
            <span className={styles.brand}>{article.brand}</span>
          )}
          <span className={styles.source}>{article.source}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
          <time className={styles.date} dateTime={article.date}>
            {formatDateShort(article.date)}
          </time>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.readTime}>{article.read_time_minutes} Min.</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>

        {article.description && (
          <p className={styles.description}>{article.description}</p>
        )}
      </div>
    </Link>
  )
}
