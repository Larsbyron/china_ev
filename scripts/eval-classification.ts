#!/usr/bin/env tsx
import 'dotenv/config'
/**
 * Classification quality gate against a hand-labeled golden set.
 *
 * Usage: npx tsx scripts/eval-classification.ts [--threshold=0.85]
 *
 * - Reads scripts/eval/classification-golden.json (file + expectedPrimaryTopic).
 * - Runs each article's real content through the shared classifier (src/lib/classify.ts).
 * - Reports per-topic + overall accuracy and lists every mismatch.
 * - Exits non-zero if accuracy < threshold (default 0.85) → usable as a CI gate.
 *
 * Run this whenever the classification prompt or taxonomy changes.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { classifyArticle } from '../src/lib/classify'
import { TOPICS } from '../src/lib/topics'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const GOLDEN_PATH = path.join(process.cwd(), 'scripts', 'eval', 'classification-golden.json')
const RATE_LIMIT_MS = 600

const thresholdArg = process.argv.find((a) => a.startsWith('--threshold='))
const THRESHOLD = thresholdArg ? parseFloat(thresholdArg.split('=')[1]) : 0.85

interface GoldenEntry {
  file: string
  expectedPrimaryTopic: string
  note?: string
}

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not set')
  process.exit(1)
}

const topicLabel = (slug: string) => TOPICS.find((t) => t.slug === slug)?.label ?? slug

async function main() {
  const golden: GoldenEntry[] = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf-8'))
  console.log(`Golden set: ${golden.length} articles · pass threshold: ${(THRESHOLD * 100).toFixed(0)}%\n`)

  let correct = 0
  let missing = 0
  const perTopic: Record<string, { correct: number; total: number }> = {}
  const mismatches: Array<{ file: string; expected: string; got: string; conf: number }> = []

  for (const entry of golden) {
    const filePath = path.join(POSTS_DIR, entry.file)
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ MISSING FILE: ${entry.file}`)
      missing++
      continue
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    const title = String(data.title ?? entry.file)

    const bucket = (perTopic[entry.expectedPrimaryTopic] ??= { correct: 0, total: 0 })
    bucket.total++

    try {
      const result = await classifyArticle(title, raw)
      const got = result.primaryTopic ?? '(none)'
      const ok = got === entry.expectedPrimaryTopic
      if (ok) {
        correct++
        bucket.correct++
        console.log(`  ✅ ${entry.expectedPrimaryTopic.padEnd(38)} ${title.slice(0, 50)}`)
      } else {
        mismatches.push({ file: entry.file, expected: entry.expectedPrimaryTopic, got, conf: result.confidence })
        console.log(`  ❌ erwartet ${entry.expectedPrimaryTopic} · bekam ${got}  — ${title.slice(0, 50)}`)
      }
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS))
    } catch (err) {
      console.log(`  ⚠ ERROR ${entry.file}: ${err instanceof Error ? err.message : err}`)
      mismatches.push({ file: entry.file, expected: entry.expectedPrimaryTopic, got: '(error)', conf: 0 })
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  const scored = golden.length - missing
  const accuracy = scored > 0 ? correct / scored : 0

  console.log('\n── Per-Topic ──')
  for (const topic of TOPICS) {
    const b = perTopic[topic.slug]
    if (!b) continue
    console.log(`  ${topicLabel(topic.slug).padEnd(45)} ${b.correct}/${b.total}`)
  }

  console.log('\n── Summary ──')
  console.log(`  Accuracy: ${correct}/${scored} = ${(accuracy * 100).toFixed(1)}%`)
  if (missing > 0) console.log(`  Skipped (missing files): ${missing}`)

  if (mismatches.length > 0) {
    console.log('\n── Mismatches ──')
    for (const m of mismatches) {
      console.log(`  ${m.file}\n    erwartet: ${m.expected} · bekam: ${m.got} (conf ${m.conf.toFixed(2)})`)
    }
  }

  if (accuracy < THRESHOLD) {
    console.error(`\n❌ FAIL: ${(accuracy * 100).toFixed(1)}% < ${(THRESHOLD * 100).toFixed(0)}% threshold`)
    process.exit(1)
  }
  console.log(`\n✅ PASS: ${(accuracy * 100).toFixed(1)}% ≥ ${(THRESHOLD * 100).toFixed(0)}% threshold`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
