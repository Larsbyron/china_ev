import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Regression: Google liest `Vehicle` als Product-Subtyp. Ein Vehicle-Knoten
 * ohne `name` + `offers`/`review`/`aggregateRating` erzeugt in der Search
 * Console den Fehler „Produkt-Snippets“ (WNC-10030322, Meldung vom 11-04).
 * Deshalb darf im Artikel-JSON-LD kein Product/Vehicle-Knoten stehen.
 */
const page = readFileSync(
  join(__dirname, '../../app/articles/[slug]/page.tsx'),
  'utf8',
)

describe('Artikel-JSON-LD', () => {
  it('enthält keinen Product- oder Vehicle-Knoten', () => {
    expect(page).not.toMatch(/'@type':\s*'(Product|Vehicle)'/)
  })

  it('markiert die Marke als Brand', () => {
    expect(page).toMatch(/'@type':\s*'Brand'/)
  })
})
