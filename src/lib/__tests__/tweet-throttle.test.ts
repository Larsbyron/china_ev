import { describe, expect, test } from 'vitest'
import {
  normalizeTweetLog,
  tweetsToday,
  lastTweetTime,
  type TweetLogEntry,
} from '../tweet-throttle'

describe('normalizeTweetLog', () => {
  test('migrates legacy string[] format to entries with null tweetedAt', () => {
    const legacy = ['slug-a', 'slug-b']
    const result = normalizeTweetLog(legacy)
    expect(result).toEqual([
      { slug: 'slug-a', tweetedAt: null },
      { slug: 'slug-b', tweetedAt: null },
    ])
  })

  test('passes through new entries[] format unchanged', () => {
    const entries: TweetLogEntry[] = [
      { slug: 'slug-a', tweetedAt: '2026-05-14T10:00:00.000Z' },
    ]
    expect(normalizeTweetLog(entries)).toEqual(entries)
  })

  test('returns [] on empty array', () => {
    expect(normalizeTweetLog([])).toEqual([])
  })

  test('returns [] on non-array input', () => {
    expect(normalizeTweetLog(null)).toEqual([])
    expect(normalizeTweetLog({})).toEqual([])
    expect(normalizeTweetLog('garbage')).toEqual([])
  })
})

describe('tweetsToday (Europe/Berlin local day)', () => {
  test('ignores legacy entries with null tweetedAt', () => {
    const entries: TweetLogEntry[] = [
      { slug: 'old-1', tweetedAt: null },
      { slug: 'old-2', tweetedAt: null },
    ]
    const now = new Date('2026-05-14T12:00:00Z')
    expect(tweetsToday(entries, now)).toBe(0)
  })

  test('counts entries sent on the same local day', () => {
    // 2026-05-14T10:00:00Z is 2026-05-14 12:00 in Berlin (UTC+2 DST)
    const entries: TweetLogEntry[] = [
      { slug: 'a', tweetedAt: '2026-05-14T06:00:00.000Z' },
      { slug: 'b', tweetedAt: '2026-05-14T08:30:00.000Z' },
      { slug: 'c', tweetedAt: '2026-05-13T18:00:00.000Z' }, // yesterday
    ]
    const now = new Date('2026-05-14T10:00:00Z')
    expect(tweetsToday(entries, now)).toBe(2)
  })

  test('respects local-day boundary: 22:30 UTC on May 13 is May 14 in Berlin', () => {
    // 2026-05-13T22:30:00Z = 2026-05-14 00:30 in Berlin (UTC+2 DST)
    // So this tweet counts as "today" for an observer on May 14 in Berlin.
    const entries: TweetLogEntry[] = [
      { slug: 'late-night', tweetedAt: '2026-05-13T22:30:00.000Z' },
    ]
    const now = new Date('2026-05-14T08:00:00Z') // 10:00 Berlin May 14
    expect(tweetsToday(entries, now)).toBe(1)
  })

  test('honors explicit timezone override (UTC mode for sanity check)', () => {
    const entries: TweetLogEntry[] = [
      { slug: 'late-night', tweetedAt: '2026-05-13T22:30:00.000Z' },
    ]
    const now = new Date('2026-05-14T08:00:00Z')
    // In UTC the entry is on May 13, not today (May 14)
    expect(tweetsToday(entries, now, 'UTC')).toBe(0)
  })
})

describe('lastTweetTime', () => {
  test('returns null when no entry has tweetedAt', () => {
    expect(lastTweetTime([])).toBeNull()
    expect(
      lastTweetTime([{ slug: 'a', tweetedAt: null }]),
    ).toBeNull()
  })

  test('returns most recent tweetedAt epoch ms, skipping null legacy entries', () => {
    const entries: TweetLogEntry[] = [
      { slug: 'a', tweetedAt: null },
      { slug: 'b', tweetedAt: '2026-05-14T06:00:00.000Z' },
      { slug: 'c', tweetedAt: '2026-05-14T08:00:00.000Z' },
      { slug: 'd', tweetedAt: null }, // legacy entry after a real one — shouldn't shadow
    ]
    // Last non-null going from end backwards is 'c' at 08:00
    expect(lastTweetTime(entries)).toBe(
      new Date('2026-05-14T08:00:00.000Z').getTime(),
    )
  })
})
