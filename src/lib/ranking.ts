import { RANKING_WEIGHTS } from './ranking-config'
import type { ArticleMeta } from './articles'

interface ReactionTotals {
  get(slug: string): number | undefined
}

/**
 * Compute a relevance score for a single article.
 * Higher = more prominent on homepage.
 */
export function computeRelevanceScore(
  article: ArticleMeta,
  nowMs: number,
  reactions: ReactionTotals,
  brandSeenCount: Record<string, number>,
  topicSeenCount: Record<string, number>
): number {
  const W = RANKING_WEIGHTS

  // Market relevance base score
  let base = 0
  switch (article.marketRelevance) {
    case 'de_available':  base = W.germanyRelevance; break
    case 'eu_available':  base = W.euRelevance; break
    case 'eu_planned':    base = W.euPlanned; break
    case 'global_industry': base = W.globalIndustry; break
    default:              base = W.chinaOnly
  }

  // Freshness decay — e^(-lambda * ageDays)
  const ageDays = (nowMs - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24)
  const freshness = Math.exp(-W.freshnessLambda * ageDays)

  // Engagement (reactions) — low weight
  const reactionPoints = reactions.get(article.slug) ?? 0
  const engagementBonus = reactionPoints * W.reactionWeight

  // Diversity penalty — avoid same brand / topic flooding top
  let penalty = 0
  const brand = article.brand ?? (article.brands[0] ?? '')
  if (brand && (brandSeenCount[brand] ?? 0) >= W.overloadThreshold) {
    penalty += W.sameBrandOverloadPenalty
  }
  if (article.primaryTopic && (topicSeenCount[article.primaryTopic] ?? 0) >= W.overloadThreshold) {
    penalty += W.sameTopicOverloadPenalty
  }

  const score = (base + engagementBonus) * freshness - penalty
  return score
}

/**
 * Rank articles by relevance score.
 * Updates seen-counts in-place so diversity penalty accumulates correctly.
 */
export function rankArticles(
  articles: ArticleMeta[],
  reactions: ReactionTotals,
  limit?: number
): ArticleMeta[] {
  const now = Date.now()
  const brandSeen: Record<string, number> = {}
  const topicSeen: Record<string, number> = {}

  const scored = articles.map((article) => ({
    article,
    score: computeRelevanceScore(article, now, reactions, brandSeen, topicSeen),
  }))

  // Sort descending
  scored.sort((a, b) => b.score - a.score)

  // Apply diversity tracking after sort to enforce penalty for real result order
  const result: ArticleMeta[] = []
  for (const { article } of scored) {
    result.push(article)
    const brand = article.brand ?? (article.brands[0] ?? '')
    if (brand) brandSeen[brand] = (brandSeen[brand] ?? 0) + 1
    if (article.primaryTopic) topicSeen[article.primaryTopic] = (topicSeen[article.primaryTopic] ?? 0) + 1
    if (limit && result.length >= limit) break
  }

  return result
}

/**
 * Rank articles — synchronous fallback without reactions (reactions = all 0).
 * Used for SSG paths where KV isn't available.
 */
export function rankArticlesSync(articles: ArticleMeta[], limit?: number): ArticleMeta[] {
  const noReactions: ReactionTotals = { get: () => 0 }
  return rankArticles(articles, noReactions, limit)
}
