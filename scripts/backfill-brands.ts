#!/usr/bin/env tsx
/**
 * Backfill brand and tags fields for existing articles.
 *
 * Usage: npx tsx scripts/backfill-brands.ts [--dry-run] [--limit=N]
 *
 * - Re-computes `brand` from title + body using extractBrand()
 * - Re-computes `tags`: primary brand + topic keywords (no competitor brands)
 * - Idempotent and safe to re-run — no API calls
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { extractBrand } from '../src/lib/scraper/brands'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

const isDryRun = process.argv.includes('--dry-run')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity

// Must stay in sync with extractTags() in scraper/index.ts
const TOPIC_KEYWORDS = [
  'Batterie', 'Reichweite', 'Ladestation', 'Schnellladen',
  'EU-Import', 'Zoll', 'Elektroauto', 'Hybrid', 'PHEV',
  'Autonomes Fahren', 'Autopilot', 'Marktanteil', 'Absatz',
  'Rückruf', 'Sicherheit', 'Börse', 'IPO',
]

function computeTags(brand: string | null, content: string): string[] {
  const tags: string[] = []
  if (brand) tags.push(brand)
  const upper = content.toUpperCase()
  for (const kw of TOPIC_KEYWORDS) {
    if (upper.includes(kw.toUpperCase())) tags.push(kw)
  }
  return Array.from(new Set(tags)).slice(0, 6)
}

const files = fs.readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md') && !f.startsWith('weekly-top5'))
  .sort()

let processed = 0
let brandChanged = 0
let tagsChanged = 0

for (const file of files) {
  if (processed >= limit) break

  const filePath = path.join(POSTS_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)

  const title: string = fm.title ?? ''
  const newBrand = extractBrand(title, content) ?? null
  const oldBrand: string | null = fm.brand ?? null

  const newTags = computeTags(newBrand, content)
  const oldTags: string[] = fm.tags ?? []

  const brandDiff = newBrand !== oldBrand
  const tagsDiff = JSON.stringify(newTags) !== JSON.stringify(oldTags)

  processed++

  if (!brandDiff && !tagsDiff) continue

  if (brandDiff) {
    console.log(`[${file}] brand: "${oldBrand}" → "${newBrand}"`)
    brandChanged++
  }
  if (tagsDiff) {
    console.log(`[${file}] tags: [${oldTags.join(', ')}] → [${newTags.join(', ')}]`)
    tagsChanged++
  }

  if (!isDryRun) {
    fm.brand = newBrand
    fm.tags = newTags
    const newRaw = matter.stringify(content, fm)
    fs.writeFileSync(filePath, newRaw, 'utf-8')
  }
}

console.log(`\nDone. Processed: ${processed}, Brand changed: ${brandChanged}, Tags changed: ${tagsChanged}`)
if (isDryRun) console.log('(dry-run — no files written)')
