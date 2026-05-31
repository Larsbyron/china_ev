import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { AUTHOR } from '@/lib/author'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'Über E-AUTOS',
  description: 'E-AUTOS ist die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.',
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className={styles.hero}>
          <img
            src="/logo-wordmark-dark.png"
            alt="China EV News"
            className={`${styles.logo} ${styles.logoDark}`}
            width={700}
            height={385}
          />
          <img
            src="/logo-wordmark-light.png"
            alt=""
            aria-hidden="true"
            className={`${styles.logo} ${styles.logoLight}`}
            width={700}
            height={385}
          />
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Über E-AUTOS</h1>

        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          E-AUTOS ist die vertrauenswürdige deutschsprachige Quelle für Nachrichten
          aus der Welt der chinesischen Elektrofahrzeuge. Wir kuratieren täglich die
          wichtigsten News zu BYD, NIO, XPeng, Li Auto, MG, Geely und weiteren Marken.
        </p>

        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Unser Ziel: Deutsche Auto-Enthusiasten und EV-Interessierte über die
          rasante Entwicklung des chinesischen Elektrofahrzeugmarktes informieren.
          Die chinesische EV-Industrie entwickelt sich schneller als jede andere
          Automobilbranche weltweit, und viele dieser Innovationen erreichen
          bald auch den europäischen Markt.
        </p>

        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Alle Artikel werden aus vertrauenswürdigen englischsprachigen Quellen
          wie CnEVPost und Electrek übersetzt und für ein deutschsprachiges
          Publikum aufbereitet.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Redaktion</h2>
        <p style={{ lineHeight: 1.7 }}>
          <strong>{AUTHOR.name}</strong> — {AUTHOR.role}
        </p>
        <p style={{ marginTop: '0.5rem', lineHeight: 1.7 }}>{AUTHOR.bio}</p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Kontakt</h2>
        <p style={{ lineHeight: 1.7 }}>
          Fragen, Anregungen oder Hinweise? Schreib uns:{' '}
          <a href="mailto:l.bai@loghan.de" className={styles.mailLink}>l.bai@loghan.de</a>.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
