import Link from 'next/link'
import { ArticleMeta } from '@/lib/articles'
import { formatDate } from '@/lib/articles'
import styles from './Hero.module.css'

interface HeroProps {
  article: ArticleMeta
}

export default function Hero({ article }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.badge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Neuester Artikel</span>
        </div>

        <h1 className={styles.title}>
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h1>

        {article.description && (
          <p className={styles.excerpt}>{article.description}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          {article.brand && (
            <>
              <span className={styles.separator}>&bull;</span>
              <span className={styles.brand}>{article.brand}</span>
            </>
          )}
          <span className={styles.separator}>&bull;</span>
          <time className={styles.date} dateTime={article.date}>
            {formatDate(article.date)}
          </time>
        </div>

        <Link href={`/articles/${article.slug}`} className={styles.cta}>
          <span>Artikel lesen</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {article.image && (
          <div className={styles.imageWrapper}>
            <img
              src={article.image}
              alt={article.title}
              className={styles.image}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        )}
      </div>
    </section>
  )
}