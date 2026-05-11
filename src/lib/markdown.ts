import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

// Demote all h1 elements in article body to h2 to avoid duplicate H1
// (the page already renders an <h1> from the frontmatter title)
const demoteH1: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'h1') node.tagName = 'h2'
  })
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(demoteH1)
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}
