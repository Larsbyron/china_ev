import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './global.css'
import ThemeProvider from '@/components/ThemeProvider'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://china-ev.de'),
  title: {
    default: 'E-AUTOS | China EV News auf Deutsch',
    template: '%s | E-AUTOS',
  },
  description: 'Die vertrauenswürdige deutschsprachige Quelle für China-EV-News. Tägliche kuratierte Nachrichten zu BYD, NIO, XPeng und weiteren Marken.',
  keywords: ['China EV', 'Elektroauto', 'BYD', 'NIO', 'XPeng', 'E-Auto', 'Deutschland'],
  authors: [{ name: 'E-AUTOS' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'E-AUTOS',
  },
  twitter: {
    card: 'summary_large_image',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title="E-AUTOS RSS Feed" href="/feed.xml" />
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
      </body>
    </html>
  )
}
