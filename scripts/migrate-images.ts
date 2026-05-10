#!/usr/bin/env npx tsx

/**
 * migrate-images.ts
 *
 * One-time migration: download remote images from existing articles
 * and rewrite frontmatter to use local paths.
 *
 * Usage:
 *   npx tsx scripts/migrate-images.ts --dry-run   # Preview changes, no writes
 *   npx tsx scripts/migrate-images.ts             # Execute migration
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { downloadAndSaveImage } from '@/lib/images'

const CONTENT_DIR = resolve(process.cwd(), 'content/posts')
const DRY_RUN = process.argv.includes('--dry-run')

interface MigrationResult {
  file: string
  slug: string
  remoteUrl: string
  localPath: string | null
  status: 'ok' | 'failed' | 'skipped'
}

function extractImageUrl(content: string): string | null {
  const match = content.match(/^image:\s+"(https?:\/\/[^"]+)"/m)
  return match ? match[1] : null
}

function extractSlug(filename: string): string {
  // filename: 2024-01-15-byd-launches-ev.md → byd-launches-ev
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '')
}

function rewriteImagePath(content: string, localPath: string): string {
  return content.replace(
    /^(image:\s+)"https?:\/\/[^"]+"/m,
    `$1"${localPath}"`
  )
}

async function migrate(): Promise<void> {
  const files = readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))

  const articleFiles = files.map(f => ({
    filename: f,
    filepath: join(CONTENT_DIR, f),
    content: readFileSync(join(CONTENT_DIR, f), 'utf-8'),
  }))

  const toMigrate = articleFiles.filter(({ content }) => extractImageUrl(content) !== null)
  const alreadyLocal = articleFiles.filter(({ content }) => /^image:\s+"\/images\//m.test(content))
  const noImage = articleFiles.filter(({ content }) => !extractImageUrl(content) && !/^image:\s+"\/images\//m.test(content))

  console.log(`\nMigration summary:`)
  console.log(`  Total articles:  ${articleFiles.length}`)
  console.log(`  Remote images:   ${toMigrate.length}  ← will migrate`)
  console.log(`  Already local:   ${alreadyLocal.length}  (skip)`)
  console.log(`  No image:        ${noImage.length}  (skip)`)
  console.log(DRY_RUN ? '\n[DRY RUN] No files will be changed.\n' : '\nStarting migration...\n')

  const results: MigrationResult[] = []
  let done = 0

  for (const { filename, filepath, content } of toMigrate) {
    const remoteUrl = extractImageUrl(content)!
    const slug = extractSlug(filename)

    process.stdout.write(`[${++done}/${toMigrate.length}] ${slug} ... `)

    if (DRY_RUN) {
      console.log(`→ would download ${remoteUrl}`)
      results.push({ file: filename, slug, remoteUrl, localPath: null, status: 'skipped' })
      continue
    }

    const localPath = await downloadAndSaveImage(remoteUrl, slug)
    if (localPath) {
      const updated = rewriteImagePath(content, localPath)
      writeFileSync(filepath, updated, 'utf-8')
      console.log(`✓ ${localPath}`)
      results.push({ file: filename, slug, remoteUrl, localPath, status: 'ok' })
    } else {
      console.log(`✗ download failed`)
      results.push({ file: filename, slug, remoteUrl, localPath: null, status: 'failed' })
    }
  }

  if (!DRY_RUN) {
    const ok = results.filter(r => r.status === 'ok').length
    const failed = results.filter(r => r.status === 'failed').length
    console.log(`\nDone: ${ok} migrated, ${failed} failed`)
    if (failed > 0) {
      console.log('\nFailed articles (image kept as null):')
      results.filter(r => r.status === 'failed').forEach(r => console.log(`  - ${r.file}`))
    }
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
