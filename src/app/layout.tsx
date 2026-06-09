import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './global.css'
import { Analytics } from '@vercel/analytics/react'
import ThemeProvider from '@/components/ThemeProvider'
import { SITE_URL } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'E-AUTOS | China EV News auf Deutsch',
    template: '%s | E-AUTOS',
  },
  description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng, Li Auto, MG und weiteren chinesischen E-Auto-Marken.',
  keywords: ['China EV', 'Elektroauto', 'BYD', 'NIO', 'XPeng', 'Li Auto', 'MG', 'E-Auto', 'Deutschland', 'chinesische Autos'],
  authors: [{ name: 'Lars Bergmann' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    siteName: 'E-AUTOS',
    title: 'E-AUTOS | China EV News auf Deutsch',
    description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'China EV News — E-AUTOS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-AUTOS | China EV News auf Deutsch',
    description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="alternate" type="application/rss+xml" title="E-AUTOS RSS Feed" href="/feed.xml" />
        {/* Plausible Analytics — privacy-friendly, no cookies */}
        <script defer data-domain="china-autonews.de" src="https://plausible.io/js/script.js" />
        {/* JSON-LD WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'E-AUTOS',
              url: SITE_URL,
              description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.',
              inLanguage: 'de',
            }),
          }}
        />
        {/* JSON-LD NewsMediaOrganization — publisher identity for Google News/Discover */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'E-AUTOS',
              url: SITE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
                width: 336,
                height: 112,
              },
              description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News.',
              inLanguage: 'de',
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'system' || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
