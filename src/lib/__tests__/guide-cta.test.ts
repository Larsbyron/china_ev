/**
 * GuideCta — contextual internal link from article pages to the import-cost
 * guide.
 *
 * Two kinds of evidence:
 *  1. behaviour of the pure `guideForArticle` matcher (eligibility matrix),
 *  2. the real corpus: the double split (ad after p2, CTA after p3) must never
 *     duplicate or drop a character of the body, and must reach most articles.
 *
 * vitest runs with `environment: 'node'` and no @testing-library, so the wiring
 * of page.tsx / GuideCta.tsx is asserted on the source text (same precedent as
 * redaktion.test.ts).
 */
import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { splitArticleHtml } from '../article-ad-split'
import { markdownToHtml } from '../markdown'
import { getAllArticles } from '../articles'
import { ORIGINAL_SOURCE_NAME } from '../schemas'
import { GUIDE_CTA_CUT_AFTER, GUIDE_IMPORT, guideForArticle } from '../guide-cta'

const ROOT = process.cwd()
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const SAMPLE_SIZE = 350

const read = (relativePath: string): string =>
  fs.readFileSync(path.join(ROOT, relativePath), 'utf8')

/**
 * Independent scanners. Deliberately NOT imported from ../article-ad-split:
 * a test that reuses the implementation's own arithmetic can never disagree
 * with it (`before + after === html` is true by construction anyway).
 */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
])

function tagBalance(html: string): { unclosed: string[]; strayClosers: string[] } {
  const stack: string[] = []
  const strayClosers: string[] = []
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const raw = m[0]
    const name = m[1].toLowerCase()
    if (raw.startsWith('</')) {
      const open = stack.lastIndexOf(name)
      if (open === -1) strayClosers.push(name)
      else stack.length = open
    } else if (!raw.endsWith('/>') && !VOID.has(name)) {
      stack.push(name)
    }
  }
  return { unclosed: stack, strayClosers }
}

/**
 * Number of root-level `</p>` in a fragment — i.e. paragraphs at depth 0.
 * A naive `fragment.split('</p>').length - 1` over-counts on the real corpus,
 * because `<blockquote><p>…</p></blockquote>` and loose lists
 * (`<ul><li><p>…</p></li></ul>`) contain paragraphs that are NOT cut points:
 * the splitter skips them. Only depth-0 closes are real cut points.
 */
function rootParagraphCloses(html: string): number {
  const stack: string[] = []
  let closes = 0
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const raw = m[0]
    const name = m[1].toLowerCase()
    if (raw.startsWith('</')) {
      const open = stack.lastIndexOf(name)
      if (open === -1) continue
      stack.length = open
      if (name === 'p' && stack.length === 0) closes++
    } else if (!raw.endsWith('/>') && !VOID.has(name)) {
      stack.push(name)
    }
  }
  return closes
}

