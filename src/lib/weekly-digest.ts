import matter from 'gray-matter'
import { ORIGINAL_SOURCE_NAME, articleFrontmatterSchema } from './schemas'

/**
 * Frontmatter + Markdown generator for the automated weekly Top-5 digest
 * (content/posts/weekly-top5-<year>-W<kw>.md).
 *
 * Kept free of filesystem/network imports so the writer in src/lib/scraper and
 * the regression test can share the exact same construction path.
 */

/**
 * `/weekly/` lists the digests and is the URL every digest file stands for.
 * The schema requires `original_url` (z.string().url()) even for own editorial
 * content — a digest has no external source article — so we point it at our own
 * digest index instead of inventing a foreign link.
 */
export const WEEKLY_DIGEST_URL = 'https://china-autonews.de/weekly/'

export interface WeeklyDigestTopItem {
  title: string
  source: string
  date: string
  url?: string
}

export interface WeeklyDigestMeta {
  /** ISO-8601 calendar week, 1..53 */
  isoWeek: number
  /** Calendar year used in the filename and title */
  year: number
  /** Publication timestamp, ISO-8601 UTC (new Date().toISOString()) */
  dateISO: string
}

export interface WeeklyDigestInput extends WeeklyDigestMeta {
  items: WeeklyDigestTopItem[]
}

/**
 * Unique per week. A constant title made every digest a duplicate of the
 * previous week's file for the title-dedup pass and for search engines.
 */
export function weeklyDigestTitle(isoWeek: number, year: number): string {
  return `Top 5 chinesische E-Autos – KW ${isoWeek}/${year}`
}

function weeklyDigestDescription(isoWeek: number, year: number): string {
  return `Die fünf wichtigsten chinesischen E-Auto-Nachrichten der KW ${isoWeek}/${year} im Rückblick`
}

/** Escapes a value for a double-quoted YAML scalar. */
function quote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/**
 * Serialises the YAML frontmatter block (including both `---` fences and the
 * trailing blank line). Every field articleFrontmatterSchema can require is
 * written out explicitly — `source` stays inside the enum via
 * ORIGINAL_SOURCE_NAME, which is what marks the digest as own editorial content.
 */
export function buildWeeklyDigestFrontmatter({ isoWeek, year, dateISO }: WeeklyDigestMeta): string {
  return `---
title: ${quote(weeklyDigestTitle(isoWeek, year))}
date: ${dateISO}
description: ${quote(weeklyDigestDescription(isoWeek, year))}
source: ${quote(ORIGINAL_SOURCE_NAME)}
category: "weekly"
tags: ["Top 5", "China", "E-Auto", "Wochenrückblick"]
draft: false
original_url: ${quote(WEEKLY_DIGEST_URL)}
brands: []
primaryTopic: "modelle-marktstarts"
secondaryTopics: ["preise-rabatte-wettbewerb", "markt-absatz-zulassungen"]
marketRelevance: "china_only"
confidence: 0.9
---

`
}

function buildWeeklyDigestBody({ isoWeek, year, dateISO, items }: WeeklyDigestInput): string {
  const published = new Date(dateISO).toLocaleDateString('de-DE')

  let body = `# Top 5 chinesische E-Autos – KW ${isoWeek}/${year}\n\n`
  body += `*KW ${isoWeek}, ${published}*\n\n`

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const dateStr = new Date(item.date).toLocaleDateString('de-DE')
    const linkStr = item.url ? ` [Quelle](${item.url})` : ''
    body += `${i + 1}. **${item.title}** — ${item.source} (${dateStr})${linkStr}\n`
  }

  body += '\n---\n*Kuratiert aus den besten chinesischen E-Auto-Nachrichten der Woche.*'
  return body
}

/** Complete digest file content (frontmatter + body), ready to write to disk. */
export function buildWeeklyDigestMarkdown(input: WeeklyDigestInput): string {
  return buildWeeklyDigestFrontmatter(input) + buildWeeklyDigestBody(input)
}

/**
 * Runtime gate for the scraper: CI generates the digest file *after* the test
 * suite already ran, so a broken generator only turns the pipeline red on the
 * NEXT run (2026-11-01: weekly-top5-2026-W44.md shipped with `source: "Weekly"`
 * and no `original_url` because the local checkout never saw the CI-written
 * file at fix time). Validate before writing: an invalid digest is worse than
 * no digest, because its page 404s while still sitting in content/posts.
 *
 * Returns an empty array when the Markdown would pass
 * articleFrontmatterSchema, otherwise one string per schema issue.
 */
export function validateWeeklyDigestMarkdown(markdown: string): string[] {
  const parsed = articleFrontmatterSchema.safeParse(matter(markdown).data)
  if (parsed.success) return []
  return parsed.error.issues.map(
    (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
  )
}
