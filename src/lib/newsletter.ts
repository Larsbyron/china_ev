import { randomBytes } from 'node:crypto'
import { kv } from '@vercel/kv'

/**
 * Newsletter double opt-in helpers.
 *
 * Germany requires a confirmed opt-in (BGH: a single opt-in does not prove
 * consent). The pending address is stored in KV under an unguessable token
 * for 48 hours; confirming the link adds the address to the Resend audience.
 */

const PENDING_TTL_SECONDS = 48 * 60 * 60
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  if (email.length < 6 || email.length > 254) return null
  if (!EMAIL_RE.test(email)) return null
  if (email.includes('..')) return null
  return email
}

export function pendingKey(token: string): string {
  return `newsletter:pending:${token}`
}

export function ipQuotaKey(ipHash: string, day: string): string {
  return `newsletter:ip:${ipHash}:${day}`
}

export async function createConfirmationToken(email: string): Promise<string> {
  const token = randomBytes(24).toString('hex')
  await kv.set(pendingKey(token), email, { ex: PENDING_TTL_SECONDS })
  return token
}

/** Reads and deletes the token; a second click cannot re-submit the address. */
export async function consumeConfirmationToken(token: string): Promise<string | null> {
  if (!/^[a-f0-9]{48}$/.test(token)) return null
  const email = await kv.get<string>(pendingKey(token))
  if (!email) return null
  await kv.del(pendingKey(token))
  return email
}

export function confirmationEmailHtml(confirmUrl: string): string {
  return `<!doctype html>
<html lang="de"><body style="margin:0;padding:24px;background:#f5f6f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1b2430">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px">
    <tr><td style="padding:28px 28px 8px">
      <p style="margin:0;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#e63946;font-weight:700">E-AUTOS</p>
      <h1 style="margin:10px 0 12px;font-size:22px;line-height:1.3">Bitte bestätigen Sie Ihre Anmeldung</h1>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6">
        Sie haben den Newsletter von china-autonews.de abonniert. Bitte bestätigen Sie die Anmeldung mit einem Klick.
        Ohne Bestätigung erhalten Sie keine E-Mails.
      </p>
      <p style="margin:0 0 22px">
        <a href="${confirmUrl}" style="display:inline-block;background:#e63946;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:6px">Anmeldung bestätigen</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5a6b7d">
        Der Link ist 48 Stunden gültig. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach –
        es werden keine Daten gespeichert.
      </p>
    </td></tr>
    <tr><td style="padding:16px 28px 26px;border-top:1px solid #eef1f4">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#8a99a8">
        E-AUTOS · china-autonews.de · Verantwortlich: Loghan GmbH<br>
        <a href="https://china-autonews.de/datenschutz/" style="color:#8a99a8">Datenschutz</a> ·
        <a href="https://china-autonews.de/impressum/" style="color:#8a99a8">Impressum</a>
      </p>
    </td></tr>
  </table>
</body></html>`
}
