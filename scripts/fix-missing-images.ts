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

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { downloadAndSaveImage, generateArticleImage } from '@/lib/images'

const POSTS_DIR = resolve(process.cwd(), 'content/posts')
const DRY_RUN = process.argv.includes('--dry-run')
const HOTLINKS_ONLY = process.argv.includes('--hotlinks-only')

interface FrontmatterInfo {
  file: string
  slug: string
  brand: string | null
  title: string
  hasImage: boolean
}

function parseFrontmatter(content: string): { brand: string | null; title: string; needsImage: boolean; currentImage: string } {
  const brandMatch = content.match(/^brand:\s*"?([^"\n]+)"?/m)
  const titleMatch = content.match(/^title:\s*"([^"]+)"/m)
  const imageMatch = content.match(/^image:\s*(.+)$/m)
  const draftMatch = content.match(/^draft:\s*(true|false)/m)

  const brand = brandMatch ? brandMatch[1].trim() : null
  const title = titleMatch ? titleMatch[1].trim() : ''
  const imageRaw = imageMatch ? imageMatch[1].trim().replace(/"/g, '') : ''
  const isDraft = draftMatch ? draftMatch[1] === 'true' : false

  const isHotlink = imageRaw.startsWith('http')
  const isMissing = !imageRaw || imageRaw === '' || imageRaw === 'null' || imageRaw.startsWith('/images/pexels-')
  const isLocalBroken = imageRaw.startsWith('/images/') && !existsSync(resolve(process.cwd(), 'public', imageRaw.slice(1)))

  // Never fetch/generate images for drafts (translation/QA/editorial failures) —
  // their images would leak into the committed public/images/ dir. Mirrors the
  // !draft gate in saveArticle.
  // --hotlinks-only mode: only process external URLs; skip missing/null articles
  const needsImage = isDraft ? false : (HOTLINKS_ONLY ? isHotlink : (isMissing || isHotlink || isLocalBroken))

  return { brand, title, needsImage, currentImage: isHotlink ? imageRaw : '' }
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

  interface ArticleEntry extends FrontmatterInfo { currentImage: string }
  const missing: ArticleEntry[] = []

  for (const file of files) {
    const content = readFileSync(resolve(POSTS_DIR, file), 'utf-8')
    const { brand, title, needsImage, currentImage } = parseFrontmatter(content)
    if (needsImage) {
      missing.push({ file, slug: deriveSlug(file), brand, title, hasImage: !needsImage, currentImage })
    }
  }

  const modeLabel = HOTLINKS_ONLY ? 'hotlinks-only' : 'all'
  console.log(`Found ${missing.length} articles needing image fix (mode: ${modeLabel})\n`)

  let fixed = 0
  let failed = 0

  for (const article of missing) {
    process.stdout.write(`[${article.brand ?? 'no brand'}] ${article.title.slice(0, 50)}... `)

    if (DRY_RUN) {
      const hint = article.currentImage ? `← ${article.currentImage.slice(0, 60)}` : '← null/missing'
      console.log(`(dry run — skipped) ${hint}`)
      continue
    }

    // For hotlinks: first try to download the original image
    let localPath: string | null = null
    if (article.currentImage) {
      localPath = await downloadAndSaveImage(article.currentImage, article.slug)
      if (localPath) {
        console.log(`✓ downloaded → ${localPath}`)
      } else {
        process.stdout.write('download failed → generating via AI... ')
      }
    }

    if (!localPath) {
      localPath = await generateArticleImage(article.brand, article.title, article.slug)
    }

    if (!localPath) {
      console.log('✗ AI generation failed')
      failed++
      continue
    }

    // Rewrite frontmatter: insert or replace image line
    const filePath = resolve(POSTS_DIR, article.file)
    const original = readFileSync(filePath, 'utf-8')

    let updated: string
    if (/^image:/m.test(original)) {
      // Replace whatever image line exists (empty, pexels, etc.)
      updated = original.replace(/^image:.*$/m, `image: "${localPath}"`)
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
