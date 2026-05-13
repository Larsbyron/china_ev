import Link from 'next/link'
import styles from './BrandCard.module.css'

interface BrandCardProps {
  name: string
  slug: string
  articleCount: number
  latestHeadline?: string
}

export default function BrandCard({ name, slug, articleCount, latestHeadline }: BrandCardProps) {
  return (
    <Link href={`/brands/${slug}`} className={styles.card}>
      <div className={styles.logo}>
        <span className={styles.initial}>{name[0]}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.count}>
          {articleCount} {articleCount === 1 ? 'Artikel' : 'Artikel'}
        </p>
        {latestHeadline && (
          <p className={styles.latest}>{latestHeadline}</p>
        )}
      </div>

      <svg className={styles.arrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  )
}