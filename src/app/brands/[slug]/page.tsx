import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'
import ArticleListItem from '@/components/ArticleListItem'
import { getAllBrands, getArticlesByBrand } from '@/lib/articles'
import styles from './page.module.css'

const BRAND_NAMES: Record<string, string> = {
  byd: 'BYD',
  nio: 'NIO',
  xpeng: 'XPeng',
  'li-auto': 'Li Auto',
  mg: 'MG',
  geely: 'Geely',
  zeekr: 'Zeekr',
  xiaomi: 'Xiaomi',
}

export async function generateStaticParams() {
  const brands = getAllBrands()
  return brands.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const name = BRAND_NAMES[slug] || slug
  return {
    title: `${name} — E-AUTOS`,
    description: `Alle ${name}-Artikel auf E-AUTOS — Nachrichten, Modelle und Neuheiten.`,
  }
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const brandName = BRAND_NAMES[slug] || slug
  const articles = getArticlesByBrand(brandName)

  const withImage = articles.filter((a) => a.image)
  const withoutImage = articles.filter((a) => !a.image)

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/brands" className={styles.breadcrumbLink}>
              ← Alle Marken
            </Link>
          </nav>

          <header className={styles.header}>
            <h1 className={styles.title}>{brandName}</h1>
            <p className={styles.count}>
              {articles.length} {articles.length === 1 ? 'Artikel' : 'Artikel'}
            </p>
          </header>

          {articles.length === 0 ? (
            <p className={styles.empty}>Noch keine Artikel für diese Marke.</p>
          ) : (
            <>
              {withImage.length > 0 && (
                <div className={styles.articleGrid}>
                  {withImage.map((article, i) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      featured={i === 0 && withImage.length > 2}
                    />
                  ))}
                </div>
              )}

              {withoutImage.length > 0 && (
                <div className={styles.listSection}>
                  <div className={styles.listHeader}>
                    <div className={styles.listLine} aria-hidden="true" />
                    <h2 className={styles.listTitle}>Kompakt</h2>
                    <span className={styles.listSubtitle}>weitere Meldungen</span>
                  </div>
                  <div className={styles.listBox}>
                    {withoutImage.map((article) => (
                      <ArticleListItem key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