describe('guideForArticle eligibility', () => {
  const base = {
    slug: '2026-11-01-byd-dolphin-preis-deutschland',
    source: 'CarNewsChina',
    primaryTopic: 'modelle-marktstarts' as const,
  }

  test('eligible topic of a translated article → the import guide', () => {
    expect(guideForArticle(base)).toBe(GUIDE_IMPORT)
    expect(guideForArticle({ ...base, primaryTopic: 'preise-rabatte-wettbewerb' })).toBe(GUIDE_IMPORT)
  })

  test('own Editorial articles never get the CTA', () => {
    expect(guideForArticle({ ...base, source: ORIGINAL_SOURCE_NAME })).toBeNull()
    expect(
      guideForArticle({
        ...base,
        source: ORIGINAL_SOURCE_NAME,
        primaryTopic: 'preise-rabatte-wettbewerb',
      }),
    ).toBeNull()
  })

  test('off-topic primary topics never get the CTA', () => {
    expect(guideForArticle({ ...base, primaryTopic: 'politik-zoelle-regulierung' })).toBeNull()
    expect(guideForArticle({ ...base, primaryTopic: 'batterie-laden-reichweite' })).toBeNull()
    expect(guideForArticle({ ...base, primaryTopic: 'unternehmen-finanzen-kooperationen' })).toBeNull()
  })

  test('a missing primary topic never gets the CTA', () => {
    expect(guideForArticle({ slug: base.slug, source: base.source })).toBeNull()
    expect(guideForArticle({ ...base, primaryTopic: undefined })).toBeNull()
  })

  test('the guide never links to itself', () => {
    const guideSlug = GUIDE_IMPORT.href.replace(/^\/articles\//, '').replace(/\/$/, '')
    expect(guideSlug.length).toBeGreaterThan(0)
    // Foreign source on purpose: the source rule must not be what saves us here.
    expect(
      guideForArticle({ slug: guideSlug, source: 'CarNewsChina', primaryTopic: 'modelle-marktstarts' }),
    ).toBeNull()
  })

  test('the CTA position is one paragraph below the in-article unit', () => {
    expect(GUIDE_CTA_CUT_AFTER).toBe(3)
    // The page splits the post-ad remainder at (GUIDE_CTA_CUT_AFTER - 2).
    expect(GUIDE_CTA_CUT_AFTER - 2).toBe(1)
  })
})

describe('real corpus: double split keeps the body intact', () => {
  test('ad + CTA fragments concatenate to the original HTML, both halves balanced', async () => {
    const all = getAllArticles()
    // Detailed per-article checks run on a deterministic, evenly spread sample
    // (rendering the whole corpus through remark+sharp is too slow for CI);
    // the coverage guard below counts eligibility over the whole corpus.
    const step = Math.max(1, Math.floor(all.length / SAMPLE_SIZE))
    expect(all.length).toBeGreaterThanOrEqual(SAMPLE_SIZE)

    let detailed = 0
    let withBothSplits = 0
    let ctaEligible = 0
    const failures: string[] = []

    for (const [i, meta] of all.entries()) {
      const file = path.join(POSTS_DIR, `${meta.slug}.md`)
      if (!fs.existsSync(file)) continue
      const markdown = matter(fs.readFileSync(file, 'utf-8')).content.trim()
      const html = await markdownToHtml(markdown)

      // Production path when ad slots are configured: ad after p2, CTA after
      // one more paragraph of the remainder.
      const adParts = splitArticleHtml(html, 2)
      const ctaParts = adParts ? splitArticleHtml(adParts.after, GUIDE_CTA_CUT_AFTER - 2) : null

      if (guideForArticle(meta) && ctaParts) ctaEligible++

      if (i % step !== 0 || detailed >= SAMPLE_SIZE) continue
      detailed++

      if (!adParts || !ctaParts) {
        // Both splits must degrade together: no ad part ⇒ no CTA part either.
        expect(ctaParts).toBeNull()
        continue
      }
      withBothSplits++

      // Nothing lost, nothing duplicated.
      expect(adParts.before + ctaParts.before + ctaParts.after).toBe(html)

      // The CTA sits exactly one root-level paragraph below the ad unit.
      const added = rootParagraphCloses(ctaParts.before)
      if (added !== 1) failures.push(`${meta.slug}: +${added} root </p> in CTA part`)

      // Every rendered fragment is independently well-formed markup.
      for (const fragment of [adParts.before, ctaParts.before, ctaParts.after]) {
        const { unclosed, strayClosers } = tagBalance(fragment)
        if (unclosed.length || strayClosers.length) {
          failures.push(`${meta.slug}: fragment not balanced (${unclosed.join('>')}/${strayClosers.join('>')})`)
        }
      }

      // No fragment is empty — an empty div would render nothing but still cut.
      expect(ctaParts.before.trim().length).toBeGreaterThan(0)
      expect(ctaParts.after.trim().length).toBeGreaterThan(0)
    }

    expect(detailed).toBeGreaterThanOrEqual(SAMPLE_SIZE)
    expect(failures).toEqual([])
    // The double split must actually work on the sample, not silently degrade.
    expect(withBothSplits / detailed).toBeGreaterThan(0.9)

    // Coverage guard: the whole point is that the guide gets linked from the
    // bulk of the corpus, not from a handful of pages.
    expect(ctaEligible).toBeGreaterThanOrEqual(1_800)
  }, 300_000)
})

describe('page wiring', () => {
  const page = read('src/app/articles/[slug]/page.tsx')
  const component = read('src/components/GuideCta.tsx')
  const css = read('src/components/GuideCta.module.css')

  test('the article page asks the matcher and renders the CTA once', () => {
    expect(page).toContain('guideForArticle(article)')
    expect(page).toContain("import GuideCta from '@/components/GuideCta'")
    expect(page).toContain('<GuideCta')
    // Exactly two render sites: with ad / without ad.
    expect(page.match(/<GuideCta /g)?.length).toBe(2)
  })

  test('the existing ad and affiliate wiring is untouched', () => {
    expect(page).toContain('<AdUnit slot={adSlotInArticle} variant="in-article" />')
    expect(page).toContain('<AffiliateBox />')
  })

  test('GuideCta is a static server component', () => {
    expect(component).not.toContain("'use client'")
    expect(component).not.toContain('onClick')
    expect(component).not.toContain('fetch(')
    expect(component).not.toContain("from 'next/link'")
    expect(component).not.toContain('useEffect')
    expect(component).toContain('data-pagefind-ignore')
    expect(component).toContain('href={data.href}')
  })

  test('CTA styling separates it from the ad block and uses design tokens', () => {
    expect(css).toContain('margin: var(--space-8) 0')
    expect(css).toContain('border-left: var(--accent-line-width) solid var(--color-accent-green)')
    expect(css).toContain('background: var(--color-bg-secondary)')
  })
})
