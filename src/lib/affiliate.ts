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
