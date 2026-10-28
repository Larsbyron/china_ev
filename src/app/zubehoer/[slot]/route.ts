import { NextRequest, NextResponse } from 'next/server'
import { resolveAffiliateRedirect } from '@/lib/affiliate'
import {
  bumpIpQuota,
  currentDay,
  hashIp,
  recordClick,
} from '@/lib/affiliate-clicks'

/**
 * Server-side affiliate hop: counts the click, then redirects to Amazon.
 *
 * Why this exists (measured 2026-10-20): the client-side beacon in
 * AffiliateBox only ran after React hydration and not at all with JS
 * disabled, so Amazon reported more clicks than our counter ever saw
 * (13 PartnerNet clicks vs 7 requests that reached the API). Counting here
 * removes hydration timing, JS-off visitors and the preview-domain origin
 * check from the failure list, because the browser has to hit this URL
 * before it can reach Amazon.
 *
 * Counting must never delay or block the redirect — a slow KV must not cost
 * the visitor the click (and us the commission).
 */

interface RouteParams {
  params: Promise<{ slot: string }>
}

const DAILY_IP_LIMIT = 30

/** Upper bound for the whole KV block; the redirect goes out regardless. */
const COUNT_TIMEOUT_MS = 800

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}

/**
 * Only real navigations count. `Sec-Fetch-Dest` is sent by every current
 * browser: a click on our link is `document`, while `<img src="/zubehoer/x/">`
 * (third-party inflation) is `image`. Requests without the header (older
 * clients, curl) are counted so we do not lose real visitors.
 */
function isNavigationRequest(req: NextRequest): boolean {
  const dest = req.headers.get('sec-fetch-dest')
  return !dest || dest === 'document'
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slot } = await params
  const target = resolveAffiliateRedirect(slot)

  // Unknown slot: 404, never a redirect (no open redirect via crafted paths).
  if (!target) {
    return new NextResponse(null, { status: 404 })
  }

  if (isNavigationRequest(req)) {
    const day = currentDay()
    try {
      await Promise.race([
        (async () => {
          const allowed = await bumpIpQuota(
            hashIp(clientIp(req)),
            day,
            DAILY_IP_LIMIT
          )
          if (!allowed) {
            // Visible in the function log: distinguishes "quota dropped it"
            // from "the visitor never clicked".
            console.warn('[affiliate-redirect] quota exceeded', slot, day)
            return
          }
          await recordClick(slot, day)
        })(),
        new Promise((resolve) => setTimeout(resolve, COUNT_TIMEOUT_MS)),
      ])
    } catch (error) {
      // A KV problem must never cost the visitor the click (or the
      // commission). It must not be invisible either — same rule as the
      // former API route.
      console.error(
        '[affiliate-redirect] record failed',
        slot,
        day,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: target,
      // Never cache: each request is a counted click.
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
