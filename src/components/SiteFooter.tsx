import Link from 'next/link'
import styles from './SiteFooter.module.css'

const brandLinks = [
  { href: '/brands/byd', label: 'BYD' },
  { href: '/brands/nio', label: 'NIO' },
  { href: '/brands/li-auto', label: 'Li Auto' },
  { href: '/brands/mg', label: 'MG' },
  { href: '/brands/geely', label: 'Geely' },
  { href: '/brands/zeekr', label: 'Zeekr' },
]

const legalLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/feed.xml', label: 'RSS' },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} aria-label="Seitenfuss">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="China EV News — E-AUTOS Startseite">
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
            </Link>
            <span className={styles.tagline}>China EV News auf Deutsch</span>
          </div>

          <div className={styles.linkGroups}>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>Marken</span>
              <div className={styles.linkList}>
                {brandLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>Mehr</span>
              <div className={styles.linkList}>
                {legalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          &copy; {year} E-AUTOS. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  )
}
