import { describe, it, expect } from 'vitest'
import { articleFrontmatterSchema } from '../schemas'

describe('articleFrontmatterSchema', () => {
  const validFrontmatter = {
    title: 'BYD launches new EV',
    date: '2024-01-15T10:00:00.000Z',
    description: 'BYD has launched a new electric vehicle',
    source: 'Sina',
    image: 'https://example.com/image.jpg',
    category: 'news',
    brand: 'BYD',
    tags: ['EV', 'BYD'],
    draft: false,
    original_url: 'https://example.com/article',
    read_time_minutes: 5,
  }

  it('accepts valid frontmatter', () => {
    const result = articleFrontmatterSchema.safeParse(validFrontmatter)
    expect(result.success).toBe(true)
  })

  it('transforms Date objects to ISO strings', () => {
    const withDate = { ...validFrontmatter, date: new Date('2024-01-15T10:00:00.000Z') }
    const result = articleFrontmatterSchema.safeParse(withDate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.data.date).toBe('string')
      expect(result.data.date).toContain('2024-01-15')
    }
  })

  it('rejects empty title', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty description', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, description: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid source', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, source: 'InvalidSource' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid sources', () => {
    for (const source of ['Autohome', 'Ifeng', 'Sina', 'PCauto']) {
      const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, source })
      expect(result.success).toBe(true)
    }
  })

  it('defaults category to news', () => {
    const { category, ...rest } = validFrontmatter
    const result = articleFrontmatterSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.category).toBe('news')
    }
  })

  it('defaults tags to empty array', () => {
    const { tags, ...rest } = validFrontmatter
    const result = articleFrontmatterSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toEqual([])
    }
  })

  it('defaults draft to false', () => {
    const { draft, ...rest } = validFrontmatter
    const result = articleFrontmatterSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.draft).toBe(false)
    }
  })

  it('rejects invalid image URL', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, image: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('accepts missing image', () => {
    const { image, ...rest } = validFrontmatter
    const result = articleFrontmatterSchema.safeParse(rest)
    expect(result.success).toBe(true)
  })

  it('rejects invalid original_url', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, original_url: 'bad' })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer read_time_minutes', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, read_time_minutes: 1.5 })
    expect(result.success).toBe(false)
  })

  it('rejects read_time_minutes less than 1', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, read_time_minutes: 0 })
    expect(result.success).toBe(false)
  })

  it('accepts weekly category', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, category: 'weekly' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid category', () => {
    const result = articleFrontmatterSchema.safeParse({ ...validFrontmatter, category: 'monthly' })
    expect(result.success).toBe(false)
  })
})
