import { describe, it, expect } from 'vitest'
import { parseClassification } from '../classify'

describe('parseClassification', () => {
  const fullOutput = `===THEMA===
modelle-marktstarts
===SEKUNDAERE_THEMEN===
preise-rabatte-wettbewerb, batterie-laden-reichweite
===MARKTRELEVANZ===
eu_planned
===MARKEN===
BYD, NIO
===KONFIDENZ===
0.92`

  it('parses a well-formed response', () => {
    const r = parseClassification(fullOutput)
    expect(r.primaryTopic).toBe('modelle-marktstarts')
    expect(r.secondaryTopics).toEqual(['preise-rabatte-wettbewerb', 'batterie-laden-reichweite'])
    expect(r.marketRelevance).toBe('eu_planned')
    expect(r.brands).toEqual(['BYD', 'NIO'])
    expect(r.confidence).toBeCloseTo(0.92)
  })

  it('rejects an invalid primaryTopic (returns undefined, not garbage)', () => {
    const r = parseClassification('===THEMA===\nnot-a-real-topic\n===KONFIDENZ===\n0.8')
    expect(r.primaryTopic).toBeUndefined()
  })

  it('drops a secondary topic that duplicates the primary', () => {
    const r = parseClassification(
      '===THEMA===\nmodelle-marktstarts\n===SEKUNDAERE_THEMEN===\nmodelle-marktstarts, preise-rabatte-wettbewerb\n===MARKTRELEVANZ===\nde_available\n===MARKEN===\n\n===KONFIDENZ===\n0.7'
    )
    expect(r.secondaryTopics).toEqual(['preise-rabatte-wettbewerb'])
  })

  it('caps secondary topics at two', () => {
    const r = parseClassification(
      '===THEMA===\nmarkt-absatz-zulassungen\n===SEKUNDAERE_THEMEN===\npreise-rabatte-wettbewerb, batterie-laden-reichweite, politik-zoelle-regulierung\n===KONFIDENZ===\n0.6'
    )
    expect(r.secondaryTopics).toHaveLength(2)
  })

  it('ignores trailing explanations after the value (uses first non-empty line)', () => {
    const r = parseClassification(
      '===THEMA===\npolitik-zoelle-regulierung\nDies ist eine Erklärung\n===KONFIDENZ===\n0.85'
    )
    expect(r.primaryTopic).toBe('politik-zoelle-regulierung')
  })

  it('defaults confidence to 0.5 when unparseable', () => {
    const r = parseClassification('===THEMA===\nmodelle-marktstarts\n===KONFIDENZ===\nkeine-zahl')
    expect(r.confidence).toBe(0.5)
  })

  it('rejects an invalid marketRelevance value', () => {
    const r = parseClassification('===THEMA===\nmodelle-marktstarts\n===MARKTRELEVANZ===\nmaybe\n===KONFIDENZ===\n0.9')
    expect(r.marketRelevance).toBeUndefined()
  })

  it('handles a completely empty response without throwing', () => {
    const r = parseClassification('')
    expect(r.primaryTopic).toBeUndefined()
    expect(r.secondaryTopics).toEqual([])
    expect(r.brands).toEqual([])
    expect(r.confidence).toBe(0.5)
  })
})
