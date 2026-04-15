import { describe, it, expect } from 'vitest'
import { normalizeForHash, computeFingerprint } from '../scraper/dedup'

describe('Deduplication', () => {
  describe('normalizeForHash', () => {
    it('strips HTML tags', () => {
      expect(normalizeForHash('<p>Hello</p>')).toBe('hello')
      expect(normalizeForHash('<div><span>World</span></div>')).toBe('world')
      // Note: script tag content is NOT stripped, only the tags themselves
      // This is a known limitation of the regex-based approach
      expect(normalizeForHash('<script>alert("xss")</script>Hello')).toBe('alert("xss")hello')
    })

    it('normalizes to lowercase', () => {
      expect(normalizeForHash('HELLO WORLD')).toBe('hello world')
      expect(normalizeForHash('HeLLo WoRLD')).toBe('hello world')
    })

    it('trims whitespace', () => {
      expect(normalizeForHash('  hello  ')).toBe('hello')
      expect(normalizeForHash('\n\thello\t\n')).toBe('hello')
    })

    it('collapses multiple whitespace characters', () => {
      expect(normalizeForHash('hello    world')).toBe('hello world')
      expect(normalizeForHash('hello\n\n\nworld')).toBe('hello world')
      expect(normalizeForHash('hello\t\t\tworld')).toBe('hello world')
    })

    it('handles mixed content', () => {
      expect(normalizeForHash('  <p>Hello</p>\n\nWorld  ')).toBe('hello world')
    })

    it('handles empty string', () => {
      expect(normalizeForHash('')).toBe('')
    })

    it('handles only HTML tags', () => {
      expect(normalizeForHash('<div><span><p></p></span></div>')).toBe('')
    })

    it('handles Unicode characters', () => {
      // Chinese characters should be preserved (not stripped by HTML regex)
      expect(normalizeForHash('比亚迪')).toBe('比亚迪')
      expect(normalizeForHash('蔚来汽车')).toBe('蔚来汽车')
    })
  })

  describe('computeFingerprint', () => {
    it('produces consistent SHA-256 hash for same input', () => {
      const text = 'Hello World'
      const hash1 = computeFingerprint(text)
      const hash2 = computeFingerprint(text)
      expect(hash1).toBe(hash2)
    })

    it('produces different hashes for different inputs', () => {
      const hash1 = computeFingerprint('Hello World')
      const hash2 = computeFingerprint('Hello World!')
      const hash3 = computeFingerprint('Goodbye World')
      expect(hash1).not.toBe(hash2)
      expect(hash1).not.toBe(hash3)
      expect(hash2).not.toBe(hash3)
    })

    it('produces 64-character hex string (SHA-256)', () => {
      const hash = computeFingerprint('test')
      expect(hash).toMatch(/^[a-f0-9]{64}$/)
    })

    it('is case insensitive after normalization', () => {
      const hash1 = computeFingerprint('BYD')
      const hash2 = computeFingerprint('byd')
      const hash3 = computeFingerprint('ByD')
      expect(hash1).toBe(hash2)
      expect(hash2).toBe(hash3)
    })

    it('ignores whitespace differences', () => {
      const hash1 = computeFingerprint('hello   world')
      const hash2 = computeFingerprint('hello world')
      const hash3 = computeFingerprint('hello\n\nworld')
      expect(hash1).toBe(hash2)
      expect(hash2).toBe(hash3)
    })

    it('produces different hashes for similar but different articles', () => {
      const hash1 = computeFingerprint('BYD launches new electric vehicle with 500km range')
      const hash2 = computeFingerprint('BYD launches new electric vehicle with 600km range')
      expect(hash1).not.toBe(hash2)
    })

    it('handles empty string', () => {
      const hash = computeFingerprint('')
      expect(hash).toMatch(/^[a-f0-9]{64}$/)
    })
  })

  describe('deduplication scenarios', () => {
    it('same article different formatting produces same fingerprint', () => {
      const article1 = `
        <div class="content">
          <h1>BYD News</h1>
          <p>BYD announced new electric vehicle today.</p>
        </div>
      `

      const article2 = `
<div class="content">
<h1>BYD News</h1>
<p>BYD announced new electric vehicle today.</p>
</div>
      `

      const hash1 = computeFingerprint(article1)
      const hash2 = computeFingerprint(article2)
      expect(hash1).toBe(hash2)
    })

    it('similar articles with different brand produce different fingerprints', () => {
      const hash1 = computeFingerprint('NIO launches new ES8 SUV')
      const hash2 = computeFingerprint('BYD launches new ES8 SUV')
      expect(hash1).not.toBe(hash2)
    })
  })
})
