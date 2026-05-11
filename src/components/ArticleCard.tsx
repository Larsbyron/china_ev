import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { formatDateShort } from '@/lib/date-utils'
import { getArticleLogo } from '@/lib/logo-map'
import FallbackImage from './FallbackImage'
import styles from './ArticleCard.module.css'

interface ArticleCardProps {
  article: ArticleMeta
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
    >
      <div className={styles.imageWrapper}>
        {article.image ? (
          <FallbackImage
            src={article.image}
            alt={article.title}
            className={styles.image}
            width={480}
            height={270}
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
            fallbackSrc={getArticleLogo(article.brand, article.source) ?? undefined}
            fallbackClassName={styles.imageFallback}
          />
        ) : (
          <div className={styles.imageFallback}>
            {(() => {
              const logo = getArticleLogo(article.brand, article.source)
              return logo
                ? <img src={logo} alt={article.brand || article.source} className={styles.logoPlaceholder} />
                : <span className={styles.fallbackLabel}>{article.brand || article.source}</span>
            })()}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          {article.brand && (
            <span className={styles.brand}>{article.brand}</span>
          )}
          <span className={styles.source}>{article.source}</span>
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