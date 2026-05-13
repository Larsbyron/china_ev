import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import BrandCard from '@/components/BrandCard'
import { getAllBrands, getArticlesByBrand } from '@/lib/articles'
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

          <section className={styles.brandSection}>
            <div className={styles.brandGrid}>
              {brandsWithLatest.map((brand) => (
                <BrandCard
                  key={brand.slug}
                  name={brand.name}
                  slug={brand.slug}
                  articleCount={brand.articleCount}
                  latestHeadline={brand.latestHeadline}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}