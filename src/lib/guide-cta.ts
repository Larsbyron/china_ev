import { ORIGINAL_SOURCE_NAME } from '@/lib/schemas'
import type { Article } from '@/lib/articles'
import type { TopicSlug } from '@/lib/topics'

export interface GuideCtaData {
  href: string
  title: string
  text: string
  linkLabel: string
}

/**
 * The import-cost guide — the site's only original money page. Its traffic comes
 * from internal links: before this module the whole site had one page linking to
 * it, so it never accumulated any.
 */
export const GUIDE_IMPORT: GuideCtaData = {
  href: '/articles/2026-10-23-was-kostet-der-china-auto-import-nach-deutschland/',
  title: 'Was ein China-E-Auto in Deutschland wirklich kostet',
  text: 'Zoll, Transport, Umrüstung, TÜV und Zulassung: die vollständige Rechnung mit allen Posten.',
  linkLabel: 'Kostenratgeber lesen',
}

/**
 * Only the two topics where total import cost is the reader's actual next
 * question: model launches ("what does it cost when it arrives?") and prices /
 * discounts ("is the list price even the price?"). Everything else — policy,
 * battery tech, company news — would get an off-topic link and dilute the
 * signal both for readers and for Google.
 *
 * Deliberately NOT the Wallbox/charging topic: those pages are part of a
 * pre-registered observation window (11–13) and injecting a CTA into them would
 * contaminate that measurement.
 */
const CTA_TOPICS: ReadonlySet<TopicSlug> = new Set<TopicSlug>([
  'modelle-marktstarts',
  'preise-rabatte-wettbewerb',
])

/**
 * Absolute paragraph position of the CTA in the article body, counted from the
 * top of the rendered HTML — i.e. one paragraph below the in-article ad unit
 * (which sits after paragraph 2). The page subtracts the paragraphs the ad
 * already consumed when it splits the post-ad remainder.
 */
export const GUIDE_CTA_CUT_AFTER = 3

/**
 * Which articles get the contextual guide CTA.
 *
 * Returns null for:
 *  - our own articles (a guide linking to a guide reads like a sales funnel),
 *  - topics where import cost is not the reader's next question,
 *  - the guide itself (defensive self-link guard).
 */
export function guideForArticle(
  a: Pick<Article, 'slug' | 'source' | 'primaryTopic'>,
): GuideCtaData | null {
  if (a.source === ORIGINAL_SOURCE_NAME) return null
  if (!a.primaryTopic || !CTA_TOPICS.has(a.primaryTopic)) return null
  if (GUIDE_IMPORT.href === `/articles/${a.slug}/`) return null
  return GUIDE_IMPORT
}
