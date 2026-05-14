// tweet-throttle.ts
//
// Pure helpers for the tweet drip throttle. Extracted so they're testable
// without pulling in Twitter API client or filesystem.

export interface TweetLogEntry {
  slug: string
  // ISO timestamp; null for legacy entries migrated from old string[] log
  tweetedAt: string | null
}

export const MAX_TWEETS_PER_DAY = 10
export const MIN_INTERVAL_MS = 60 * 60 * 1000
// Tweets are throttled by the operator's local day (Germany) so the
// "10 per day" budget aligns with how a human reading the feed perceives it.
export const LOCAL_TIMEZONE = 'Europe/Berlin'

/**
 * Normalize a raw tweet-log payload into TweetLogEntry[].
 * Accepts:
 *   - new format: TweetLogEntry[]
 *   - legacy format: string[] of slugs (migrated with tweetedAt: null)
 */
export function normalizeTweetLog(raw: unknown): TweetLogEntry[] {
  if (!Array.isArray(raw)) return []
  if (raw.length === 0) return []
  if (typeof raw[0] === 'string') {
    return (raw as string[]).map((slug) => ({ slug, tweetedAt: null }))
  }
  return raw as TweetLogEntry[]
}

function localDateKey(d: Date, timezone: string): string {
  // en-CA gives YYYY-MM-DD which we want; en-US would give M/D/YYYY.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** Count tweets sent on `now`'s local day (LOCAL_TIMEZONE). */
export function tweetsToday(
  entries: readonly TweetLogEntry[],
  now: Date = new Date(),
  timezone: string = LOCAL_TIMEZONE,
): number {
  const todayKey = localDateKey(now, timezone)
  return entries.filter((e) => {
    if (!e.tweetedAt) return false
    return localDateKey(new Date(e.tweetedAt), timezone) === todayKey
  }).length
}

/** Most recent tweet timestamp as epoch ms, or null if no entry has one. */
export function lastTweetTime(entries: readonly TweetLogEntry[]): number | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    const t = entries[i].tweetedAt
    if (t) return new Date(t).getTime()
  }
  return null
}
