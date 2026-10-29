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

/** Hosts whose pages may legitimately link to the hop. */
const OWN_HOSTS = new Set(['china-autonews.de', 'www.china-autonews.de'])

function isOwnReferer(referer: string | null): boolean {
  if (!referer) return false
  try {
    const { hostname } = new URL(referer)
    return OWN_HOSTS.has(hostname) || hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    // Unparseable Referer is a forgery signal, not a visitor.
    return false
  }
}

/**
 * Only a real browser top-level navigation counts as a click.
 *
 * A human click sends all three Sec-Fetch headers: `mode: navigate`,
 * `dest: document`, `site: same-origin` (from our own article page; `same-site`
 * covers a www./subdomain variant, `cross-site` a share link from elsewhere).
 *
 * Requests with no Sec-Fetch-* headers are NOT counted — the exact opposite of
 * the rule this file shipped with, which counted them "so we do not lose older
 * clients". Measured 2026-10-28, the first day this route counted: 41 counted
 * clicks (dashcam 13 / laden 17 / reifen 11) against 96 visitors / 158 page
 * views from Vercel Analytics — 26 % of page views "clicking" an affiliate
 * link, which no human population does. The beacon this route replaced saw
 * 0–2/day over the same traffic because crawlers do not run JS. (The three
 * slots being within 1.5× of each other is consistent with a crawler following
 * every link, but is NOT proof: the position pattern alone also fits humans —
 * the magnitude is the argument.) The old comment's premise was wrong: a
 * client sending no Sec-Fetch-* headers is overwhelmingly a bot, and the few
 * real ones (WebKit before 16.4, i.e. before March 2023) are worth less than
 * inflated numbers that cannot serve as a denominator.
 *
 * `site: none` is excluded too: it marks a URL typed/bookmarked directly — and
 * it is what Googlebot sends when it crawls the redirect URL. A forged triple
 * (`navigate` + `document` + `cross-site`) is still possible; that is a
 * targeted attack, not a crawler, and is left to the per-IP quota.
 *
 * Judging only ever affects counting: the caller redirects no matter what.
 */
function isBrowserNavigation(req: NextRequest): boolean {
  const mode = req.headers.get('sec-fetch-mode')
  const dest = req.headers.get('sec-fetch-dest')
  if (mode !== 'navigate' || dest !== 'document') return false

  const site = req.headers.get('sec-fetch-site')
  if (site === 'same-origin' || site === 'same-site' || site === 'cross-site') {
    return true
  }
  // Fallback for a client that sends mode/dest but no site (some privacy
  // setups). Limited: AffiliateBox links carry rel="noreferrer", so this path
  // can only ever rescue a markdown link click. Do not treat it as a second
  // line of defence — if all three headers are missing we return false above.
  return isOwnReferer(req.headers.get('referer'))
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slot } = await params
  const target = resolveAffiliateRedirect(slot)

  // Unknown slot: 404, never a redirect (no open redirect via crafted paths).
  if (!target) {
    return new NextResponse(null, { status: 404 })
  }

  if (isBrowserNavigation(req)) {
    const day = currentDay()
    let finished = false
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
            finished = true
            return
          }
          await recordClick(slot, day)
          finished = true
        })(),
        new Promise((resolve) =>
          setTimeout(() => {
            // A slow KV and a traffic dip must not look alike in the ledger.
            if (!finished) {
              console.warn('[affiliate-redirect] count timeout', slot, day)
            }
            resolve(undefined)
          }, COUNT_TIMEOUT_MS)
        ),
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
