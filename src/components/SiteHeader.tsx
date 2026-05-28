'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { TOPICS } from '@/lib/topics'
import styles from './SiteHeader.module.css'

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [themenOpen, setThemenOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const themenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mega-menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (themenRef.current && !themenRef.current.contains(e.target as Node)) {
        setThemenOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on route change
  useEffect(() => {
    setThemenOpen(false)
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} aria-label="Seitenkopf">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="China EV News — Startseite">
          <img
            src="/logo-wordmark-dark.png"
            alt="China EV News"
            className={`${styles.logoImg} ${styles.logoDark}`}
            width={700}
            height={385}
          />
          <img
            src="/logo-wordmark-light.png"
            alt=""
            aria-hidden="true"
            className={`${styles.logoImg} ${styles.logoLight}`}
            width={700}
            height={385}
          />
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Hauptnavigation">
          <Link
            href="/"
            className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Alle
          </Link>

          {/* Themen mega-menu trigger */}
          <div className={styles.themenWrapper} ref={themenRef}>
            <button
              className={`${styles.navLink} ${styles.themenTrigger} ${isActive('/themen') ? styles.navLinkActive : ''}`}
              aria-expanded={themenOpen}
              aria-haspopup="true"
              onClick={() => setThemenOpen((v) => !v)}
            >
              Themen
              <svg className={`${styles.chevron} ${themenOpen ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {themenOpen && (
              <div className={styles.megaMenu} role="menu" aria-label="Themenübersicht">
                <div className={styles.megaMenuGrid}>
                  {TOPICS.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/themen/${topic.slug}`}
                      className={`${styles.megaItem} ${isActive(`/themen/${topic.slug}`) ? styles.megaItemActive : ''}`}
                      role="menuitem"
                    >
                      <span className={styles.megaItemLabel}>{topic.label}</span>
                      <span className={styles.megaItemDesc}>{topic.description}</span>
                    </Link>
                  ))}
                </div>
                <div className={styles.megaFooter}>
                  <Link href="/themen" className={styles.megaAllLink}>
                    Alle Themen →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Deutschland — the differentiator */}
          <Link
            href="/deutschland"
            className={`${styles.navLink} ${styles.deutschlandLink} ${isActive('/deutschland') ? styles.navLinkActive : ''}`}
            aria-current={isActive('/deutschland') ? 'page' : undefined}
          >
            <span className={styles.deBadge} aria-hidden="true">DE</span>
            In Deutschland
          </Link>

          <Link
            href="/brands"
            className={`${styles.navLink} ${isActive('/brands') ? styles.navLinkActive : ''}`}
            aria-current={isActive('/brands') ? 'page' : undefined}
          >
            Marken
          </Link>

          <Link
            href="/daten"
            className={`${styles.navLink} ${isActive('/daten') ? styles.navLinkActive : ''}`}
            aria-current={isActive('/daten') ? 'page' : undefined}
          >
            Daten
          </Link>

          <Link
            href="/weekly"
            className={`${styles.navLink} ${isActive('/weekly') ? styles.navLinkActive : ''}`}
            aria-current={isActive('/weekly') ? 'page' : undefined}
          >
            Weekly
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/suche" className={styles.searchLink} aria-label="Suche öffnen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className={styles.mobileMenuBtn}
            aria-expanded={mobileOpen}
            aria-label="Menü öffnen"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile Navigation">
          <Link href="/" className={`${styles.mobileNavLink} ${isActive('/') ? styles.mobileNavActive : ''}`}>Alle Artikel</Link>

          <div className={styles.mobileGroup}>
            <span className={styles.mobileGroupLabel}>Themen</span>
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/themen/${topic.slug}`}
                className={`${styles.mobileNavLink} ${styles.mobileNavIndented} ${isActive(`/themen/${topic.slug}`) ? styles.mobileNavActive : ''}`}
              >
                {topic.label}
              </Link>
            ))}
          </div>

          <Link href="/deutschland" className={`${styles.mobileNavLink} ${isActive('/deutschland') ? styles.mobileNavActive : ''}`}>
            <span className={styles.deBadge} aria-hidden="true">DE</span>
            In Deutschland
          </Link>
          <Link href="/brands" className={`${styles.mobileNavLink} ${isActive('/brands') ? styles.mobileNavActive : ''}`}>Marken</Link>
          <Link href="/daten" className={`${styles.mobileNavLink} ${isActive('/daten') ? styles.mobileNavActive : ''}`}>Daten</Link>
          <Link href="/weekly" className={`${styles.mobileNavLink} ${isActive('/weekly') ? styles.mobileNavActive : ''}`}>Weekly</Link>
          <Link href="/about" className={`${styles.mobileNavLink} ${isActive('/about') ? styles.mobileNavActive : ''}`}>Über</Link>
        </nav>
      )}
    </header>
  )
}
