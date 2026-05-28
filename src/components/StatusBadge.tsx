import type { MarketRelevance } from '@/lib/topics'
import { MARKET_RELEVANCE_LABELS } from '@/lib/topics'
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  relevance: MarketRelevance
  size?: 'sm' | 'md'
}

export default function StatusBadge({ relevance, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[relevance]} ${styles[size]}`}
      aria-label={`Marktstatus: ${MARKET_RELEVANCE_LABELS[relevance]}`}
    >
      {MARKET_RELEVANCE_LABELS[relevance]}
    </span>
  )
}
