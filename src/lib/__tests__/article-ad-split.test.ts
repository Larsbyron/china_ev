import { describe, expect, test } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { splitArticleHtml } from '../article-ad-split'
import { markdownToHtml } from '../markdown'
import { getAllArticles } from '../articles'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const SAMPLE_SIZE = 120

// getAllArticles() returns metadata only (it strips `content`), so read the raw
// markdown body from disk and run it through the exact same remark/rehype
// pipeline the article page uses.
function articleMarkdownBody(slug: string): string | null {
  const file = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  return matter(fs.readFileSync(file, 'utf-8')).content.trim()
}

describe('splitArticleHtml', () => {
  test('cuts after the Nth paragraph and round-trips lossless', () => {
    const html = '<p>a</p><p>b</p><p>c</p>'
    const parts = splitArticleHtml(html, 2)
    expect(parts).not.toBeNull()
    expect(parts!.before + parts!.after).toBe(html)
    expect(parts!.before).toBe('<p>a</p><p>b</p>')
    expect(parts!.after).toBe('<p>c</p>')
  })

  test('returns null when there are not enough paragraphs', () => {
    expect(splitArticleHtml('<p>a</p>', 2)).toBeNull()
    expect(splitArticleHtml('no paragraphs at all', 2)).toBeNull()
  })

  test('never cuts inside a list or table (boundary is always block-level)', () => {
    const list = '<p>a</p><ul><li>x</li></ul><p>b</p>'
    const listParts = splitArticleHtml(list, 1)
    expect(listParts).not.toBeNull()
    expect(listParts!.after.startsWith('<ul>')).toBe(true)
    expect(listParts!.before + listParts!.after).toBe(list)

    const table = '<p>a</p><table><tr><td>x</td></tr></table><p>b</p>'
    const tableParts = splitArticleHtml(table, 1)
    expect(tableParts).not.toBeNull()
    expect(tableParts!.after.startsWith('<table>')).toBe(true)
  })

  test('rejects non-positive paragraph counts', () => {
    expect(splitArticleHtml('<p>a</p><p>b</p>', 0)).toBeNull()
    expect(splitArticleHtml('<p>a</p><p>b</p>', -1)).toBeNull()
  })

  // Real-corpus regression: sample >=120 real articles from getAllArticles(),
  // render each through markdownToHtml() and assert the split is lossless
  // (before + after === html) plus a healthy overall split rate.
  test('real corpus: every split lossless, split rate > 80% (>=120 articles)', async () => {
    const all = getAllArticles()
    expect(all.length).toBeGreaterThanOrEqual(SAMPLE_SIZE)

    // Deterministic even spread over the whole corpus (newest-first list).
    const step = Math.max(1, Math.floor(all.length / SAMPLE_SIZE))
    const sample = all.filter((_, i) => i % step === 0).slice(0, SAMPLE_SIZE)
    expect(sample.length).toBeGreaterThanOrEqual(SAMPLE_SIZE)

    let tested = 0
    let splitOk = 0
    for (const meta of sample) {
      const markdown = articleMarkdownBody(meta.slug)
      if (!markdown) continue
      const html = await markdownToHtml(markdown)
      tested++
      const parts = splitArticleHtml(html, 2)
      if (!parts) continue
      expect(parts.before + parts.after).toBe(html)
      expect(parts.before.length).toBeGreaterThan(0)
      expect(parts.after.length).toBeGreaterThan(0)
      splitOk++
    }

    expect(tested).toBeGreaterThanOrEqual(SAMPLE_SIZE)
    // If this ever drops, the body markup shape changed — degrade to no split
    // rather than cutting the article in the wrong place.
    expect(splitOk / tested).toBeGreaterThan(0.8)
  }, 120_000)
})
