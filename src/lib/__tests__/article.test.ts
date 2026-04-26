import { describe, it, expect } from 'vitest'
import {
  generateSlug,
  estimateReadTime,
  toISODateString,
  extractTextFromHtml,
  truncateText,
} from '../article'

describe('article utilities', () => {
  describe('generateSlug', () => {
    it('generates slug with source key and hash suffix', () => {
      const slug = generateSlug('BYD launches new EV', 'sina')
      expect(slug).toMatch(/^byd-launches-new-ev-sina-[a-f0-9]{6}$/)
    })

    it('handles Chinese characters', () => {
      const slug = generateSlug('比亚迪发布新车型', 'autohome')
      expect(slug).toMatch(/比亚迪发布新车型-autohome-/)
    })

    it('truncates long titles to 50 chars', () => {
      const longTitle = 'A'.repeat(100)
      const slug = generateSlug(longTitle, 'sina')
      const slugPart = slug.replace(/-sina-[a-f0-9]{6}$/, '')
      expect(slugPart.length).toBeLessThanOrEqual(50)
    })

    it('replaces spaces with hyphens', () => {
      const slug = generateSlug('Hello World Test', 'sina')
      expect(slug).toMatch(/^hello-world-test-sina-/)
    })

    it('removes special characters', () => {
      const slug = generateSlug('BYD @ EV #2024!', 'sina')
      expect(slug).toMatch(/^byd-ev-2024-sina-/)
    })
  })

  describe('estimateReadTime', () => {
    it('returns 1 for short content', () => {
      expect(estimateReadTime('Hello')).toBe(1)
    })

    it('calculates read time for English text', () => {
      const words = Array(400).fill('word').join(' ')
      expect(estimateReadTime(words)).toBe(2)
    })

    it('counts Chinese characters as words', () => {
      const chinese = '比亚迪'.repeat(200) // 600 chars + 1 word = 601 units → ceil(601/200) = 4
      expect(estimateReadTime(chinese)).toBe(4)
    })

    it('handles mixed Chinese and English', () => {
      const mixed = '比亚迪 ' + Array(200).fill('word').join(' ')
      expect(estimateReadTime(mixed)).toBe(2)
    })

    it('returns at least 1', () => {
      expect(estimateReadTime('')).toBe(1)
    })
  })

  describe('toISODateString', () => {
    it('converts Date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z')
      expect(toISODateString(date)).toBe('2024-01-15T10:30:00.000Z')
    })

    it('preserves timezone info', () => {
      const date = new Date('2024-06-01T00:00:00.000Z')
      expect(toISODateString(date)).toMatch(/2024-06-01/)
    })
  })

  describe('extractTextFromHtml', () => {
    it('strips HTML tags', () => {
      expect(extractTextFromHtml('<p>Hello</p>')).toBe('Hello')
    })

    it('decodes HTML entities', () => {
      expect(extractTextFromHtml('&amp; &lt; &gt; &quot; &#39;')).toBe("& < > \" '")
    })

    it('collapses whitespace', () => {
      expect(extractTextFromHtml('  hello   world  ')).toBe('hello world')
    })

    it('handles nested tags', () => {
      expect(extractTextFromHtml('<div><span>Hello</span> <b>World</b></div>')).toBe('Hello World')
    })

    it('handles empty input', () => {
      expect(extractTextFromHtml('')).toBe('')
    })

    it('handles nbsp entities', () => {
      expect(extractTextFromHtml('hello&nbsp;world')).toBe('hello world')
    })
  })

  describe('truncateText', () => {
    it('returns original text if within limit', () => {
      expect(truncateText('short', 10)).toBe('short')
    })

    it('truncates with ellipsis', () => {
      expect(truncateText('Hello World!', 8)).toBe('Hello...')
    })

    it('handles exact length', () => {
      expect(truncateText('12345', 5)).toBe('12345')
    })
  })
})
