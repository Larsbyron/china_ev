/**
 * Amazon.de affiliate ("Zubehör") slots.
 *
 * Only search-result links are used — no fabricated ASINs or product links.
 * The store id is the tracking tag; ascsubtag carries per-slot attribution
 * for Amazon Associates reporting.
 */

export const AMAZON_STORE_ID = 'byronbai-21'

export interface AffiliateSlot {
  id: string
  label: string
  query: string
}

// Exactly three slots: charging / dashcam / tyres — the box is fixed-size.
export const AFFILIATE_SLOTS: AffiliateSlot[] = [
  { id: 'laden', label: 'Ladekabel & Wallbox-Zubehör', query: 'ladekabel typ 2 elektroauto' },
  { id: 'dashcam', label: 'Dashcams fürs Auto', query: 'dashcam auto' },
  { id: 'reifen', label: 'Reifen & Räder', query: 'autoreifen günstig' },
]

export function buildAffiliateUrl(slot: AffiliateSlot): string {
  return `https://www.amazon.de/s?k=${encodeURIComponent(slot.query)}&tag=${AMAZON_STORE_ID}&ascsubtag=cev-zubehoer-${slot.id}`
}

export function isKnownSlot(id: unknown): boolean {
  return (
    typeof id === 'string' && AFFILIATE_SLOTS.some((slot) => slot.id === id)
  )
}

export function slotById(id: string): AffiliateSlot | undefined {
  return AFFILIATE_SLOTS.find((slot) => slot.id === id)
}

/**
 * Same-site hop used in article HTML instead of the raw Amazon URL.
 *
 * Reason (measured 2026-10-20): the client-side `fetch` beacon only fires after
 * hydration and never fires for JS-disabled visitors, so Amazon counted clicks
 * that our own counter never saw. A server-side redirect counts every click
 * that is actually followed — and it keeps working when an ad blocker hides
 * the beacon.
 *
 * The path is deliberately descriptive (`/zubehoer/<slot>`) instead of the
 * usual `/go/` or `/out/` cloaking paths, which common filter lists block.
 */
export function affiliateRedirectPath(slotId: string): string {
  return `/zubehoer/${slotId}/`
}

/**
 * Resolves the redirect target for a slot id.
 * Returns null for unknown/unsafe ids — the caller must answer 404, never a
 * redirect, so a crafted path can never become an open redirect.
 */
export function resolveAffiliateRedirect(id: unknown): string | null {
  if (!isKnownSlot(id)) return null
  const slot = slotById(id as string)
  if (!slot) return null
  return buildAffiliateUrl(slot)
}
