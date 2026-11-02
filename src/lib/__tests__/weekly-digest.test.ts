import { afterAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import { articleFrontmatterSchema } from '../schemas'
import { parseMarkdownFile } from '../articles'
import {
  WEEKLY_DIGEST_URL,
  buildWeeklyDigestFrontmatter,
  buildWeeklyDigestMarkdown,
  validateWeeklyDigestMarkdown,
  weeklyDigestTitle,
  type WeeklyDigestTopItem,
} from '../weekly-digest'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

/**
 * Regression guard for the weekly Top-5 digest frontmatter.
 *
 * The writer used to hand-write `source: "Weekly"` (not a member of
 * SOURCE_NAMES) and omit `original_url`, so every generated
 * content/posts/weekly-top5-*.md failed articleFrontmatterSchema,
 * getAllArticles() skipped it and /articles/<slug>/ returned 404.
 *
 * Both tests deliberately go through parseMarkdownFile() — the same
 * gray-matter + zod path getAllArticles() uses — instead of re-checking the
 * schema by hand.
 */

const tmpDirs: string[] = []

function writeTempDigest(fileName: string, markdown: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'e-autos-weekly-'))
  tmpDirs.push(dir)
  const filePath = path.join(dir, fileName)
  fs.writeFileSync(filePath, markdown, 'utf-8')
  return filePath
}

afterAll(() => {
  for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true })
})

const SAMPLE_ITEMS: WeeklyDigestTopItem[] = [
  { title: 'BYD startet Seagull Gen 2', source: 'CarNewsChina', date: '2026-05-14T08:00:00.000Z', url: 'https://carnewschina.com/byd-seagull' },
  { title: 'XPeng GX Marktstart', source: 'Autohome', date: '2026-05-13T08:00:00.000Z' },
]

describe('weekly digest Markdown', () => {
  it('builds a digest the production parser accepts', () => {
    const markdown = buildWeeklyDigestMarkdown({
      isoWeek: 20,
      year: 2026,
      dateISO: '2026-05-15T10:59:35.962Z',
      items: SAMPLE_ITEMS,
    })

    const article = parseMarkdownFile(writeTempDigest('weekly-top5-2026-W20.md', markdown))

    expect(article).not.toBeNull()
    if (!article) return // narrow for TS; assertion above already failed

    expect(article.title).toBe('Top 5 chinesische E-Autos – KW 20/2026')
    expect(article.title).toContain('KW 20/2026')
    expect(article.source).toBe('E-AUTOS Redaktion')
    expect(article.original_url).toBe(WEEKLY_DIGEST_URL)
    expect(article.category).toBe('weekly')
    expect(article.draft).toBe(false)
    expect(article.date).toBe('2026-05-15T10:59:35.962Z')
    expect(article.primaryTopic).toBe('modelle-marktstarts')
    expect(article.secondaryTopics).toEqual(['preise-rabatte-wettbewerb', 'markt-absatz-zulassungen'])
    expect(article.marketRelevance).toBe('china_only')
    expect(article.content).toContain('Top 5 chinesische E-Autos – KW 20/2026')
    expect(article.content).toContain('https://carnewschina.com/byd-seagull')
  })

  it('emits frontmatter that validates on its own', () => {
    const frontmatter = buildWeeklyDigestFrontmatter({
      isoWeek: 7,
      year: 2027,
      dateISO: '2027-02-16T09:00:00.000Z',
    })
    // gray-matter is the app's frontmatter reader; feed it the block alone.
    const parsed = articleFrontmatterSchema.safeParse(matter(frontmatter).data)

    expect(parsed.success).toBe(true)
    if (!parsed.success) return
    expect(parsed.data.title).toContain('KW 7/2027')
    expect(parsed.data.source).toBe('E-AUTOS Redaktion')
  })

  it('generates a unique title per ISO week', () => {
    expect(weeklyDigestTitle(20, 2026)).not.toBe(weeklyDigestTitle(21, 2026))
    expect(weeklyDigestTitle(20, 2026)).not.toBe(weeklyDigestTitle(20, 2027))
    expect(weeklyDigestTitle(20, 2026)).toBe('Top 5 chinesische E-Autos – KW 20/2026')
  })
})

/**
 * Runtime gate used by the scraper before it writes the digest file. Kept in
 * the same module as the generator so the gate cannot drift from the schema.
 */
describe('validateWeeklyDigestMarkdown', () => {
  it('accepts what the generator produces', () => {
    const markdown = buildWeeklyDigestMarkdown({
      isoWeek: 44,
      year: 2026,
      dateISO: '2026-10-30T17:41:08.192Z',
      items: SAMPLE_ITEMS,
    })
    expect(validateWeeklyDigestMarkdown(markdown)).toEqual([])
  })

  it('rejects the legacy hand-written frontmatter that shipped as W44', () => {
    const legacy = `---
title: "Top 5 chinesische E-Autos diese Woche"
date: 2026-10-30T17:41:08.192Z
description: "Die fünf wichtigsten chinesischen E-Auto-Nachrichten dieser Woche"
source: "Weekly"
category: "weekly"
tags: ["Top 5", "China", "E-Auto"]
draft: false
---

# Top 5 chinesische E-Autos diese Woche
`
    const issues = validateWeeklyDigestMarkdown(legacy)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.join('; ')).toContain('source')
    expect(issues.join('; ')).toContain('original_url')
  })
})

/**
 * Net that would have caught the original bug one run earlier: every published
 * file in content/posts must parse, otherwise its page 404s in production
 * while the build only prints an "Invalid frontmatter" warning.
 */
describe('content/posts frontmatter', () => {
  it('parses every top-level article file', () => {
    const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'))
    expect(files.length).toBeGreaterThan(1000)

    const failures: string[] = []
    for (const file of files) {
      const filePath = path.join(POSTS_DIR, file)
      if (parseMarkdownFile(filePath) !== null) continue

      const parsed = articleFrontmatterSchema.safeParse(matter(fs.readFileSync(filePath, 'utf-8')).data)
      const reason = parsed.success
        ? 'file is unreadable'
        : parsed.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('; ')
      failures.push(`${file} -> ${reason}`)
    }

    expect(failures).toEqual([])
  })
})
