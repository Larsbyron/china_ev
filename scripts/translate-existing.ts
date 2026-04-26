#!/usr/bin/env npx tsx

/**
 * translate-existing.ts
 *
 * Re-translates existing Chinese articles in content/posts/ to German.
 * Reads each .md file, detects if content is Chinese, translates, and overwrites.
 *
 * Usage: npx tsx scripts/translate-existing.ts
 */

import * as dotenv from 'dotenv'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import matter from 'gray-matter'
import { translateArticle } from '@/lib/translator'

dotenv.config()

const CONTENT_DIR = resolve(process.cwd(), 'content/posts')

function isChinese(text: string): boolean {
  const chineseChars = text.match(/[一-鿿]/g) || []
  return chineseChars.length > text.length * 0.1
}

async function main() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))
  let translated = 0
  let skipped = 0
  let failed = 0

  console.log(`Found ${files.length} articles in ${CONTENT_DIR}`)

  for (const file of files) {
    const filePath = resolve(CONTENT_DIR, file)
    const raw = readFileSync(filePath, 'utf-8')
    const { data: fm, content } = matter(raw)

    if (!isChinese(content)) {
      console.log(`[SKIP] ${file} — already German/English`)
      skipped++
      continue
    }

    console.log(`[TRANSLATING] ${file}...`)

    const result = await translateArticle(fm.title, content)

    if (!result.ok) {
      console.log(`  FAILED: ${result.error}`)
      failed++
      continue
    }

    // Rebuild the markdown file with translated content
    const newFrontmatter = `---
title: "${result.title.replace(/"/g, "'")}"
date: ${fm.date}
description: "${(fm.description || '').replace(/"/g, "'")}"
source: "${fm.source}"
${fm.image ? `image: "${fm.image}"` : ''}
category: "${fm.category || 'news'}"
${fm.brand ? `brand: "${fm.brand}"` : ''}
tags: [${(fm.tags || []).map((t: string) => `"${t}"`).join(', ')}]
draft: false
original_url: "${fm.original_url || ''}"
read_time_minutes: ${fm.read_time_minutes || 5}
---

# ${result.title}

${result.content}

---
*Quelle: ${fm.source}*
`

    writeFileSync(filePath, newFrontmatter, 'utf-8')
    console.log(`  OK — ${result.title.slice(0, 50)}...`)
    translated++

    // Rate limit: 1 request per second
    await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`\nDone: ${translated} translated, ${skipped} skipped, ${failed} failed`)
}

main().catch(console.error)
