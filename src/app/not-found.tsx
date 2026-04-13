import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.content}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Seite nicht gefunden</h1>
          <p className={styles.text}>
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link href="/" className={styles.link}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Zur Startseite
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}