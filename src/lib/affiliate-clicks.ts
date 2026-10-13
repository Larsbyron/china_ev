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

/** Increment both counters (total + per-day) and (re)set their TTL. */
export async function recordClick(slotId: string, day: string): Promise<void> {
  const total = totalKey(slotId)
  const perDay = dayKey(day, slotId)

  await kv.incr(total)
  await kv.expire(total, TTL_SECONDS)
  await kv.incr(perDay)
  await kv.expire(perDay, TTL_SECONDS)
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
  const count = await kv.incr(key)
  if (count === 1) {
    await kv.expire(key, TTL_SECONDS)
  }
  return count <= limit
}
