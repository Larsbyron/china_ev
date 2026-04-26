'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleMeta } from '@/lib/articles'
import styles from '@/app/articles/page.module.css'

const ARTICLES_PER_PAGE = 12

function ArticlesListingInner({ articles, tags }: { articles: ArticleMeta[]; tags: string[] }) {
  const searchParams = useSearchParams()

  const activeTag = searchParams.get('tag') || null
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const pageArticles = filtered.slice(startIndex, startIndex + ARTICLES_PER_PAGE)

  return (
    <>
      {tags.length > 0 && (
        <nav className={styles.tagBar} aria-label="Tag-Filter">
          <Link
            href="/articles"
            className={`${styles.tagBtn} ${!activeTag ? styles.tagBtnActive : ''}`}
          >
            Alle
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className={`${styles.tagBtn} ${activeTag === tag ? styles.tagBtnActive : ''}`}
            >
              {tag}
            </Link>
          ))}
        </nav>
      )}

      {pageArticles.length > 0 ? (
        <>
          <div className={styles.articleGrid}>
            {pageArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Seitennavigation">
              {currentPage > 1 ? (
                <Link
                  href={`/articles?page=${currentPage - 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
                  className={styles.pageBtn}
                >
                  ← Zurück
                </Link>
              ) : (
                <span className={styles.pageBtn} style={{ opacity: 0.3, pointerEvents: 'none' }}>
                  ← Zurück
                </span>
              )}

              <span className={styles.pageInfo}>
                {currentPage} / {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/articles?page=${currentPage + 1}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
                  className={styles.pageBtn}
                >
                  Weiter →
                </Link>
              ) : (
                <span className={styles.pageBtn} style={{ opacity: 0.3, pointerEvents: 'none' }}>
                  Weiter →
                </span>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p>Keine Artikel gefunden.</p>
        </div>
      )}
    </>
  )
}

export default function ArticlesListing({ articles, tags }: { articles: ArticleMeta[]; tags: string[] }) {
  return (
    <Suspense fallback={<div className={styles.empty}>Laden...</div>}>
      <ArticlesListingInner articles={articles} tags={tags} />
    </Suspense>
  )
}
