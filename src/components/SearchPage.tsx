'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import styles from '@/app/suche/page.module.css'

interface PagefindSearchResult {
  id: string
  data: () => Promise<PagefindResultData>
}

interface PagefindResultData {
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindInstance {
  init: () => Promise<void>
  search: (query: string, options?: { sort?: Record<string, 'asc' | 'desc'> }) => Promise<{ results: PagefindSearchResult[] }>
}

declare global {
  interface Window {
    pagefind?: PagefindInstance
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResultData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const loadPagefind = useCallback(async () => {
    // 防止并发调用导致 pagefind.init() 被执行多次
    if (loadingRef.current) return null
    loadingRef.current = true

    try {
      const pf = window.pagefind as PagefindInstance | undefined
      if (pf) {
        if (!pagefindLoaded) {
          await pf.init()
          setPagefindLoaded(true)
        }
        return pf
      }

      // @ts-expect-error - external runtime ES module
      const pagefind = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')
      await pagefind.init()
      ;(window as any).pagefind = pagefind
      setPagefindLoaded(true)
      return pagefind
    } catch {
      console.warn('Pagefind konnte nicht geladen werden (vermutlich dev-Modus)')
      return null
    } finally {
      loadingRef.current = false
    }
  }, [pagefindLoaded])

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return

      setLoading(true)
      setSearched(true)

      try {
        const pf = await loadPagefind()
        if (!pf) {
          setResults([])
          setLoading(false)
          return
        }

        const search = await pf.search(trimmed, { sort: { date: 'desc' } })
        const settled = await Promise.allSettled(
          search.results.map((r: PagefindSearchResult) => r.data())
        )
        const validResults: PagefindResultData[] = []
        for (const s of settled) {
          if (s.status === 'fulfilled' && typeof s.value?.url === 'string' && s.value.url.length > 0) {
            // Pagefind 从 .next/server/app/articles/slug.html 索引，
            // 生成的 URL 形如 /articles/slug.html：
            // 1. 去掉 .html 扩展名
            // 2. 补齐尾部斜杠（next.config 配置了 trailingSlash: true）
            let url = s.value.url
            if (url.endsWith('.html')) {
              url = url.slice(0, -5)
            }
            if (!url.endsWith('/')) {
              url = `${url}/`
            }
            validResults.push({ ...s.value, url })
          }
        }
        setResults(validResults)
      } catch (err) {
        console.error('Suche fehlgeschlagen:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
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
                  key={result.url}
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
