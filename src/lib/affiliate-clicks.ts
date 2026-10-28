import { createHash } from 'node:crypto'
import { kv } from '@vercel/kv'

/**
 * First-party affiliate click counter.
 *
 * Shares the same @vercel/kv (Hobby) database as reactions — every write is
 * therefore kept minimal and TTL-bounded (90 days). IP addresses are never
 * stored in cleartext: only a SHA-256 hash is used, and only for the daily
 * per-IP quota (abuse guard).
 */

const TTL_SECONDS = 90 * 24 * 60 * 60 // 90 days

function totalKey(slotId: string): string {
  return `affil:click:total:${slotId}`
}

function dayKey(day: string, slotId: string): string {
  return `affil:click:day:${day}:${slotId}`
}

function ipQuotaKey(ipHash: string, day: string): string {
  return `affil:ip:${ipHash}:${day}`
}

/** SHA-256 hex digest — we never persist the raw IP. */
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

/** Europe/Berlin calendar day as YYYY-MM-DD (matches site's local-day logic). */
export function currentDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(now)
}

/**
 * Increment both counters (total + per-day) and (re)set their TTL.
 *
 * Each write is retried once: a silent single-`incr` failure is invisible to
 * the caller (the API route always answers 204), and on 2026-10-13 four of
 * seven requests that reached the route left no counter behind — the loss was
 * only visible as `affil:ip:*` keys without matching `affil:click:*` keys.
 * Failures now rethrow so the route can log them instead of swallowing.
 */
export async function recordClick(slotId: string, day: string): Promise<void> {
  const total = totalKey(slotId)
  const perDay = dayKey(day, slotId)

  // Both counters are independent: run them concurrently so one click costs
  // three KV round-trips (ip quota + one pipeline) instead of four to five.
  await Promise.all([incrWithRetry(total), incrWithRetry(perDay)])
  // TTL is best-effort: a missing expire only extends retention, it never
  // loses a click, so it must not fail the whole record.
  await Promise.all([
    kv.expire(total, TTL_SECONDS).catch(() => {}),
    kv.expire(perDay, TTL_SECONDS).catch(() => {}),
  ])
}

async function incrWithRetry(key: string, attempts = 2): Promise<void> {
  await incrCountWithRetry(key, attempts)
}

/** Same retry policy, but returns the new counter value (needed for quotas). */
async function incrCountWithRetry(key: string, attempts = 2): Promise<number> {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await kv.incr(key)
    } catch (error) {
      lastError = error
      if (attempt + 1 < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 120))
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}

/**
 * Daily per-IP quota. Returns true when the click is within `limit`,
 * false when the visitor has exceeded it for the day. TTL is set on the
 * first hit of the day so the window stays a real day, not a sliding one.
 */
export async function bumpIpQuota(
  ipHash: string,
  day: string,
  limit: number
): Promise<boolean> {
  const key = ipQuotaKey(ipHash, day)
  const count = await incrCountWithRetry(key)
  if (count === 1) {
    // best-effort: a missing TTL only keeps the key longer
    await kv.expire(key, TTL_SECONDS).catch(() => {})
  }
  return count <= limit
}
