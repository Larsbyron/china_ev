import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import SearchPage from '@/components/SearchPage'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Suche | E-AUTOS',
  description: 'Durchsuche alle Artikel zu chinesischen E-Autos.',
}

export default function SuchePage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <div className={styles.container}>
          <SearchPage />
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
