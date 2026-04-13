import type { Metadata } from 'next'
import './global.css'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
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
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'light');
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