import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Newsletter-Anmeldung bestätigt',
  description: 'Bestätigung der Newsletter-Anmeldung bei E-AUTOS.',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ status?: string }>
}

const COPY: Record<string, { title: string; text: string }> = {
  ok: {
    title: 'Anmeldung bestätigt',
    text: 'Vielen Dank. Ihre Adresse ist jetzt eingetragen und Sie erhalten den nächsten E-AUTOS-Newsletter.',
  },
  invalid: {
    title: 'Link ungültig oder abgelaufen',
    text: 'Der Bestätigungslink ist nicht mehr gültig (er läuft nach 48 Stunden ab oder wurde bereits verwendet). Bitte melden Sie sich erneut an.',
  },
  error: {
    title: 'Bestätigung fehlgeschlagen',
    text: 'Die Bestätigung konnte gerade nicht gespeichert werden. Bitte versuchen Sie es in einigen Minuten noch einmal.',
  },
}

export default async function NewsletterConfirmedPage({ searchParams }: Props) {
  const { status } = await searchParams
  const copy = COPY[status ?? 'ok'] ?? COPY.ok

  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '620px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '1rem' }}>{copy.title}</h1>
        <p style={{ lineHeight: 1.7, marginBottom: '1.5rem', color: '#3c4a58' }}>{copy.text}</p>
        <p style={{ lineHeight: 1.7 }}>
          <Link href="/" style={{ color: '#e63946', fontWeight: 600 }}>
            Zurück zur Startseite
          </Link>
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
