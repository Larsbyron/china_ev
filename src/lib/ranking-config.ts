// Relevance ranking weights — hardcoded constants per Eng-Review decision.
// Adjust these numbers to tune homepage ordering; do NOT make them data-driven.

export const RANKING_WEIGHTS = {
  // Market relevance bonus
  germanyRelevance: 40,    // de_available
  euRelevance: 25,         // eu_available
  euPlanned: 15,           // eu_planned
  chinaOnly: 0,            // china_only
  globalIndustry: 5,       // global_industry

  // Recency decay: score × e^(-lambda × ageDays)
  freshnessLambda: 0.07,   // half-life ≈ 10 days

  // Engagement (reactions) — low weight per CEO decision
  reactionWeight: 0.3,     // per reaction point

  // Diversity penalty: reduce score if same brand already in top-N
  sameBrandOverloadPenalty: 12,
  sameTopicOverloadPenalty: 6,
  overloadThreshold: 2,    // how many same-brand/topic before penalty kicks in
} as const

// Minimum articles before a topic shelf renders on the homepage
export const MIN_SHELF_ARTICLES = 3

// Number of articles per topic shelf on homepage
export const SHELF_ARTICLES_PER_TOPIC = 5

// Target total articles visible on homepage
export const HOMEPAGE_ARTICLE_TARGET = 50

// Deutschland shelf article count
export const DEUTSCHLAND_SHELF_COUNT = 6
