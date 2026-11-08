import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { MODEL_MERGES } from '../model-merges'

// BUG-11-04-1 regression guard.
// A 301 merge only removes a page from `sitemap.xml` / `news-sitemap.xml`, which read the
// MODEL_MERGES map. `/articles`, `/` and the weekly digest all use `getAllArticles()`, which
// simply lists every non-draft file in `content/posts` — so as long as a merged source file
// keeps living there, the archive shows duplicate cards that 301 on click.
// Fix = move every merged source into `content/posts/drafts/`; this test fails if one slips back.
const POSTS = path.join(process.cwd(), 'content', 'posts')
const DRAFTS = path.join(POSTS, 'drafts')

describe('model merges: source files must not be published', () => {
  const sources = Object.keys(MODEL_MERGES)
  const targets = Array.from(new Set(Object.values(MODEL_MERGES)))

  it('has a merge map', () => {
    expect(sources.length).toBeGreaterThan(0)
  })

  it('no merged source file is still served from content/posts', () => {
    const stillPublished = sources.filter((slug) => fs.existsSync(path.join(POSTS, `${slug}.md`)))
    expect(stillPublished).toEqual([])
  })

  it('every merged source file is archived under content/posts/drafts', () => {
    const notArchived = sources.filter((slug) => !fs.existsSync(path.join(DRAFTS, `${slug}.md`)))
    expect(notArchived).toEqual([])
  })

  it('every merge target is a published article', () => {
    const missingTargets = targets.filter((slug) => !fs.existsSync(path.join(POSTS, `${slug}.md`)))
    expect(missingTargets).toEqual([])
  })
})
