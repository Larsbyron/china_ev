export type TopicSlug =
  | 'modelle-marktstarts'
  | 'preise-rabatte-wettbewerb'
  | 'markt-absatz-zulassungen'
  | 'politik-zoelle-regulierung'
  | 'batterie-laden-reichweite'
  | 'software-assistenz-autonomes-fahren'
  | 'industrie-produktion-lieferkette'
  | 'unternehmen-finanzen-kooperationen'

export type MarketRelevance =
  | 'de_available'
  | 'eu_available'
  | 'eu_planned'
  | 'china_only'
  | 'global_industry'

export interface TopicMeta {
  slug: TopicSlug
  label: string
  description: string
}

export const TOPICS: TopicMeta[] = [
  {
    slug: 'modelle-marktstarts',
    label: 'Modelle & Marktstarts',
    description: 'Neue Fahrzeugmodelle, Markteinführungen und Facelifts chinesischer Hersteller',
  },
  {
    slug: 'preise-rabatte-wettbewerb',
    label: 'Preise, Rabatte & Wettbewerb',
    description: 'Preiskämpfe, Rabattaktionen und Wettbewerbsdynamik im chinesischen EV-Markt',
  },
  {
    slug: 'markt-absatz-zulassungen',
    label: 'Markt, Absatz & Zulassungen',
    description: 'Verkaufszahlen, Marktanteile und Zulassungsstatistiken',
  },
  {
    slug: 'politik-zoelle-regulierung',
    label: 'Politik, Zölle & Regulierung',
    description: 'EU-Zölle, staatliche Förderung, Regulierung und geopolitische Entwicklungen',
  },
  {
    slug: 'batterie-laden-reichweite',
    label: 'Batterie, Laden & Reichweite',
    description: 'Batterietechnologie, Ladeinfrastruktur und Reichweitenentwicklung',
  },
  {
    slug: 'software-assistenz-autonomes-fahren',
    label: 'Software, Assistenz & Autonomes Fahren',
    description: 'Fahrassistenzsysteme, autonomes Fahren und Software-Updates',
  },
  {
    slug: 'industrie-produktion-lieferkette',
    label: 'Industrie, Produktion & Lieferkette',
    description: 'Produktionskapazitäten, Lieferketten und industrielle Entwicklungen',
  },
  {
    slug: 'unternehmen-finanzen-kooperationen',
    label: 'Unternehmen, Finanzen & Kooperationen',
    description: 'Unternehmensstrategien, Finanzergebnisse und Kooperationen',
  },
]

export const TOPIC_BY_SLUG: Record<TopicSlug, TopicMeta> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
) as Record<TopicSlug, TopicMeta>

export const MARKET_RELEVANCE_LABELS: Record<MarketRelevance, string> = {
  de_available: 'In Deutschland',
  eu_available: 'In Europa',
  eu_planned: 'Für Europa geplant',
  china_only: 'Nur China',
  global_industry: 'Global / Industrie',
}

export function isValidTopicSlug(slug: string): slug is TopicSlug {
  return slug in TOPIC_BY_SLUG
}

export function isValidMarketRelevance(value: string): value is MarketRelevance {
  return value in MARKET_RELEVANCE_LABELS
}
