import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import RangeChart from '@/components/charts/RangeChart'
import PriceRangeChart from '@/components/charts/PriceRangeChart'
import BatteryChart from '@/components/charts/BatteryChart'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Daten & Visualisierung',
  description: 'Interaktive Charts und Vergleiche chinesischer E-Autos. Reichweite, Preise, Batterie und mehr.',
}

export default function DatenPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Daten & Visualisierung</h1>
            <p className={styles.subtitle}>
              Interaktive Vergleiche chinesischer E-Autos — Reichweite, Preise, Batterie und mehr.
            </p>
          </header>

          <div className={styles.chartGrid}>
            <section className={styles.chartSection}>
              <h2 className={styles.chartTitle}>Reichweite im Vergleich</h2>
              <p className={styles.chartDesc}>WLTP-Reichweite der beliebtesten chinesischen E-Autos</p>
              <RangeChart />
            </section>

            <section className={styles.chartSection}>
              <h2 className={styles.chartTitle}>Preis vs. Reichweite</h2>
              <p className={styles.chartDesc}>Preis-Leistungs-Verhältnis auf einen Blick</p>
              <PriceRangeChart />
            </section>

            <section className={styles.chartSection}>
              <h2 className={styles.chartTitle}>Batteriekapazität</h2>
              <p className={styles.chartDesc}>Akku-Größe und Ladeleistung im Vergleich</p>
              <BatteryChart />
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
