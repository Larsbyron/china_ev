import { describe, it, expect, afterEach } from 'vitest'
import {
  DEFAULT_MAX_ARTICLES_PER_RUN,
  resolveMaxArticlesPerRun,
  createPublishQuota,
  tryAcquirePublishSlot,
  isQuotaExhausted,
} from '../scraper/publish-quota'

afterEach(() => {
  delete process.env.MAX_ARTICLES_PER_RUN
})

describe('publish-quota / resolveMaxArticlesPerRun', () => {
  it('defaults to 3 articles per run', () => {
    expect(DEFAULT_MAX_ARTICLES_PER_RUN).toBe(3)
    expect(resolveMaxArticlesPerRun()).toBe(3)
    expect(process.env.MAX_ARTICLES_PER_RUN).toBeUndefined()
  })

  it('reads the env var when set', () => {
    process.env.MAX_ARTICLES_PER_RUN = '5'
    expect(resolveMaxArticlesPerRun()).toBe(5)
    expect(resolveMaxArticlesPerRun('7')).toBe(7)
  })

  it('falls back to the default on invalid values (0 must not mean unlimited)', () => {
    for (const bad of ['0', '-4', 'abc', '', '   ']) {
      expect(resolveMaxArticlesPerRun(bad)).toBe(DEFAULT_MAX_ARTICLES_PER_RUN)
    }
    expect(resolveMaxArticlesPerRun('3.9')).toBe(3)
  })
})

describe('publish-quota / slots', () => {
  it('allows exactly `limit` acquisitions, then blocks', () => {
    const quota = createPublishQuota(3)
    expect(tryAcquirePublishSlot(quota)).toBe(true)
    expect(tryAcquirePublishSlot(quota)).toBe(true)
    expect(tryAcquirePublishSlot(quota)).toBe(true)
    expect(isQuotaExhausted(quota)).toBe(true)
    expect(tryAcquirePublishSlot(quota)).toBe(false)
    expect(quota.used).toBe(3)
    expect(quota.blocked).toBe(1)
  })

  it('counts blocked candidates so the run log can show how much was cut', () => {
    const quota = createPublishQuota(1)
    tryAcquirePublishSlot(quota)
    tryAcquirePublishSlot(quota)
    tryAcquirePublishSlot(quota)
    expect(quota.blocked).toBe(2)
  })

  it('never builds a zero or negative limit quota', () => {
    expect(createPublishQuota(0).limit).toBe(DEFAULT_MAX_ARTICLES_PER_RUN)
    expect(createPublishQuota(-2).limit).toBe(DEFAULT_MAX_ARTICLES_PER_RUN)
    expect(isQuotaExhausted(createPublishQuota(0))).toBe(false)
  })
})
