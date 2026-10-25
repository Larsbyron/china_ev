import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Hinweise für E-AUTOS.',
  robots: { index: false, follow: false },
}

export default function ImpressumPage() {
  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Impressum</h1>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Angaben gemäß § 5 DDG
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Loghan GmbH<br />
          Forsthaus 22<br />
          40883 Ratingen<br />
          Deutschland
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Vertreten durch den Geschäftsführer
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Zhinai Liu
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Registereintrag
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Handelsregister: Amtsgericht Neuss<br />
          Registernummer: HRB 21826
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Umsatzsteuer-Identifikationsnummer
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
          DE345173693
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Kontakt
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Telefon: +49 179 7337425<br />
          E-Mail: l.bai@loghan.de
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Redaktionell verantwortlich gemäß § 18 Abs. 2 MStV
        </h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
          Zhinai Liu<br />
          Forsthaus 22, 40883 Ratingen
        </p>

        <p style={{ marginTop: '0.5rem', lineHeight: 1.7 }}>
          Redaktionelle Leitlinien, KI-Kennzeichnung und Korrekturweg:{' '}
          <Link href="/redaktion/" style={{ color: 'var(--color-accent-green)' }}>
            Redaktion &amp; Transparenz
          </Link>
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Haftung für Inhalte
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach
          den allgemeinen Gesetzen verantwortlich. Nach § 7 Abs. 1 DDG in
          Verbindung mit Artikeln 4 bis 8 der Verordnung (EU) 2022/2065 (Gesetz
          über digitale Dienste) sind wir als Diensteanbieter nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder
          nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Haftung für Links
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
          wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
          keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
          jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Urheberrecht
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
          bzw. Erstellers.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
