'use client'

import Link from 'next/link'
import styles from './ErrorComponent.module.css'

interface ErrorComponentProps {
  title?: string
  message?: string
  reset?: () => void
}

export default function ErrorComponent({
  title = 'Etwas ist schiefgelaufen',
  message = 'Die Seite konnte nicht geladen werden.',
  reset,
}: ErrorComponentProps) {
  return (
    <div className={styles.container} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {reset && (
          <button onClick={reset} className={styles.retryButton}>
            Erneut versuchen
          </button>
        )}
        <Link href="/" className={styles.homeLink}>
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
