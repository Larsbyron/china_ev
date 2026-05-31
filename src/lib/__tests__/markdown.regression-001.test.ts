import { describe, it, expect } from 'vitest'
import { markdownToHtml } from '../markdown'

// Regression: ISSUE-001 — undersized body images (logos, tiny square headshots)
// were upscaled to full column width by `.article-content img { width: 100% }`,
// producing huge blurry images. markdownToHtml must drop images below the
// content-photo size threshold (and portrait images), keeping only real
// landscape content photos.
// Found by /qa on 2026-05-31
// Report: .gstack/qa-reports/qa-report-china-autonews-de-2026-05-31.md
//
// Fixtures are real files in public/images with known dimensions:
//   ...-img2.webp = 800x450  (landscape content photo → kept)
//   ...-img3.webp = 100x100  (tiny square headshot     → dropped)
//   ...-img4.webp = 80x42    (tiny source logo         → dropped)
describe('markdownToHtml — non-content image removal (ISSUE-001)', () => {
  const base = '/images/byd-fahrassistenz-mit-vollkasko-fr-1500-ein-fnftel-carnewschina-53bf83'

  it('keeps content-sized landscape images and drops undersized ones', async () => {
    const md = [
      `![Bild](${base}-img2.webp)`,
      ``,
      `![Bild](${base}-img3.webp)`,
      ``,
      `![Bild](${base}-img4.webp)`,
    ].join('\n')

    const html = await markdownToHtml(md)

    expect(html).toContain(`${base}-img2.webp`) // 800x450 kept
    expect(html).not.toContain(`${base}-img3.webp`) // 100x100 dropped
    expect(html).not.toContain(`${base}-img4.webp`) // 80x42 dropped
  })

  it('leaves no empty paragraph behind after dropping an image', async () => {
    const md = `Text.\n\n![Bild](${base}-img3.webp)\n\nMore text.`
    const html = await markdownToHtml(md)
    expect(html).not.toMatch(/<p>\s*<\/p>/)
    expect(html).toContain('More text.')
  })
})
