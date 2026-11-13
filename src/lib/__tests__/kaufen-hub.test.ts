import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { KAUF_MODELLE, NICHT_IN_TABELLE } from '../kaufen-modelle'

const ROOT = path.resolve(__dirname, '../../..')
const PAGE = path.join(ROOT, 'src/app/kaufen/page.tsx')
const SITEMAP = path.join(ROOT, 'src/app/sitemap.ts')
const INDEXNOW = path.join(ROOT, 'scripts/indexnow.ts')

/**
 * Regressionen für die Landingpage /kaufen/ (Kaufberatung, Kern-Struktur).
 *
 * Diese Tests sichern die zwei Regeln, die beim Bau der Seite gegolten haben:
 * 1) keine erfundene Vollständigkeit — jedes Tabellenmodell braucht alle
 *    Pflichtangaben (Preis, WLTP, Batterie, beide Garantien, Quelle, Stand);
 * 2) keine Produkt-/Fahrzeug-Microdata — Google validiert schema.org/Vehicle als
 *    Product und meldet sonst fehlende offers/review (WNC-10030322).
 */
describe('kaufen hub page', () => {
  it('is registered in the sitemap and pinged via IndexNow', () => {
    expect(fs.readFileSync(SITEMAP, 'utf-8')).toContain("canonicalUrl('/kaufen/')")
    expect(fs.readFileSync(INDEXNOW, 'utf-8')).toContain("'/kaufen/'")
  })

  it('declares its own canonical URL', () => {
    expect(fs.readFileSync(PAGE, 'utf-8')).toContain("canonicalUrl('/kaufen/')")
  })

  it('emits no Product/Vehicle structured data', () => {
    const src = fs.readFileSync(PAGE, 'utf-8')
    expect(src).not.toMatch(/['"]@type['"]\s*:\s*['"](Product|Vehicle)['"]/)
  })

  it('keeps every table row fully sourced', () => {
    expect(KAUF_MODELLE.length).toBeGreaterThanOrEqual(5)
    for (const m of KAUF_MODELLE) {
      for (const field of [
        m.marke,
        m.modell,
        m.preisAb,
        m.wltp,
        m.batterie,
        m.garantieFahrzeug,
        m.garantieBatterie,
        m.quelle,
        m.stand,
      ]) {
        expect(field.trim().length).toBeGreaterThan(0)
      }
      // Preis muss ein Eurobetrag sein, keine Schätzung/"ca."
      expect(m.preisAb).toMatch(/€/)
      expect(m.preisAb).not.toMatch(/ca\.|circa|~/)
      // WLTP ist Pflicht, CLTC darf nicht auftauchen
      expect(m.wltp).toMatch(/km/)
      expect(m.wltp).not.toMatch(/CLTC/i)
    }
  })

  it('lists excluded models with a reason instead of dropping them silently', () => {
    expect(NICHT_IN_TABELLE.length).toBeGreaterThanOrEqual(3)
    for (const item of NICHT_IN_TABELLE) {
      expect(item.befund.length).toBeGreaterThan(40)
    }
  })

  it('never converts CLTC into WLTP on the page', () => {
    const src = fs.readFileSync(PAGE, 'utf-8')
    expect(src).not.toMatch(/WLTP-Schätzwert/i)
    expect(src).not.toMatch(/CLTC/i)
  })
})
