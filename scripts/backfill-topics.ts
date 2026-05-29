#!/usr/bin/env tsx
import 'dotenv/config'
/**
 * Backfill classification for existing articles.
 *
 * Usage: npx tsx scripts/backfill-topics.ts [--dry-run] [--limit=N]
 *
 * - Reads each .md file in content/posts/
 * - Skips articles that already have primaryTopic
 * - Calls DeepSeek for classification (separate minimal prompt)
 * - Writes primaryTopic, marketRelevance, brands[], secondaryTopics back to frontmatter
 * - Outputs a classification-review.json for low-confidence articles
 * - Idempotent: safe to re-run
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { TOPICS } from '../src/lib/topics'
import { classifyArticle } from '../src/lib/classify'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const REVIEW_OUTPUT = path.join(process.cwd(), 'classification-review.json')
const CONFIDENCE_THRESHOLD = 0.7
const RATE_LIMIT_MS = 600

const isDryRun = process.argv.includes('--dry-run')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not set')
  process.exit(1)
}

// ============================================================================
// Frontmatter patch — only touch the classification fields
// ============================================================================

function patchFrontmatter(
  rawFile: string,
  fields: {
    primaryTopic: string
    secondaryTopics: string[]
    marketRelevance?: string
    brands: string[]
    confidence: number
  }
): string {
  const { data, content } = matter(rawFile)

  data.primaryTopic = fields.primaryTopic
  data.secondaryTopics = fields.secondaryTopics
  if (fields.marketRelevance) data.marketRelevance = fields.marketRelevance
  data.brands = fields.brands
  data.confidence = fields.confidence

  return matter.stringify(content, data)
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const files = fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()

  const toProcess = files.filter((f) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8')
    const { data } = matter(raw)
    return !data.primaryTopic
  })

  console.log(`Found ${files.length} articles total, ${toProcess.length} need classification`)
  if (isDryRun) console.log('DRY RUN — no files will be written')

  const lowConfidence: Array<{ file: string; title: string; confidence: number; primaryTopic: string }> = []
  let processed = 0
  let skipped = 0
  let errors = 0

  for (const file of toProcess.slice(0, limit === Infinity ? toProcess.length : limit)) {
    const filePath = path.join(POSTS_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    const title = data.title ?? file

    process.stdout.write(`[${processed + 1}/${Math.min(toProcess.length, limit)}] ${file.slice(0, 60).padEnd(60)} `)

    try {
      const result = await classifyArticle(title, raw)

      if (!result.primaryTopic) {
        console.log(`SKIP (no topic returned)`)
        skipped++
        continue
      }

      if (!isDryRun) {
        const patched = patchFrontmatter(raw, {
          primaryTopic: result.primaryTopic,
          secondaryTopics: result.secondaryTopics,
          marketRelevance: result.marketRelevance,
          brands: result.brands,
          confidence: result.confidence,
        })
        fs.writeFileSync(filePath, patched, 'utf-8')
      }

      if (result.confidence < CONFIDENCE_THRESHOLD) {
        lowConfidence.push({ file, title, confidence: result.confidence, primaryTopic: result.primaryTopic })
        console.log(`LOW(${result.confidence.toFixed(2)}) → ${result.primaryTopic}`)
      } else {
        console.log(`OK(${result.confidence.toFixed(2)}) → ${result.primaryTopic}`)
      }

      processed++
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
    } catch (err) {
      console.log(`ERROR: ${err instanceof Error ? err.message : err}`)
      errors++
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  console.log(`\nDone: ${processed} classified, ${skipped} skipped, ${errors} errors`)

  if (lowConfidence.length > 0) {
    if (!isDryRun) {
      fs.writeFileSync(REVIEW_OUTPUT, JSON.stringify(lowConfidence, null, 2), 'utf-8')
      console.log(`\nLow-confidence articles written to ${REVIEW_OUTPUT} (${lowConfidence.length} items)`)
    } else {
      console.log(`\n${lowConfidence.length} articles would need manual review (confidence < ${CONFIDENCE_THRESHOLD})`)
    }
  }

  // Topic distribution summary
  const allFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  const topicCounts: Record<string, number> = {}
  for (const f of allFiles) {
    const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'))
    if (data.primaryTopic) {
      topicCounts[data.primaryTopic] = (topicCounts[data.primaryTopic] ?? 0) + 1
    }
  }

  console.log('\nTopic distribution:')
  for (const topic of TOPICS) {
    const count = topicCounts[topic.slug] ?? 0
    console.log(`  ${topic.label.padEnd(45)} ${count}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
