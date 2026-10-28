import { describe, expect, test } from 'vitest'
import {
  AMAZON_STORE_ID,
  AFFILIATE_SLOTS,
  affiliateRedirectPath,
  buildAffiliateUrl,
  isKnownSlot,
  resolveAffiliateRedirect,
} from '../affiliate'

describe('AFFILIATE_SLOTS', () => {
  test('has exactly 3 slots', () => {
    expect(AFFILIATE_SLOTS).toHaveLength(3)
  })

  test('slot ids are unique', () => {
    const ids = AFFILIATE_SLOTS.map((slot) => slot.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('buildAffiliateUrl', () => {
  test('contains k, tag and ascsubtag params', () => {
    for (const slot of AFFILIATE_SLOTS) {
      const url = buildAffiliateUrl(slot)
      expect(url).toContain('https://www.amazon.de/s?k=')
      expect(url).toContain('tag=byronbai-21')
      expect(url).toContain(`ascsubtag=cev-zubehoer-${slot.id}`)
    }
  })

  test('tag is always AMAZON_STORE_ID and params round-trip', () => {
    expect(AMAZON_STORE_ID).toBe('byronbai-21')
    for (const slot of AFFILIATE_SLOTS) {
      const parsed = new URL(buildAffiliateUrl(slot))
      expect(parsed.hostname).toBe('www.amazon.de')
      expect(parsed.searchParams.get('k')).toBe(slot.query)
      expect(parsed.searchParams.get('tag')).toBe(AMAZON_STORE_ID)
      expect(parsed.searchParams.get('ascsubtag')).toBe(
        `cev-zubehoer-${slot.id}`
      )
    }
  })
})

describe('isKnownSlot', () => {
  test('true for every configured slot id', () => {
    for (const slot of AFFILIATE_SLOTS) {
      expect(isKnownSlot(slot.id)).toBe(true)
    }
  })

  test('false for unknown and non-string input', () => {
    expect(isKnownSlot('does-not-exist')).toBe(false)
    expect(isKnownSlot('')).toBe(false)
    expect(isKnownSlot(null)).toBe(false)
    expect(isKnownSlot(undefined)).toBe(false)
    expect(isKnownSlot(42)).toBe(false)
    expect(isKnownSlot({})).toBe(false)
  })
})

describe('affiliateRedirectPath', () => {
  test('is a same-site path with trailing slash (trailingSlash: true)', () => {
    for (const slot of AFFILIATE_SLOTS) {
      const path = affiliateRedirectPath(slot.id)
      expect(path).toBe(`/zubehoer/${slot.id}/`)
      expect(path.startsWith('/')).toBe(true)
      expect(path).not.toContain('http')
    }
  })

  test('does not use cloaking paths that filter lists block', () => {
    for (const slot of AFFILIATE_SLOTS) {
      const path = affiliateRedirectPath(slot.id)
      expect(path).not.toMatch(/^\/(go|out|ref|redirect|link)\//)
    }
  })
})

describe('resolveAffiliateRedirect', () => {
  test('resolves every configured slot to its Amazon URL', () => {
    for (const slot of AFFILIATE_SLOTS) {
      expect(resolveAffiliateRedirect(slot.id)).toBe(buildAffiliateUrl(slot))
    }
  })

  test('returns null for anything that is not a known slot id', () => {
    expect(resolveAffiliateRedirect('does-not-exist')).toBeNull()
    expect(resolveAffiliateRedirect('')).toBeNull()
    expect(resolveAffiliateRedirect(null)).toBeNull()
    expect(resolveAffiliateRedirect(undefined)).toBeNull()
    expect(resolveAffiliateRedirect(42)).toBeNull()
    expect(resolveAffiliateRedirect({ slot: 'laden' })).toBeNull()
  })

  test('cannot be used as an open redirect (host stays amazon.de)', () => {
    // Path traversal / absolute URLs in the slot id must not resolve at all.
    for (const attack of [
      'https://evil.example',
      '//evil.example',
      '../laden',
      'laden/../../evil',
      'laden?tag=evil-21',
    ]) {
      expect(resolveAffiliateRedirect(attack)).toBeNull()
    }
    for (const slot of AFFILIATE_SLOTS) {
      const url = new URL(resolveAffiliateRedirect(slot.id) as string)
      expect(url.hostname).toBe('www.amazon.de')
      expect(url.searchParams.get('tag')).toBe(AMAZON_STORE_ID)
      expect(url.searchParams.get('ascsubtag')).toBe(`cev-zubehoer-${slot.id}`)
    }
  })
})
