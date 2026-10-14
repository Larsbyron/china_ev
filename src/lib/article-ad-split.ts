export type ArticleHtmlParts = { before: string; after: string }

/** Void elements never open a scope, so they must not be pushed on the stack. */
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?>/g

/**
 * End offsets that are safe cut points: right after a closing </p> that leaves
 * no element open — i.e. between two root-level siblings.
 *
 * A `</p>` inside a loose list (`<ul><li><p>…</p></li></ul>`), a blockquote or a
 * table is NOT a valid cut point: slicing there leaves the list open on the
 * `before` side and strands `</li>` at the start of the `after` side, so the two
 * halves are no longer independently well-formed fragments. Verified on the real
 * corpus: 30 articles contain loose lists, and before this depth check one of
 * them was cut inside `<ul><li>`.
 */
export function findArticleCutPoints(html: string): number[] {
  const stack: string[] = []
  const cuts: number[] = []
  TAG_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TAG_RE.exec(html)) !== null) {
    const raw = m[0]
    const name = m[1].toLowerCase()
    if (raw.startsWith('</')) {
      const open = stack.lastIndexOf(name)
      if (open === -1) continue // stray close tag: nothing to unwind
      stack.length = open
      if (name === 'p' && stack.length === 0) {
        // Swallow the whitespace after the tag so the `before` half ends cleanly.
        const ws = /^\s*/.exec(html.slice(m.index + raw.length))?.[0].length ?? 0
        cuts.push(m.index + raw.length + ws)
      }
    } else if (!raw.endsWith('/>') && !VOID_ELEMENTS.has(name)) {
      stack.push(name)
    }
  }
  return cuts
}

/**
 * Split rendered article HTML after the Nth root-level paragraph so an
 * in-article ad unit can sit between two block-level siblings.
 *
 * Returns null when there are not enough root-level paragraphs, or when either
 * half would be empty — callers must then render the content unsplit and skip
 * the in-article unit entirely (never push an In-article slot with Display
 * attributes, which mismatches the unit type created in AdSense).
 */
export function splitArticleHtml(html: string, afterParagraphs = 2): ArticleHtmlParts | null {
  if (afterParagraphs < 1) return null
  const cuts = findArticleCutPoints(html)
  if (cuts.length < afterParagraphs) return null
  const cut = cuts[afterParagraphs - 1]
  const before = html.slice(0, cut)
  const after = html.slice(cut)
  if (!before.trim() || !after.trim()) return null
  return { before, after }
}
