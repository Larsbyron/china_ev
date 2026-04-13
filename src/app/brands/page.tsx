import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import BrandCard from '@/components/BrandCard'
import ArticleCard from '@/components/ArticleCard'
import {
  getAllBrands,
  getArticlesByBrand,
  getAllArticles,
} from '@/lib/articles'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Marken',
  description: 'Alle Marken im Überblick — BYD, NIO, XPeng, Li Auto, MG, Geely und weitere chinesische EV-Hersteller.',
}

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

export default function BrandsPage() {
  const brands = getAllBrands()
  const allArticles = getAllArticles()

  // Get latest headline for each brand
  const brandsWithLatest = brands.map((brand) => {
    const brandArticles = getArticlesByBrand(brand.slug)
    return {
      ...brand,
      latestHeadline: brandArticles[0]?.title,
    }
  })

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Marken</h1>
            <p className={styles.subtitle}>
              Alle chinesischen EV-Marken mit aktuellen Artikeln
            </p>
          </header>

          {/* Brand Grid */}
          <section className={styles.brandSection}>
            <div className={styles.brandGrid}>
              {brandsWithLatest.map((brand) => (
                <div key={brand.slug} id={brand.slug}>
                  <BrandCard
                    name={brand.name}
                    slug={brand.slug}
                    articleCount={brand.articleCount}
                    latestHeadline={brand.latestHeadline}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* All Articles by Brand */}
          {brands.map((brand) => {
            const brandArticles = getArticlesByBrand(brand.slug)
            if (brandArticles.length === 0) return null

            return (
              <section key={brand.slug} className={styles.brandArticles} id={`${brand.slug}-articles`}>
                <h2 className={styles.brandTitle}>
                  {BRAND_NAMES[brand.slug] || brand.slug}
                  <span className={styles.articleCount}>{brandArticles.length} Artikel</span>
                </h2>
                <div className={styles.articleGrid}>
                  {brandArticles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
                {brandArticles.length > 6 && (
                  <div className={styles.viewAll}>
                    <Link
                      href={`/brands#${brand.slug}-articles`}
                      className={styles.viewAllLink}
                    >
                      Alle {brandArticles.length} Artikel ansehen
                    </Link>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}