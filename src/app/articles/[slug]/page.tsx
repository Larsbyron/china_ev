import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import GiscusComments from '@/components/GiscusComments'
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
  const article = getArticleBySlug(slug)

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
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.brand
    ? getArticlesByBrand(article.brand).filter((a) => a.slug !== slug).slice(0, 3)
    : []

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
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
                loading="eager"
                fetchPriority="high"
              />
            </div>
          )}

          {/* Article Body */}
          <div className={styles.body}>
            <div className={styles.content}>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className={styles.tags}>
                  {article.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}

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
                        <img src={related.image} alt="" className={styles.relatedImage} />
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

function formatContent(content: string): string {
  // Convert markdown-style content to HTML
  // Handle headers
  let html = content
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')

  // Handle paragraphs (double newlines)
  html = html
    .split('\n\n')
    .map((para) => {
      para = para.trim()
      if (!para) return ''
      if (para.startsWith('<h')) return para
      // Handle single newlines within paragraphs as line breaks
      if (para.includes('\n') && !para.startsWith('<')) {
        return `<p>${para.replace(/\n/g, '<br />')}</p>`
      }
      return `<p>${para}</p>`
    })
    .join('\n')

  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr />')

  // Handle bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Handle links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

  return html
}