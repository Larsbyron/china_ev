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
  /** SERP snippet title (falls back to `label`). Optimised for click-through, not for layout. */
  seoTitle?: string
  /** SERP meta description (falls back to `description`). */
  seoDescription?: string
}

export const TOPICS: TopicMeta[] = [
  {
    slug: 'modelle-marktstarts',
    label: 'Modelle & Marktstarts',
    description: 'Neue Fahrzeugmodelle, Markteinführungen und Facelifts chinesischer Hersteller',
    seoTitle: 'Chinesische E-Autos: Modelle & Marktstarts 2026 – Preise, Termine',
    seoDescription:
      'Welche chinesischen E-Autos kommen 2026 nach Deutschland? Modelle, Preise in Euro, Reichweiten und Marktstart-Termine im Überblick.',
  },
  {
    slug: 'preise-rabatte-wettbewerb',
    label: 'Preise, Rabatte & Wettbewerb',
    description: 'Preiskämpfe, Rabattaktionen und Wettbewerbsdynamik im chinesischen EV-Markt',
    seoTitle: 'Preise & Rabatte: Chinesische E-Autos 2026 – was sie kosten',
    seoDescription:
      'Was chinesische E-Autos in China und in Europa kosten: konkrete Preise in Euro, Preissenkungen und Rabattschlachten im Überblick.',
  },
  {
    slug: 'markt-absatz-zulassungen',
    label: 'Markt, Absatz & Zulassungen',
    description: 'Verkaufszahlen, Marktanteile und Zulassungsstatistiken',
    seoTitle: 'Absatz & Zulassungen: Chinesische E-Autos 2026 im Markt',
    seoDescription:
      'Verkaufszahlen und Marktanteile chinesischer E-Auto-Hersteller: monatliche Absatzzahlen aus China, Zulassungen und Exporte im Vergleich.',
  },
  {
    slug: 'politik-zoelle-regulierung',
    label: 'Politik, Zölle & Regulierung',
    description: 'EU-Zölle, staatliche Förderung, Regulierung und geopolitische Entwicklungen',
    seoTitle: 'EU-Zölle & Regulierung: Chinesische E-Autos 2026',
    seoDescription:
      'EU-Strafzölle auf chinesische E-Autos, Förderpolitik und Regulierung: was die Beschlüsse für Preise und Marktstart in Deutschland bedeuten.',
  },
  {
    slug: 'batterie-laden-reichweite',
    label: 'Batterie, Laden & Reichweite',
    description: 'Batterietechnologie, Ladeinfrastruktur und Reichweitenentwicklung',
    seoTitle: 'Batterie, Laden & Reichweite chinesischer E-Autos',
    seoDescription:
      'Blade- und Shenxing-Akkus, Ladeleistung und Reichweite: technische Daten chinesischer E-Autos im Vergleich.',
  },
  {
    slug: 'software-assistenz-autonomes-fahren',
    label: 'Software, Assistenz & Autonomes Fahren',
    description: 'Fahrassistenzsysteme, autonomes Fahren und Software-Updates',
    seoTitle: 'Fahrassistenz & autonomes Fahren aus China 2026',
    seoDescription:
      'LiDAR, City-NOA und Software-Updates: wie weit Fahrassistenz und Robotaxis chinesischer Hersteller 2026 sind.',
  },
  {
    slug: 'industrie-produktion-lieferkette',
    label: 'Industrie, Produktion & Lieferkette',
    description: 'Produktionskapazitäten, Lieferketten und industrielle Entwicklungen',
    seoTitle: 'Produktion & Lieferkette: Chinas E-Auto-Industrie 2026',
    seoDescription:
      'Kapazitäten, Werke in Europa und Lieferketten der chinesischen E-Auto-Industrie – Entwicklungen und Engpässe im Überblick.',
  },
  {
    slug: 'unternehmen-finanzen-kooperationen',
    label: 'Unternehmen, Finanzen & Kooperationen',
    description: 'Unternehmensstrategien, Finanzergebnisse und Kooperationen',
    seoTitle: 'BYD, NIO, Xiaomi & Co.: Strategie und Zahlen 2026',
    seoDescription:
      'Quartalszahlen, Strategie und Partnerschaften von BYD, NIO, Xiaomi, Leapmotor und Co. – wer wächst, wer verliert.',
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
