/**
 * Editorial transparency page (/redaktion/) — hard evidence tests.
 *
 * vitest runs with `environment: 'node'` and only picks up tests under src/lib,
 * so React pages cannot be rendered here. These tests read the source files with
 * `node:fs` instead: they guard the facts that must not drift (publisher data,
 * pseudonym disclosure, sitemap entry, footer entry, forbidden marketing claims).
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  AI_DISCLOSURE_TEXT,
  AI_LABEL,
  EDITORIAL_RESPONSIBLE,
  PUBLISHER,
  REDAKTION_STAND,
  SOURCES,
} from '../redaktion'
import { AUTHOR } from '../author'

const ROOT = process.cwd()

function read(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), 'utf8')
}

describe('PUBLISHER / Impressum parity', () => {
  const impressum = read('src/app/impressum/page.tsx')

  it('uses the real company identifiers', () => {
    expect(PUBLISHER.legalName).toBe('Loghan GmbH')
    expect(PUBLISHER.vatId).toBe('DE345173693')
    expect(PUBLISHER.registerNumber).toBe('HRB 21826')
    expect(EDITORIAL_RESPONSIBLE.name).toBe('Zhinai Liu')
  })

  it('keeps /impressum identical to the shared constants', () => {
    expect(impressum).toContain(PUBLISHER.vatId)
    expect(impressum).toContain(PUBLISHER.registerNumber)
    expect(impressum).toContain(PUBLISHER.street)
    expect(impressum).toContain(PUBLISHER.postalCode)
    expect(impressum).toContain(PUBLISHER.city)
    expect(impressum).toContain(PUBLISHER.email)
    expect(impressum).toContain(PUBLISHER.phone)
    expect(impressum).toContain(EDITORIAL_RESPONSIBLE.name)
    expect(impressum).toContain('§ 18 Abs. 2 MStV')
  })

  it('links the editorial guidelines from the Impressum', () => {
    expect(impressum).toContain('href="/redaktion/"')
  })
})

describe('author byline discloses the pseudonym', () => {
  it('marks Lars Bergmann as a pseudonym pointing at /redaktion/', () => {
    expect(AUTHOR.name).toBe('Lars Bergmann')
    expect(AUTHOR.pseudonym).toBe(true)
    expect(AUTHOR.url).toBe('/redaktion/#lars-bergmann')
    expect(AUTHOR.bio).toContain('Redaktionspseudonym')
    expect(AUTHOR.role).toBe('Redaktion')
  })

  it('never claims a CV, award or membership for the pseudonym', () => {
    const bio = AUTHOR.bio.toLowerCase()
    for (const claim of ['mitglied', 'auszeichnung', 'preis', 'studium', 'jahrgang', 'arbeitet seit']) {
      expect(bio).not.toContain(claim)
    }
  })
})

describe('sources list', () => {
  it('has no duplicates and names the real main sources', () => {
    expect(new Set(SOURCES).size).toBe(SOURCES.length)
    expect(SOURCES).toContain('CarNewsChina')
    expect(SOURCES).toContain('CnEVPost')
    expect(SOURCES).toContain('Electrek')
    expect(SOURCES.length).toBeGreaterThanOrEqual(5)
  })
})

describe('/redaktion/ page content', () => {
  const page = read('src/app/redaktion/page.tsx')

  it('carries the AI label and disclosure copy', () => {
    expect(AI_LABEL).toBe('KI-gestützte Übersetzung')
    expect(page).toContain('AI_LABEL')
    expect(page).toContain('Redaktion &amp; Transparenz')
    expect(AI_DISCLOSURE_TEXT).toContain('KI-Sprachmodell')
    expect(REDAKTION_STAND).toMatch(/^\d{1,2}\. [A-Za-zäöü]+ \d{4}$/)
  })

  it('names the MStV-responsible person and the full provider data', () => {
    expect(page).toContain('§ 18 Abs. 2 MStV')
    expect(page).toContain('EDITORIAL_RESPONSIBLE.name')
    expect(page).toContain('PUBLISHER.vatId')
    expect(page).toContain('PUBLISHER.registerNumber')
    expect(page).toContain('PUBLISHER.email')
    expect(page).toContain('PUBLISHER.phone')
  })

  it('documents funding and privacy with the real UI wording', () => {
    expect(page).toContain('Amazon-Partnerprogramm')
    expect(page).toContain('AdSense')
    expect(page).toContain('Datenschutz-Einstellungen')
  })

  it('is indexable with a self-referencing canonical', () => {
    expect(page).toContain("const PAGE_PATH = '/redaktion/'")
    expect(page).toContain('canonicalUrl(PAGE_PATH)')
    expect(page).not.toContain('index: false')
  })

  it('ships no ad unit and no affiliate box', () => {
    expect(page).not.toContain('AdUnit')
    expect(page).not.toContain('AffiliateBox')
    expect(page).not.toContain('adsbygoogle')
  })

  it('anchors the author card used by article bylines', () => {
    expect(page).toContain('id="lars-bergmann"')
    expect(page).toContain('id="ki"')
  })
})

describe('forbidden marketing claims', () => {
  // Negated statements ("keine Auszeichnungen", "kein Reporterteam in China")
  // are the point of the page, so only *affirmative* claims are banned.
  const forbidden = [
    'vor Ort getestet',
    'unabhängiger Test',
    'unabhängig getestet',
    'preisgekrönt',
    'Mitglied im',
    'wurde ausgezeichnet',
    'Auszeichnung erhalten',
    'unsere Korrespondenten',
  ]

  for (const file of ['src/app/redaktion/page.tsx', 'src/app/about/page.tsx']) {
    it(`${file} makes no affirmative claim it cannot prove`, () => {
      const text = read(file)
      for (const phrase of forbidden) {
        expect(text).not.toContain(phrase)
      }
    })
  }

  it('keeps the honest negatives on the transparency page', () => {
    const page = read('src/app/redaktion/page.tsx')
    expect(page).toContain('kein')
    expect(page).toContain('Reporterteam in China')
    expect(page).toContain('Auslandsbüro')
    expect(page).toContain('keine eigenen Fahrversuche')
  })
})

describe('internal linking', () => {
  it('adds /redaktion/ to the hand-written sitemap list', () => {
    expect(read('src/app/sitemap.ts')).toContain("canonicalUrl('/redaktion/')")
  })

  it('links the page from the footer above the consent button', () => {
    const footer = read('src/components/SiteFooter.tsx')
    expect(footer).toContain("{ href: '/redaktion', label: 'Redaktion' }")
    expect(footer).toContain("{ href: '/about', label: 'Über uns' }")
    expect(footer.indexOf("/redaktion'")).toBeLessThan(footer.indexOf('ConsentSettingsLink className'))
  })

  it('points article bylines, JSON-LD and the AI note at the new page', () => {
    const articlePage = read('src/app/articles/[slug]/page.tsx')
    expect(articlePage).toContain('href="/redaktion/#lars-bergmann"')
    expect(articlePage).toContain('href="/redaktion/#ki"')
    expect(articlePage).toContain('publishingPrinciples')
    expect(articlePage).toContain('isBasedOn')
    expect(articlePage).not.toContain('${siteUrl}/about/')
  })

  it('declares publishingPrinciples on the site-wide NewsMediaOrganization', () => {
    expect(read('src/app/layout.tsx')).toContain('publishingPrinciples')
  })
})
