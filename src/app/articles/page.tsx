import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticlesListing from '@/components/ArticlesListing'
import { getAllArticles } from '@/lib/articles'
import { canonicalUrl } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Alle Artikel | E-AUTOS',
  description: 'Alle Artikel zu chinesischen E-Autos auf Deutsch. Nachrichten, Tests, Vergleiche und mehr.',
  alternates: {
    canonical: canonicalUrl('/articles/'),
  },
}

function getAllTags(): string[] {
  const articles = getAllArticles()
  const tagSet = new Set<string>()
  for (const article of articles) {
    for (const tag of article.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export default function ArticlesPage() {
  const allArticles = getAllArticles()
  const allTags = getAllTags()

  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Alle Artikel</h1>
            <p className={styles.subtitle}>
              {allArticles.length} Artikel zu chinesischen E-Autos
            </p>
          </header>

          <ArticlesListing articles={allArticles} tags={allTags} />
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
