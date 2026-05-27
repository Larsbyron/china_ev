import { NextRequest, NextResponse } from 'next/server'
import {
  getReactions,
  incrementReaction,
  REACTION_TYPES,
  type ReactionType,
} from '@/lib/reactions'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  try {
    const counts = await getReactions(slug)
    return NextResponse.json(counts)
  } catch {
    return NextResponse.json(
      { error: 'Failed to load reactions' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const body = await req.json().catch(() => ({}))
  const type = body?.type as ReactionType | undefined

  if (!type || !REACTION_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
  }

  try {
    const newCount = await incrementReaction(slug, type)
    return NextResponse.json({ type, count: newCount })
  } catch {
    return NextResponse.json(
      { error: 'Failed to save reaction' },
      { status: 500 }
    )
  }
}
