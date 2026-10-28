import { AFFILIATE_SLOTS, affiliateRedirectPath } from '@/lib/affiliate'
import styles from './AffiliateBox.module.css'

/**
 * Amazon affiliate box.
 *
 * Links point at our own `/zubehoer/<slot>/` hop instead of amazon.de: the
 * server counts the click there and then redirects (302). That replaced the
 * old client-side `fetch` beacon, which missed clicks made before hydration
 * and clicks from visitors without JS (Amazon counted 13 clicks where our
 * counter saw 7 within the same week).
 */
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
              href={affiliateRedirectPath(slot.id)}
              target="_blank"
              rel="sponsored noopener noreferrer"
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
