import styles from './GuideCta.module.css'
import type { GuideCtaData } from '@/lib/guide-cta'

/**
 * Contextual link from a translated article to our import-cost guide.
 *
 * Server component on purpose: it is plain markup with one anchor, so it must
 * work without JavaScript and must not add hydration or client-side JS to the
 * ~2,200 statically rendered article pages.
 *
 * `data-pagefind-ignore`: the same sentence appears on every article page that
 * carries the CTA. Pagefind would otherwise index that boilerplate as body text
 * of hundreds of pages and swamp the on-site search results. The attribute only
 * affects the Pagefind index — Google still sees and follows the link.
 *
 * No `<h2>`: an aside is not a section, and a heading here would inject an entry
 * into every article's table of contents / document outline.
 */
export default function GuideCta({ data }: { data: GuideCtaData }) {
  return (
    <aside className={styles.box} data-pagefind-ignore aria-label="Ratgeber-Hinweis">
      <p className={styles.label}>Ratgeber</p>
      <p className={styles.title}>{data.title}</p>
      <p className={styles.text}>{data.text}</p>
      <p className={styles.more}>
        {/* Plain <a>, not next/link: no prefetch for a link rendered on
            thousands of pages. */}
        <a className={styles.link} href={data.href}>
          {data.linkLabel} →
        </a>
      </p>
    </aside>
  )
}
