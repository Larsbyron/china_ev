import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import GiscusComments from '@/components/GiscusComments'
import QuickFacts from '@/components/QuickFacts'
import ShareButtons from '@/components/ShareButtons'
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByBrand,
  formatDate,
} from '@/lib/articles'
import styles from './page.module.css'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Artikel nicht gefunden',
    }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.source],
      images: article.image ? [article.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.brand
    ? getArticlesByBrand(article.brand).filter((a) => a.slug !== slug).slice(0, 3)
    : []

  return (
    <>
      <SiteHeader />

      <main className={styles.main} aria-label="Hauptinhalt">
        <article className={styles.article}>
          {/* Article Header */}
          <header className={styles.header}>
            <div className={styles.container}>
              <Link href="/" className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Zurück
              </Link>

              <div className={styles.meta}>
                {article.brand && (
                  <span className={styles.brand}>{article.brand}</span>
                )}
                <span className={styles.source}>{article.source}</span>
                <time className={styles.date} dateTime={article.date}>
                  {formatDate(article.date)}
                </time>
                <span className={styles.readTime}>
                  {article.read_time_minutes} Min. Lesezeit
                </span>
              </div>

              <h1 className={styles.title}>{article.title}</h1>

              {article.description && (
                <p className={styles.description}>{article.description}</p>
              )}
            </div>
          </header>

          {/* Hero Image */}
          {article.image && (
            <div className={styles.heroImage}>
              <img
                src={article.image}
                alt={article.title}
                width={1200}
                height={630}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}

          {/* Article Body + Sidebar */}
          <div className={styles.body}>
            <div className={styles.bodyLayout}>
              <div className={styles.content}>
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className={styles.tags}>
                    {article.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Share */}
                <ShareButtons
                  title={article.title}
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://china-ev.de'}/articles/${article.slug}/`}
                />

                {/* Source Link */}
                {article.original_url && (
                  <div className={styles.sourceLink}>
                    <a
                      href={article.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Quelle: {article.source}
                    </a>
                  </div>
                )}
              </div>

              {/* Quick Facts Sidebar */}
              {article.ev_model && (
                <QuickFacts evModel={article.ev_model} />
              )}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className={styles.related}>
              <div className={styles.container}>
                <h2 className={styles.relatedTitle}>Mehr von {article.brand}</h2>
                <div className={styles.relatedGrid}>
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/articles/${related.slug}`}
                      className={styles.relatedCard}
                    >
                      {related.image && (
                        <img src={related.image} alt="" width={480} height={270} loading="lazy" decoding="async" className={styles.relatedImage} />
                      )}
                      <div className={styles.relatedContent}>
                        <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                        <time className={styles.relatedDate} dateTime={related.date}>
                          {formatDate(related.date)}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Comments */}
          <div className={styles.comments}>
            <div className={styles.container}>
              <GiscusComments title={article.title} />
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  )
}