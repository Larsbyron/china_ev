import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung und Informationen zum Schutz Ihrer Daten bei E-AUTOS.',
  robots: { index: false, follow: false },
}

export default function DatenschutzPage() {
  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Datenschutzerklärung</h1>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          1. Datenschutz auf einen Blick
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
          Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
          werden können.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          2. Verantwortliche Stelle
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Zhinai Liu<br />
          Forsthaus 22<br />
          D-40883 Ratingen<br />
          E-Mail: <a href="mailto:l.bai@loghan.de">l.bai@loghan.de</a>
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          3. Datenerfassung auf dieser Website
        </h2>
        <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Server-Log-Dateien
        </h3>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in
          sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
          Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer
          URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und
          IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
          nicht vorgenommen.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          4. Ihre Rechte
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
          Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten
          zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
          können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Hierzu
          sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an
          uns wenden.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          5. Hosting
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Diese Website wird bei Vercel gehostet. Anbieter ist die Vercel Inc.,
          440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel erhebt
          Server-Log-Dateien wie oben beschrieben. Mehr Informationen zum
          Datenschutz bei Vercel finden Sie in der{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Vercel
          </a>.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
