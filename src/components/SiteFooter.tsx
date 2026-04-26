import Link from 'next/link'
import styles from './SiteFooter.module.css'

const links = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: 'https://github.com/Larsbyron/china_ev', label: 'GitHub', external: true },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} aria-label="Seitenfuss">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>E-AUTOS</span>
          <span className={styles.tagline}>China EV News auf Deutsch</span>
        </div>

        <nav className={styles.links} aria-label="Footer-Navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className={styles.copyright}>
          &copy; {year} E-AUTOS. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  )
}