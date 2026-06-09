import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import BrandCard from '@/components/BrandCard'
import { getAllBrands, getArticlesByBrand } from '@/lib/articles'
import { canonicalUrl } from '@/lib/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Marken',
  description: 'Alle Marken im Überblick — chinesische EV-Hersteller wie BYD, NIO, XPeng und internationale Marken wie VW, Audi und Mercedes-Benz.',
  alternates: {
    canonical: canonicalUrl('/brands/'),
  },
}

export default function BrandsPage() {
  const brands = getAllBrands()

  const brandsWithLatest = brands.map((brand) => {
    const brandArticles = getArticlesByBrand(brand.name)
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
              Chinesische und internationale Marken mit aktuellen Artikeln
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
