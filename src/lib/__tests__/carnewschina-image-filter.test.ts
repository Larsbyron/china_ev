import { describe, it, expect } from 'vitest'

// Replicate the filter logic from carnewschina.ts so we can unit-test it
// without importing the full scraper (which makes network calls).
const SKIP_IMAGE_PATTERNS = [
  'avatar', 'logo', 'icon', 'emoji', 'banner', '/ad/', '/ads/',
  'sponsor', 'pixel', 'track', 'beacon', 'analytics',
  'button', 'arrow', 'placeholder', 'blank', 'spacer', 'separator',
]

function isArticleImage(src: string): boolean {
  const lower = src.toLowerCase()
  return SKIP_IMAGE_PATTERNS.every((pat) => !lower.includes(pat))
}

describe('carnewschina isArticleImage filter', () => {
  it('accepts regular article images', () => {
    expect(isArticleImage('https://carnewschina.com/wp-content/uploads/2026/05/audi-e7x-front.jpg')).toBe(true)
    expect(isArticleImage('https://fly.imgix.net/images/car-photo-800x600.webp')).toBe(true)
  })

  it('rejects avatar images', () => {
    expect(isArticleImage('https://example.com/user-avatar.jpg')).toBe(false)
    expect(isArticleImage('https://cdn.site.com/Avatar_default.png')).toBe(false)
  })

  it('rejects logo images', () => {
    expect(isArticleImage('https://carnewschina.com/logo.png')).toBe(false)
    expect(isArticleImage('https://cdn.example.com/brand-Logo-small.svg')).toBe(false)
  })

  it('rejects icon images', () => {
    expect(isArticleImage('https://example.com/share-icon.png')).toBe(false)
    expect(isArticleImage('https://cdn.site.com/Icon_arrow.gif')).toBe(false)
  })

  it('rejects tracking pixels', () => {
    expect(isArticleImage('https://analytics.example.com/pixel?id=123')).toBe(false)
    expect(isArticleImage('https://t.co/track/visit.gif')).toBe(false)
    expect(isArticleImage('https://beacon.example.com/b.png')).toBe(false)
  })

  it('rejects ad images', () => {
    expect(isArticleImage('https://cdn.example.com/banner-728x90.jpg')).toBe(false)
    expect(isArticleImage('https://example.com/ads/creative.jpg')).toBe(false)
    expect(isArticleImage('https://example.com/ad/header.jpg')).toBe(false)
    expect(isArticleImage('https://example.com/sponsor-logo.png')).toBe(false)
  })

  it('rejects UI chrome images', () => {
    expect(isArticleImage('https://example.com/arrow-right.svg')).toBe(false)
    expect(isArticleImage('https://cdn.site.com/button-bg.png')).toBe(false)
    expect(isArticleImage('https://example.com/blank-placeholder.gif')).toBe(false)
  })
})
