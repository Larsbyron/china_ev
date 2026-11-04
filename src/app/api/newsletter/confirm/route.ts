import { NextRequest, NextResponse } from 'next/server'
import { consumeConfirmationToken } from '@/lib/newsletter'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://china-autonews.de').replace(/\/+$/, '')

function redirectTo(status: string): NextResponse {
  return NextResponse.redirect(`${SITE_URL}/newsletter/bestaetigt/?status=${status}`, 303)
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''

  const email = await consumeConfirmationToken(token).catch(() => null)
  if (!email) return redirectTo('invalid')

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    console.error('[newsletter] Resend env missing on confirm')
    return redirectTo('error')
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    })

    // 409 = contact already exists; that is a successful confirmation for us.
    if (!res.ok && res.status !== 409) {
      const detail = await res.text().catch(() => '')
      console.error('[newsletter] contact create failed', res.status, detail.slice(0, 300))
      return redirectTo('error')
    }
  } catch (error) {
    console.error('[newsletter] contact request failed', error)
    return redirectTo('error')
  }

  return redirectTo('ok')
}
