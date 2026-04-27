'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import styles from '@/app/suche/page.module.css'

interface PagefindResult {
  id: string
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindInstance {
  init: () => Promise<void>
  search: (query: string) => Promise<{ results: PagefindResult[] }>
}

declare global {
  interface Window {
    pagefind?: PagefindInstance
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const loadPagefind = useCallback(async () => {
    const pf = window.pagefind as PagefindInstance | undefined
    if (pf) {
      if (!pagefindLoaded) {
        await pf.init()
        setPagefindLoaded(true)
      }
      return pf
    }

    try {
      const script = document.createElement('script')
      script.src = '/pagefind/pagefind.js'
      script.defer = true
      document.head.appendChild(script)

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Pagefind'))
      })

      const pf2 = window.pagefind as PagefindInstance | undefined
      if (pf2) {
        await pf2.init()
        setPagefindLoaded(true)
        return pf2
      }
    } catch {
      // Pagefind not available (dev mode or build didn't run)
    }
    return null
  }, [pagefindLoaded])

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return

      setLoading(true)
      setSearched(true)

      const pf = await loadPagefind()
      if (!pf) {
        setResults([])
        setLoading(false)
        return
      }

      const search = await pf.search(trimmed)
      setResults(search.results || [])
      setLoading(false)
    },
    [query, loadPagefind]
  )

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Suche</h1>

        <form onSubmit={handleSearch} role="search">
          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder='Artikel suchen... (z.B. "BYD Reichweite")'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Suchbegriff eingeben"
              suppressHydrationWarning
            />
          </div>
        </form>
      </header>

      <div className={styles.results}>
        {loading && (
          <p className={styles.loading}>Suche läuft...</p>
        )}

        {!loading && searched && results.length === 0 && (
          <div className={styles.empty}>
            <p>Keine Ergebnisse für &ldquo;{query.trim()}&rdquo;</p>
            <p className={styles.emptyHint}>
              Versuche andere Suchbegriffe oder durchstöbere die{' '}
              <Link href="/articles">Artikelübersicht</Link>.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className={styles.resultCount}>
              {results.length} Ergebnis{results.length !== 1 ? 'se' : ''}
            </p>
            <div className={styles.resultList}>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className={styles.resultItem}
                >
                  <h2 className={styles.resultTitle}>
                    {result.meta?.title || 'Unbenannter Artikel'}
                  </h2>
                  <p
                    className={styles.resultExcerpt}
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                  <span className={styles.resultMeta}>{result.url}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {!searched && (
          <p className={styles.empty}>
            Gib einen Suchbegriff ein, um Artikel zu durchsuchen.
          </p>
        )}
      </div>
    </>
  )
}
