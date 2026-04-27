import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Ungueltige E-Mail-Adresse'),
})

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: 'Newsletter-Dienst ist nicht konfiguriert.' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Ungueltige Anfrage.' },
      { status: 400 }
    )
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Ungueltige E-Mail-Adresse.' },
      { status: 400 }
    )
  }

  const { email } = parsed.data

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    )

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message =
        (errorBody as { message?: string } | null)?.message ??
        'Fehler beim Anmelden.'

      if (res.status === 409) {
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse ist bereits angemeldet.' },
          { status: 409 }
        )
      }

      return NextResponse.json({ error: message }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Netzwerkfehler. Bitte versuche es spaeter erneut.' },
      { status: 500 }
    )
  }
}
