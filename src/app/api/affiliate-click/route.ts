import { NextRequest } from 'next/server'
import { isKnownSlot } from '@/lib/affiliate'
import {
  bumpIpQuota,
  currentDay,
  hashIp,
  recordClick,
} from '@/lib/affiliate-clicks'

// Same-site hosts are allowed to record clicks. localhost/127.0.0.1 keep
// local development (next dev / next start) working.
const ALLOWED_HOSTS = new Set([
  'china-autonews.de',
  'www.china-autonews.de',
  'localhost',
  '127.0.0.1',
])

const DAILY_IP_LIMIT = 30

function callerHost(req: NextRequest): string | null {
  const origin = req.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).hostname
    } catch {
      return null
    }
  }
  const referer = req.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).hostname
    } catch {
      return null
    }
  }
  return null
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const slot = (body as { slot?: unknown })?.slot

  // ① whitelist
  if (!isKnownSlot(slot)) {
    return new Response(null, { status: 400 })
  }

  // ② same-site origin/referer
  const host = callerHost(req)
  if (!host || !ALLOWED_HOSTS.has(host)) {
    return new Response(null, { status: 403 })
  }

  const day = currentDay()
  const ipHash = hashIp(clientIp(req))

  try {
    // ③ per-IP daily quota — over limit: 204 but do NOT record
    const allowed = await bumpIpQuota(ipHash, day, DAILY_IP_LIMIT)
    if (!allowed) {
      // Visible in the function log: distinguishes "quota dropped it" from
      // "the visitor never clicked".
      console.warn('[affiliate-click] quota exceeded', slot, day)
      return new Response(null, { status: 204 })
    }

    // ④ record
    await recordClick(slot as string, day)
  } catch (error) {
    // KV failure must never surface as 500 — but it must not be invisible
    // either: without this log a lost click looks identical to a click that
    // never happened (measured 4 of 7 requests lost on 2026-10-13).
    console.error(
      '[affiliate-click] record failed',
      slot,
      day,
      error instanceof Error ? error.message : String(error)
    )
    return new Response(null, { status: 204 })
  }

  return new Response(null, { status: 204 })
}
