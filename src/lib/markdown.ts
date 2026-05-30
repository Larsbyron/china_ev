import path from 'node:path'
import sharp from 'sharp'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element, ElementContent, RootContent } from 'hast'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Demote all h1 elements in article body to h2 to avoid duplicate H1
// (the page already renders an <h1> from the frontmatter title)
const demoteH1: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'h1') node.tagName = 'h2'
  })
}

// Remove portrait-orientation body images. Every body image shares the generic
// alt text "Bild", so orientation is the only reliable signal: portrait images
// (height > width) are person/portrait shots that aren't useful for readers.
// Landscape images (car/product shots) are kept and uniformly sized to the
// content column width via the `.article-content img` rule. After dropping an
// image, an emptied wrapping <p> is removed so it leaves no vertical gap.
const removePortraitImages: Plugin<[], Root> = () => async (tree) => {
  const imgNodes: Element[] = []
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'img') return
    const src = node.properties?.src
    if (typeof src === 'string' && src.startsWith('/images/')) {
      imgNodes.push(node)
    }
  })

  if (imgNodes.length === 0) return

  const toRemove = new Set<Element>()
  await Promise.all(
    imgNodes.map(async (node) => {
      const src = node.properties?.src as string
      try {
        const meta = await sharp(path.join(PUBLIC_DIR, src)).metadata()
        if (meta.width && meta.height && meta.height > meta.width) {
          toRemove.add(node)
        }
      } catch {
        // File missing or unreadable — keep the image rather than break the build.
      }
    }),
  )

  if (toRemove.size === 0) return

  const isEmptyParagraph = (node: ElementContent | RootContent): boolean =>
    node.type === 'element' &&
    node.tagName === 'p' &&
    !node.children.some(
      (c) => c.type === 'element' || (c.type === 'text' && c.value.trim() !== ''),
    )

  const prune = (node: Root | Element) => {
    if (!('children' in node) || !node.children) return
    node.children = node.children.filter(
      (child) => !(child.type === 'element' && toRemove.has(child)),
    )
    for (const child of node.children) {
      if (child.type === 'element') prune(child)
    }
    node.children = node.children.filter((child) => !isEmptyParagraph(child))
  }

  prune(tree)
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(demoteH1)
    .use(removePortraitImages)
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}
