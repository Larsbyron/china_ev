'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './ReactionPanel.module.css'
import type { ReactionCounts, ReactionType } from '@/lib/reactions'

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'begeistert', emoji: '😍', label: 'Begeistert!' },
  { type: 'mehr_infos', emoji: '🤔', label: 'Mehr Infos' },
  { type: 'preis_leistung', emoji: '💰', label: 'Preis-Leistung' },
  { type: 'probefahrt', emoji: '🚗', label: 'Probefahrt!' },
]

const STORAGE_KEY_PREFIX = 'reaction_voted:'

interface ReactionPanelProps {
  slug: string
}

export default function ReactionPanel({ slug }: ReactionPanelProps) {
  const [counts, setCounts] = useState<ReactionCounts | null>(null)
  const [voted, setVoted] = useState<ReactionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`) as ReactionType | null
    setVoted(stored)

    fetch(`/api/reactions/${slug}`)
      .then((r) => r.json())
      .then((data: ReactionCounts) => setCounts(data))
      .catch(() => setCounts({ begeistert: 0, mehr_infos: 0, preis_leistung: 0, probefahrt: 0 }))
      .finally(() => setLoading(false))
  }, [slug])

  const handleVote = useCallback(
    async (type: ReactionType) => {
      if (voted) return

      // Optimistic update
      setCounts((prev) =>
        prev ? { ...prev, [type]: prev[type] + 1 } : null
      )
      setVoted(type)
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, type)

      try {
        await fetch(`/api/reactions/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        })
      } catch {
        // Roll back on failure
        setCounts((prev) =>
          prev ? { ...prev, [type]: Math.max(0, prev[type] - 1) } : null
        )
        setVoted(null)
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${slug}`)
      }
    },
    [slug, voted]
  )

  if (loading) return null

  return (
    <section className={styles.panel} aria-label="Artikel bewerten">
      <p className={styles.heading}>Wie hat dir dieser Artikel gefallen?</p>
      <div className={styles.buttons}>
        {REACTIONS.map(({ type, emoji, label }) => (
          <button
            key={type}
            className={`${styles.button} ${voted === type ? styles.active : ''} ${voted && voted !== type ? styles.dim : ''}`}
            onClick={() => handleVote(type)}
            disabled={!!voted}
            aria-pressed={voted === type}
            aria-label={label}
          >
            <span className={styles.emoji}>{emoji}</span>
            <span className={styles.count}>{counts?.[type] ?? 0}</span>
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
      {voted && (
        <p className={styles.thanks}>Danke für dein Feedback! 🙏</p>
      )}
    </section>
  )
}
