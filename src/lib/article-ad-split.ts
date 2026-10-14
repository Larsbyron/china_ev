export type ArticleHtmlParts = { before: string; after: string }

/**
 * Split rendered article HTML right after the Nth closing </p> so an in-article
 * ad unit can sit between two block-level elements. Returns null when the
 * article has fewer than afterParagraphs+1 paragraphs, or when either side
 * would be empty — callers must then fall back to rendering the content
 * unsplit (the in-article unit degrades to an end-of-body unit).
 *
 * Why </p> only: the markdown pipeline (src/lib/markdown.ts) emits plain
 * block-level HTML, so a boundary right after "</p>" + trailing whitespace can
 * never land inside a <ul>, <table> or <pre>.
 */
export function splitArticleHtml(html: string, afterParagraphs = 2): ArticleHtmlParts | null {
  if (afterParagraphs < 1) return null
  const boundaries: number[] = []
  const re = /<\/p>\s*/g
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    boundaries.push(match.index + match[0].length)
  }
  if (boundaries.length < afterParagraphs + 1) return null
  const cut = boundaries[afterParagraphs - 1]
  const before = html.slice(0, cut)
  const after = html.slice(cut)
  if (!before.trim() || !after.trim()) return null
  return { before, after }
}
