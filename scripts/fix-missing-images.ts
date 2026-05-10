#!/usr/bin/env npx tsx
/**
 * fix-missing-images.ts
 *
 * One-time script: finds articles with no image, fetches a Pexels photo,
 * and rewrites the frontmatter image field in-place.
 *
 * Usage:
 *   npx tsx scripts/fix-missing-images.ts
 *   npx tsx scripts/fix-missing-images.ts --dry-run
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { generateArticleImage } from '@/lib/images'

const POSTS_DIR = resolve(process.cwd(), 'content/posts')
const DRY_RUN = process.argv.includes('--dry-run')

interface FrontmatterInfo {
  file: string
  slug: string
  brand: string | null
  title: string
  hasImage: boolean
}

function parseFrontmatter(content: string): { brand: string | null; title: string; needsImage: boolean } {
  const brandMatch = content.match(/^brand:\s*"?([^"\n]+)"?/m)
  const titleMatch = content.match(/^title:\s*"([^"]+)"/m)
  const imageMatch = content.match(/^image:\s*(.+)$/m)

  const brand = brandMatch ? brandMatch[1].trim() : null
  const title = titleMatch ? titleMatch[1].trim() : ''
  const imageRaw = imageMatch ? imageMatch[1].trim().replace(/"/g, '') : ''

  // Needs replacement if: no image, or image is a pexels fallback
  const needsImage =
    !imageRaw ||
    imageRaw === '' ||
    imageRaw.startsWith('/images/pexels-')

  return { brand, title, needsImage }
}

function deriveSlug(filename: string): string {
  // e.g. 2026-04-10-byd-launches-ev-sina-abc123.md → byd-launches-ev-sina-abc123
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
}

async function main() {
  console.log(`Fix Missing Images — ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log('─'.repeat(50))

  const files = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('.'))
    .sort()

  const missing: FrontmatterInfo[] = []

  for (const file of files) {
    const content = readFileSync(resolve(POSTS_DIR, file), 'utf-8')
    const { brand, title, needsImage } = parseFrontmatter(content)
    if (needsImage) {
      missing.push({ file, slug: deriveSlug(file), brand, title, hasImage: !needsImage })
    }
  }

  console.log(`Found ${missing.length} articles without images\n`)

  let fixed = 0
  let failed = 0

  for (const article of missing) {
    process.stdout.write(`[${article.brand ?? 'no brand'}] ${article.title.slice(0, 50)}... `)

    if (DRY_RUN) {
      console.log('(dry run — skipped)')
      continue
    }

    const localPath = await generateArticleImage(article.brand, article.title, article.slug)

    if (!localPath) {
      console.log('✗ Pexels returned no result')
      failed++
      continue
    }

    // Rewrite frontmatter: insert or replace image line
    const filePath = resolve(POSTS_DIR, article.file)
    const original = readFileSync(filePath, 'utf-8')

    let updated: string
    if (/^image:\s*$/m.test(original) || /^image:\s*""\s*$/m.test(original)) {
      updated = original.replace(/^image:\s*.*$/m, `image: "${localPath}"`)
    } else {
      // No image line at all — insert after source line
      updated = original.replace(/(^source:.*$)/m, `$1\nimage: "${localPath}"`)
    }

    writeFileSync(filePath, updated, 'utf-8')
    console.log(`✓ ${localPath}`)
    fixed++
  }

  console.log(`\n─`.repeat(50))
  console.log(`Fixed: ${fixed} | Failed: ${failed} | Total: ${missing.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
