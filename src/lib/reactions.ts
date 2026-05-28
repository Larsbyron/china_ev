import { kv } from '@vercel/kv'

export type ReactionType = 'begeistert' | 'mehr_infos' | 'preis_leistung' | 'probefahrt'

export const REACTION_TYPES: ReactionType[] = [
  'begeistert',
  'mehr_infos',
  'preis_leistung',
  'probefahrt',
]

export interface ReactionCounts {
  begeistert: number
  mehr_infos: number
  preis_leistung: number
  probefahrt: number
}

function reactionKey(slug: string, type: ReactionType): string {
  return `reaction:${slug}:${type}`
}

export async function getReactions(slug: string): Promise<ReactionCounts> {
  const keys = REACTION_TYPES.map((t) => reactionKey(slug, t))
  const values = await kv.mget<number[]>(...keys)
  return {
    begeistert: values[0] ?? 0,
    mehr_infos: values[1] ?? 0,
    preis_leistung: values[2] ?? 0,
    probefahrt: values[3] ?? 0,
  }
}

export async function incrementReaction(
  slug: string,
  type: ReactionType
): Promise<number> {
  return kv.incr(reactionKey(slug, type))
}

/**
 * Batch-fetch total reaction count (sum of all 4 types) for many articles at once.
 * Returns a Map keyed by slug. Slugs with no reactions get 0.
 * On KV failure, returns an empty Map (caller can fall back to time-based ordering).
 */
export async function getReactionTotalsBySlug(
  slugs: string[]
): Promise<Map<string, number>> {
  const result = new Map<string, number>()
  if (slugs.length === 0) return result

  try {
    const keys = slugs.flatMap((slug) =>
      REACTION_TYPES.map((t) => reactionKey(slug, t))
    )
    const values = await kv.mget<(number | null)[]>(...keys)

    slugs.forEach((slug, i) => {
      const base = i * REACTION_TYPES.length
      const total = REACTION_TYPES.reduce(
        (sum, _, j) => sum + (values[base + j] ?? 0),
        0
      )
      result.set(slug, total)
    })
  } catch {
    // KV unavailable — caller falls back to time-based ordering
  }

  return result
}
