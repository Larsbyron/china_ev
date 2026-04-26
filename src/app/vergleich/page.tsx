import { Suspense } from 'react'
import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ComparisonTool from '@/components/comparison/ComparisonTool'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'E-Auto Vergleich',
  description: 'Vergleiche chinesische E-Autos side-by-side. Reichweite, Preis, Batterie, Beschleunigung und mehr.',
}

export default function VergleichPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>E-Auto Vergleich</h1>
            <p className={styles.subtitle}>
              Vergleiche bis zu 4 chinesische E-Autos side-by-side. Klicke auf ein Feld, um ein Fahrzeug hinzuzufügen.
            </p>
          </header>

          <Suspense fallback={<div className={styles.loading}>Laden...</div>}>
            <ComparisonTool />
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
