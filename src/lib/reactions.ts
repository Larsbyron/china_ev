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
