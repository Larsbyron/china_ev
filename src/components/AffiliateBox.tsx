'use client'

import { AFFILIATE_SLOTS, buildAffiliateUrl } from '@/lib/affiliate'
import styles from './AffiliateBox.module.css'

function trackClick(slotId: string) {
  // Fire-and-forget. Never block navigation, never surface an error to the user.
  try {
    fetch('/api/affiliate-click', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot: slotId }),
    }).catch(() => {})
  } catch {
    // ignore
  }
}

export default function AffiliateBox() {
  return (
    <aside
      className={styles.box}
      data-pagefind-ignore
      aria-label="Anzeige: Zubehör-Empfehlungen"
    >
      <span className={styles.badge}>Anzeige</span>
      <h2 className={styles.title}>Zubehör für dein E-Auto</h2>
      <p className={styles.intro}>
        Passendes Zubehör findest du bei Amazon.de – nach Kategorie ausgewählt:
      </p>
      <ul className={styles.list}>
        {AFFILIATE_SLOTS.map((slot) => (
          <li key={slot.id} className={styles.item}>
            <a
              className={styles.link}
              href={buildAffiliateUrl(slot)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => trackClick(slot.id)}
            >
              {slot.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.footnote}>
        Anzeige: Als Amazon-Partner verdiene ich an qualifizierten Käufen. Für
        dich entstehen dadurch keine zusätzlichen Kosten.
      </p>
    </aside>
  )
}
