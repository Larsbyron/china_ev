'use client'

import { useEffect, useRef } from 'react'
import styles from './AdUnit.module.css'

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>>
  }
}

export const ADSENSE_CLIENT = 'ca-pub-6277933970818179'

type AdUnitProps = {
  /** AdSense display/in-article unit slot ID. Empty string ⇒ render nothing. */
  slot: string
  variant?: 'in-article' | 'bottom'
}

export default function AdUnit({ slot, variant = 'bottom' }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)

  // The <ins> must exist in the DOM *before* push({}). push({}) fills the first
  // unfilled ins in DOM order, so exactly one push per ins.
  useEffect(() => {
    const ins = insRef.current
    if (!ins || !slot) return
    // AdSense marks a processed element with data-adsbygoogle-status. React may
    // keep this instance mounted across client-side navigation and dev
    // StrictMode double-runs effects — never push twice for one element.
    if (ins.getAttribute('data-adsbygoogle-status')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Ad blocker blocked adsbygoogle.js — stay silent, keep the layout intact.
    }
  }, [slot])

  // No slot ID (env not set) ⇒ no markup at all. This is the feature flag: an
  // empty <ins data-ad-slot=""> would throw TagErrors and leave blank boxes.
  if (!slot) return null

  return (
    // data-pagefind-ignore: without it the "Anzeige" label would be indexed by
    // the build-time pagefind run and pollute the on-site search index.
    <aside
      className={variant === 'in-article' ? styles.wrapInline : styles.wrapBottom}
      data-pagefind-ignore
      aria-label="Anzeige"
    >
      <span className={styles.badge}>Anzeige</span>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        {...(variant === 'in-article'
          ? { 'data-ad-layout': 'in-article', 'data-ad-format': 'fluid' }
          : { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' })}
      />
    </aside>
  )
}
