/**
 * Editorial transparency facts — single source of truth.
 * PUBLISHER / EDITORIAL_RESPONSIBLE must stay identical to /impressum.
 * Unit tests assert that they do.
 */

export const PUBLISHER = {
  legalName: 'Loghan GmbH',
  street: 'Forsthaus 22',
  postalCode: '40883',
  city: 'Ratingen',
  managingDirector: 'Zhinai Liu',
  registerCourt: 'Amtsgericht Neuss',
  registerNumber: 'HRB 21826',
  vatId: 'DE345173693',
  email: 'l.bai@loghan.de',
  phone: '+49 179 7337425',
} as const

export const EDITORIAL_RESPONSIBLE = {
  name: 'Zhinai Liu',
} as const

/** MStV § 18 Abs. 2 requires a named person; keep the note in one place. */
export const EDITORIAL_RESPONSIBLE_LEGAL_BASIS = '§ 18 Abs. 2 MStV'

/** Shown under the headline of every translated article. */
export const AI_LABEL = 'KI-gestützte Übersetzung'

/** Shown under the headline of our own (non-translated) guides. */
export const AI_LABEL_ORIGINAL = 'KI-gestützte Erstellung'

export const AI_DISCLOSURE_TEXT =
  'Die Erstübersetzung dieses Artikels entsteht mit einem KI-Sprachmodell und wird vor der Veröffentlichung automatisiert geprüft. Quelle und Originalbeitrag sind am Artikelende verlinkt.'

/** Update on every substantive change to /redaktion/ (visible "Stand" line). */
export const REDAKTION_STAND = '25. Oktober 2026'

/** Sources we actually evaluate — mirrors SOURCE_NAMES consumed by the pipeline. */
export const SOURCES = [
  'CarNewsChina',
  'CnEVPost',
  'Electrek',
  'electrive',
  'Autohome NewEnergy',
  'D1EV',
  'OFweek NEV',
  'Sina',
  'ChooseAuto',
] as const
