import Link from 'next/link'
import { ArticleMeta, formatDate } from '@/lib/articles'
import styles from './Hero.module.css'

interface HeroProps {
  article: ArticleMeta
}

export default function Hero({ article }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.accentLine} aria-hidden="true" />

          <div className={styles.badge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Neuester Artikel
          </div>

          <h1 className={styles.title}>
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h1>

          {article.description && (
            <p className={styles.excerpt}>{article.description}</p>
          )}

          <div className={styles.bottom}>
            <Link href={`/articles/${article.slug}`} className={styles.cta}>
              Artikel lesen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <div className={styles.meta}>
              <span className={styles.source}>{article.source}</span>
              {article.brand && (
                <>
                  <span className={styles.separator}>&bull;</span>
                  <span className={styles.brand}>{article.brand}</span>
                </>
              )}
              <span className={styles.separator}>&bull;</span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
          </div>
        </div>

        {article.image && (
          <div className={styles.visual}>
            <div className={styles.imageWrapper}>
              <img
                src={article.image}
                alt=""
                className={styles.image}
                loading="eager"
                fetchPriority="high"
              />
              <div className={styles.imageOverlay} aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
