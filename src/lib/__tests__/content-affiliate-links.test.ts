import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'

/**
 * Guard: published article bodies must never carry a bare Amazon link.
 *
 * Why (measured 2026-10-20): the client-side click beacon only ran after
 * hydration and never with JS disabled, so Amazon counted clicks we never saw
 * (13 PartnerNet clicks vs 7 requests reaching our counter). The fix is a
 * server-side hop — every affiliate link in the body points at the same-site
 * `/zubehoer/<slot>/` path, which counts and then redirects. One direct
 * `amazon.de` URL left in a body silently bypasses that counting, so it is
 * treated as a test failure instead of something a reviewer has to notice.
 *
 * Scope: top-level `content/posts/*.md` only (drafts/ is unpublished and may
 * legitimately hold scratch links). Frontmatter is stripped before scanning —
 * canonical/source metadata is not article text.
 */

const POSTS_DIR = path.resolve(process.cwd(), 'content/posts')

/** A same-site hop is the only allowed form in body copy. */
const CANONICAL_REDIRECT = '/zubehoer/'

interface Violation {
  file: string
  line: number
  rule: string
  excerpt: string
}

/**
 * What counts as a "bare Amazon link":
 *  - any absolute or protocol-relative URL on an amazon.* host
 *  - a scheme-less `amazon.de/…` / `www.amazon.de/…` (needs the slash, so the
 *    prose "bei Amazon.de (Anzeige)" in a link *label* stays legal)
 *  - the affiliate tag itself, which only ever belongs in the redirect target
 */
const RULES: { name: string; re: RegExp }[] = [
  { name: 'amazon-url', re: /(?:https?:)?\/\/[\w.-]*\bamazon\.(?:de|com)\b/gi },
  { name: 'amazon-bare-domain', re: /\b(?:www\.)?amazon\.de\//gi },
  { name: 'affiliate-tag', re: /\bbyronbai-21\b/gi },
]

/** Remove the YAML frontmatter block so only body text is scanned. */
function bodyOf(raw: string): string {
  const match = /^---\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/.exec(raw)
  return match ? raw.slice(match[0].length) : raw
}

function findViolations(relativeFile: string, body: string): Violation[] {
  const violations: Violation[] = []
  for (const rule of RULES) {
    // Fresh lastIndex per file: the regexes are /g and shared across the loop.
    rule.re.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = rule.re.exec(body)) !== null) {
      const start = match.index
      const end = start + match[0].length
      violations.push({
        file: relativeFile,
        line: body.slice(0, start).split('\n').length,
        rule: rule.name,
        excerpt: body.slice(Math.max(0, start - 40), end + 40).replace(/\n/g, ' '),
      })
    }
  }
  return violations
}

/** Top-level published posts only — `drafts/` is skipped (non-recursive read). */
function publishedPostFiles(): string[] {
  return readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()
}

describe('content: no bare Amazon links in published bodies', () => {
  test('scanner catches the shapes it is supposed to (not a no-op)', () => {
    const sample = [
      'Text.',
      '[Kabel](https://www.amazon.de/s?k=ladekabel&tag=byronbai-21) hier.',
      '<a href="//amazon.de/dp/B000">x</a>',
      'schoen: [Kabel](/zubehoer/laden/)',
      'Prosa: bei Amazon.de (Anzeige) gekauft.',
    ].join('\n')

    const found = findViolations('sample.md', sample)
    const rules = new Set(found.map((v) => v.rule))

    expect(rules).toContain('amazon-url')
    expect(rules).toContain('affiliate-tag')
    // The legal forms must NOT be flagged.
    expect(found.every((v) => !v.excerpt.includes('/zubehoer/laden/'))).toBe(true)
    expect(found.some((v) => v.excerpt.trim() === 'Prosa: bei Amazon.de (Anzeige) gekauft.')).toBe(false)
    // Line numbers point at the offending line, not the file start.
    expect(found.filter((v) => v.rule === 'affiliate-tag')[0].line).toBe(2)
  })

  test('no published post body contains a bare Amazon link', () => {
    const files = publishedPostFiles()

    const violations: Violation[] = []
    for (const name of files) {
      const body = bodyOf(readFileSync(path.join(POSTS_DIR, name), 'utf8'))
      violations.push(...findViolations(`content/posts/${name}`, body))
    }

    // Failure message names the file and line so the fix is a one-liner.
    const report = violations
      .map((v) => `${v.file}:${v.line} [${v.rule}] …${v.excerpt}…`)
      .join('\n')

    expect(violations, `bare Amazon links found in ${violations.length} place(s):\n${report}`).toHaveLength(0)
    // Guard against a silently empty scan (bad path / renamed directory).
    expect(files.length).toBeGreaterThan(1000)
  })

  test('the known-good article uses the same-site hop (scanner is not vacuous)', () => {
    const file = '2026-10-23-was-kostet-der-china-auto-import-nach-deutschland.md'
    const raw = readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const body = bodyOf(raw)

    // The rewritten affiliate link is present and points at the hop …
    expect(body).toContain(`${CANONICAL_REDIRECT}laden/`)
    // … and the article is clean by our own rules.
    expect(findViolations(`content/posts/${file}`, body)).toEqual([])
  })
})
