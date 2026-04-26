import { describe, it, expect } from 'vitest'
import { markdownToHtml } from '../markdown'

describe('markdownToHtml', () => {
  it('converts plain text to paragraph', async () => {
    const html = await markdownToHtml('Hello World')
    expect(html).toContain('<p>Hello World</p>')
  })

  it('converts headers', async () => {
    const h1 = await markdownToHtml('# Title')
    const h2 = await markdownToHtml('## Subtitle')
    const h3 = await markdownToHtml('### Section')
    expect(h1).toContain('<h1>Title</h1>')
    expect(h2).toContain('<h2>Subtitle</h2>')
    expect(h3).toContain('<h3>Section</h3>')
  })

  it('converts bold and italic', async () => {
    const bold = await markdownToHtml('**bold**')
    const italic = await markdownToHtml('*italic*')
    expect(bold).toContain('<strong>bold</strong>')
    expect(italic).toContain('<em>italic</em>')
  })

  it('converts links', async () => {
    const html = await markdownToHtml('[link](https://example.com)')
    expect(html).toContain('<a href="https://example.com">link</a>')
  })

  it('converts unordered lists', async () => {
    const html = await markdownToHtml('- item 1\n- item 2')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>item 1</li>')
    expect(html).toContain('<li>item 2</li>')
  })

  it('converts ordered lists', async () => {
    const html = await markdownToHtml('1. first\n2. second')
    expect(html).toContain('<ol>')
    expect(html).toContain('<li>first</li>')
  })

  it('converts blockquotes', async () => {
    const html = await markdownToHtml('> quote')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('quote')
  })

  it('converts horizontal rules', async () => {
    const html = await markdownToHtml('---')
    expect(html).toContain('<hr>')
  })

  it('converts code blocks', async () => {
    const html = await markdownToHtml('```\ncode\n```')
    expect(html).toContain('<code>')
    expect(html).toContain('code')
  })

  it('converts inline code', async () => {
    const html = await markdownToHtml('use `npm install`')
    expect(html).toContain('<code>npm install</code>')
  })

  it('handles Chinese content', async () => {
    const html = await markdownToHtml('比亚迪发布新车型')
    expect(html).toContain('<p>比亚迪发布新车型</p>')
  })

  it('handles empty input', async () => {
    const html = await markdownToHtml('')
    expect(html).toBe('')
  })

  it('handles mixed content', async () => {
    const md = `# Title\n\nParagraph with **bold**.\n\n- list item\n\n> quote`
    const html = await markdownToHtml(md)
    expect(html).toContain('<h1>Title</h1>')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<li>list item</li>')
    expect(html).toContain('<blockquote>')
  })
})
