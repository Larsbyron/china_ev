'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import styles from './SiteHeader.module.css'

const navItems = [
  { href: '/', label: 'Alle' },
  { href: '/brands', label: 'Marken' },
  { href: '/daten', label: 'Daten' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/about', label: 'Über' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} aria-label="Seitenkopf">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          E-AUTOS
        </Link>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/suche" className={styles.searchLink} aria-label="Suche öffnen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
