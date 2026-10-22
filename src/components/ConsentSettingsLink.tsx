'use client'

import type { MouseEvent } from 'react'

type TcfData = {
  gdprApplies?: boolean
  cmpId?: number
}

type TcfApi = (
  command: string,
  version: number,
  callback: (data: TcfData | null, success: boolean) => void,
  parameter?: unknown
) => void

type GoogleFc = {
  callbackQueue?: { push: (item: Record<string, unknown>) => void }
  showRevocationMessage?: () => void
}

declare global {
  interface Window {
    googlefc?: GoogleFc
    __tcfapi?: TcfApi
  }
}

/** Where visitors without a consent UI of their own are sent. */
const FALLBACK_HREF = '/datenschutz/'

/** How long we wait for the CMP to answer at all. */
const WATCHDOG_MS = 4000

/** How long we wait for the consent dialog to actually become visible. */
const DIALOG_CHECK_MS = 1200

/** The Funding Choices message renders into this container. */
function consentDialogVisible(): boolean {
  if (typeof document === 'undefined') return false
  const root = document.querySelector('.fc-consent-root')
  if (!root) return false
  const rect = root.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

/**
 * Reopens the Google-certified consent message (Funding Choices / IAB TCF).
 *
 * Art. 7 (3) DSGVO requires withdrawing consent to be as easy as giving it, so
 * the footer keeps a permanent entry point. Three things that are easy to get
 * wrong here:
 *
 * 1. `showRevocationMessage()` is injected for *every* visitor, so calling it
 *    outside the EEA is a dead click. We ask `__tcfapi('ping')` for
 *    `gdprApplies` first and send non-EEA visitors to the privacy page.
 * 2. The Funding Choices queue is drained on `CONSENT_API_READY` (not
 *    `CONSENT_DATA_READY`), and it may never fire (blocker, script error).
 * 3. "No exception thrown" is not "dialog opened" — we check that the message
 *    container really became visible and fall back to the privacy page if not.
 *
 * The element is an `<a href="/datenschutz/">` so it still works without JS.
 */
export default function ConsentSettingsLink({ className }: { className?: string }) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Modifier and middle clicks belong to the browser (new tab / window).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    // Cancel navigation synchronously: the CMP answers asynchronously and a
    // preventDefault() issued from that callback would be too late. JS-less
    // visitors never reach this handler and keep the href fallback.
    event.preventDefault()

    let timer: number | undefined
    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
      }
    }
    const navigate = () => {
      clearTimer()
      window.location.href = FALLBACK_HREF
    }

    const openRevocationMessage = (): boolean => {
      const fc = window.googlefc
      if (!fc?.showRevocationMessage) return false
      try {
        fc.showRevocationMessage()
      } catch {
        return false
      }
      clearTimer()
      timer = window.setTimeout(() => {
        timer = undefined
        if (!consentDialogVisible()) navigate()
      }, DIALOG_CHECK_MS)
      return true
    }

    const tcf = window.__tcfapi
    if (typeof tcf === 'function') {
      // Ask the CMP whether consent is required for this visitor at all.
      let answered = false
      timer = window.setTimeout(() => {
        timer = undefined
        if (!answered) navigate()
      }, WATCHDOG_MS)
      tcf('ping', 2, (data) => {
        answered = true
        clearTimer()
        if (data?.gdprApplies) {
          if (!openRevocationMessage()) navigate()
        } else {
          navigate()
        }
      })
      return
    }

    if (openRevocationMessage()) return

    const queue = window.googlefc?.callbackQueue
    if (queue?.push) {
      queue.push({
        CONSENT_API_READY: () => {
          if (!openRevocationMessage()) navigate()
        },
      })
      timer = window.setTimeout(() => {
        timer = undefined
        if (!consentDialogVisible()) navigate()
      }, WATCHDOG_MS)
      return
    }

    // Scripts not available at all → go to the privacy page ourselves.
    navigate()
  }

  return (
    <a
      href={FALLBACK_HREF}
      onClick={handleClick}
      className={className}
      aria-haspopup="dialog"
      title="Einwilligung in Cookies für Werbung ändern oder widerrufen"
    >
      Datenschutz-Einstellungen
    </a>
  )
}
