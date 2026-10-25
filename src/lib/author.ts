/**
 * Site-wide editorial byline.
 * "Lars Bergmann" is an editorial pseudonym, disclosed on /redaktion/ and in the
 * bio below. Never invent a CV, employer, award or membership for this name —
 * the bio describes the desk, not a person.
 */
export const AUTHOR = {
  name: 'Lars Bergmann',
  role: 'Redaktion',
  pseudonym: true,
  /** Deep link used by bylines, JSON-LD `author.url` and OG metadata. */
  url: '/redaktion/#lars-bergmann',
  bio: 'Redaktionspseudonym von E-AUTOS für die Berichterstattung über den chinesischen Elektroauto-Markt und seine Bedeutung für deutsche Käufer.',
} as const
