import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { findArticleCutPoints, splitArticleHtml } from '../article-ad-split'
import { markdownToHtml } from '../markdown'
import { getAllArticles } from '../articles'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const SAMPLE_SIZE = 400

/**
 * Independent tag-balance helpers. Deliberately implemented here (not imported
 * from ../article-ad-split) so the test cross-checks the splitter instead of
 * restating its own arithmetic: `before + after === html` is true by
 * construction and can never fail, so it is only a sanity check.
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

/** Elements still open at a given offset — the property a cut point must break. */
function openAt(html: string, offset: number): string[] {
  return tagBalance(html.slice(0, offset)).unclosed
}

describe('splitArticleHtml', () => {
  test('cuts after the Nth root-level paragraph', () => {
    const html = '<p>a</p><p>b</p><p>c</p>'
    const parts = splitArticleHtml(html, 2)
    expect(parts).not.toBeNull()
    expect(parts!.before).toBe('<p>a</p><p>b</p>')
    expect(parts!.after).toBe('<p>c</p>')
    expect(parts!.before + parts!.after).toBe(html) // sanity only, always true
    // Real invariant: both halves are independently balanced fragments.
    expect(tagBalance(parts!.before)).toEqual({ unclosed: [], strayClosers: [] })
    expect(tagBalance(parts!.after)).toEqual({ unclosed: [], strayClosers: [] })
  })

  test('returns null when there are not enough root-level paragraphs', () => {
    expect(splitArticleHtml('<p>a</p>', 2)).toBeNull()
    expect(splitArticleHtml('no paragraphs at all', 2)).toBeNull()
  })

  test('never cuts inside a list, table or blockquote', () => {
    const list = '<p>a</p><ul><li>x</li></ul><p>b</p>'
    const listParts = splitArticleHtml(list, 1)
    expect(listParts!.before).toBe('<p>a</p>')
    expect(listParts!.after.startsWith('<ul>')).toBe(true)

    const table = '<p>a</p><table><tr><td>x</td></tr></table><p>b</p>'
    const tableParts = splitArticleHtml(table, 1)
    expect(tableParts!.after.startsWith('<table>')).toBe(true)

    const quote = '<p>a</p><blockquote><p>x</p></blockquote><p>b</p>'
    const quoteParts = splitArticleHtml(quote, 1)
    expect(quoteParts!.after.startsWith('<blockquote>')).toBe(true)
  })

  // Regression: a loose list (<ul><li><p>…</p></li></ul>) used to be cut right
  // after the inner </p>, leaving the ul/li open on the before side and
  // stranding </li> at the start of the after side. Found in the real corpus
  // (30 articles contain loose lists).
  test('loose list: never cut inside <ul><li><p>…</p></li>', () => {
    const loose = '<p>a</p><ul><li><p>b</p></li><li><p>c</p></li></ul><p>d</p>'
    const parts = splitArticleHtml(loose, 1)
    expect(parts!.before).toBe('<p>a</p>')
    expect(parts!.after.startsWith('<ul>')).toBe(true)

    // Only two root-level paragraphs exist (a, d) → the 2nd cut would be after
    // "d", which leaves nothing on the after side → null (degrade, don't split).
    expect(splitArticleHtml(loose, 2)).toBeNull()
    expect(findArticleCutPoints(loose)).toEqual([8, loose.length])
  })

  test('rejects non-positive paragraph counts', () => {
    expect(splitArticleHtml('<p>a</p><p>b</p>', 0)).toBeNull()
    expect(splitArticleHtml('<p>a</p><p>b</p>', -1)).toBeNull()
  })

  // Real-corpus regression: deterministic even spread over the whole corpus,
  // rendered through the same remark/rehype pipeline the article page uses.
  test('real corpus: no cut inside a container, split rate > 80% (>=400 articles)', async () => {
    const all = getAllArticles()
    expect(all.length).toBeGreaterThanOrEqual(SAMPLE_SIZE)

    const step = Math.max(1, Math.floor(all.length / SAMPLE_SIZE))
    const sample = all.filter((_, i) => i % step === 0).slice(0, SAMPLE_SIZE)
    expect(sample.length).toBeGreaterThanOrEqual(SAMPLE_SIZE)

    let tested = 0
    let splitOk = 0
    let cutsChecked = 0
    const badCuts: string[] = []

    for (const meta of sample) {
      const file = path.join(POSTS_DIR, `${meta.slug}.md`)
      if (!fs.existsSync(file)) continue
      const markdown = matter(fs.readFileSync(file, 'utf-8')).content.trim()
      const html = await markdownToHtml(markdown)
      tested++

      // Cross-check every candidate cut point with the independent scanner.
      for (const cut of findArticleCutPoints(html)) {
        cutsChecked++
        const open = openAt(html, cut)
        if (open.length > 0) badCuts.push(`${meta.slug} cut inside ${open.join('>')}`)
      }

      const parts = splitArticleHtml(html, 2)
      if (!parts) continue
      expect(parts.before + parts.after).toBe(html)
      expect(tagBalance(parts.before).unclosed).toEqual([])
      expect(tagBalance(parts.after).strayClosers).toEqual([])
      splitOk++
    }

    expect(tested).toBeGreaterThanOrEqual(SAMPLE_SIZE)
    expect(cutsChecked).toBeGreaterThan(0)
    // The whole point of the depth check: zero cuts inside an open container.
    expect(badCuts).toEqual([])
    // If this ever drops, the body markup shape changed — degrade to no split
    // rather than cutting the article in the wrong place.
    expect(splitOk / tested).toBeGreaterThan(0.8)
  }, 300_000)
})
