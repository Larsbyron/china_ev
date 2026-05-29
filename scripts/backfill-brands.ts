#!/usr/bin/env tsx
/**
 * Backfill single-brand field for existing articles using the updated extractBrand logic.
 *
 * Usage: npx tsx scripts/backfill-brands.ts [--dry-run] [--limit=N]
 *
 * - Reads each .md file in content/posts/
 * - Re-computes `brand` from title + body using the current extractBrand()
 * - Writes updated `brand` back to frontmatter (no API calls — pure local logic)
 * - Idempotent and safe to re-run
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { extractBrand } from '../src/lib/scraper/brands'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

const isDryRun = process.argv.includes('--dry-run')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity

const files = fs.readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md') && !f.startsWith('weekly-top5'))
  .sort()

let processed = 0
let changed = 0
let unchanged = 0

for (const file of files) {
  if (processed >= limit) break

  const filePath = path.join(POSTS_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)

  const title: string = fm.title ?? ''
  const newBrand = extractBrand(title, content) ?? null

  const oldBrand: string | null = fm.brand ?? null

  processed++

  if (newBrand === oldBrand) {
    unchanged++
    continue
  }

  console.log(`[${file}] brand: "${oldBrand}" → "${newBrand}"`)
  changed++

  if (!isDryRun) {
    fm.brand = newBrand
    const newRaw = matter.stringify(content, fm)
    fs.writeFileSync(filePath, newRaw, 'utf-8')
  }
}

console.log(`\nDone. Processed: ${processed}, Changed: ${changed}, Unchanged: ${unchanged}`)
if (isDryRun) console.log('(dry-run — no files written)')
