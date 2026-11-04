import { describe, expect, it } from 'vitest'
import { TRANSLATION_SYSTEM_PROMPT } from '../translator/prompts'

/**
 * Regression guard for the CLTC rule.
 *
 * Background: the translation prompt used to force "CLTC × 0,85 ≈ WLTP" and
 * required the literal phrase "entspricht ca. … km (WLTP-Schätzwert)" in every
 * article. That produced ~1,400 pages with a fabricated WLTP figure, and a
 * Chinese exporter called it out in a fact-check mail (2026-11-04).
 *
 * The rule now is: quote CLTC verbatim, never convert. This test fails if the
 * old conversion rule comes back.
 */
describe('translation prompt — CLTC handling', () => {
  it('does not ask the model to convert CLTC into WLTP', () => {
    expect(TRANSLATION_SYSTEM_PROMPT).not.toMatch(/CLTC\s*×\s*0[.,]85/)
    expect(TRANSLATION_SYSTEM_PROMPT).not.toMatch(/x×0,85|X×0,85/i)
  })

  it('does not require the fabricated WLTP estimate phrase', () => {
    expect(TRANSLATION_SYSTEM_PROMPT).not.toContain('entspricht ca.')
    expect(TRANSLATION_SYSTEM_PROMPT).not.toContain('WLTP-Schätzwert')
  })

  it('states that CLTC is not directly comparable with WLTP', () => {
    expect(TRANSLATION_SYSTEM_PROMPT).toMatch(/nicht direkt mit WLTP vergleichbar|nicht direkt\n?\s*vergleichbar/i)
  })

  it('keeps the verbatim format "km (CLTC)"', () => {
    expect(TRANSLATION_SYSTEM_PROMPT).toMatch(/Pflichtformat:\s*\[X\] km \(CLTC\)/)
  })
})
