import { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'
import { currentDay, hashIp } from '@/lib/affiliate-clicks'
import {
  confirmationEmailHtml,
  createConfirmationToken,
  ipQuotaKey,
  normalizeEmail,
} from '@/lib/newsletter'

const DAILY_IP_LIMIT = 8
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://china-autonews.de').replace(/\/+$/, '')
// The sending domain must be verified in Resend. china-autonews.de is not yet
// verified (DNS lives at Strato); until then we send from the verified
// cura-studio.de domain. Switch with NEWSLETTER_FROM once DNS is added.
const FROM = process.env.NEWSLETTER_FROM ?? 'E-AUTOS <newsletter@cura-studio.de>'

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = normalizeEmail((body as { email?: unknown })?.email)
  if (!email) {
    return json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, 400)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[newsletter] RESEND_API_KEY missing')
    return json({ error: 'Newsletter ist derzeit nicht verfügbar.' }, 503)
  }

  // Per-IP quota: the form has no captcha, so a single visit must not be able
  // to queue hundreds of confirmation mails.
  try {
    const quotaKey = ipQuotaKey(hashIp(clientIp(req)), currentDay())
    const count = await kv.incr(quotaKey)
    if (count === 1) await kv.expire(quotaKey, 24 * 60 * 60)
    if (count > DAILY_IP_LIMIT) {
      return json({ error: 'Zu viele Anmeldungen. Bitte später erneut versuchen.' }, 429)
    }
  } catch (error) {
    // A KV hiccup must not block sign-ups; the confirmation step still guards.
    console.error('[newsletter] quota check failed', error)
  }

  let token: string
  try {
    token = await createConfirmationToken(email)
  } catch (error) {
    console.error('[newsletter] token write failed', error)
    return json({ error: 'Anmeldung fehlgeschlagen. Bitte später erneut versuchen.' }, 500)
  }

  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: email,
        subject: 'Bitte bestätigen: E-AUTOS Newsletter',
        html: confirmationEmailHtml(confirmUrl),
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[newsletter] resend rejected', res.status, detail.slice(0, 300))
      return json({ error: 'Bestätigungsmail konnte nicht gesendet werden.' }, 502)
    }
  } catch (error) {
    console.error('[newsletter] resend request failed', error)
    return json({ error: 'Bestätigungsmail konnte nicht gesendet werden.' }, 502)
  }

  return json({ ok: true })
}
