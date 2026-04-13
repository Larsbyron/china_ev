// SHA-256 deduplication logic for E-Auto Blog scraper pipeline

import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { resolve, join } from 'path'
import type { ProcessedArticles, FingerprintRecord } from '../article'

const FINGERPRINT_FILE = resolve(process.cwd(), 'processed_articles.json')

/**
 * Normalize article text for fingerprinting
 */
export function normalizeForHash(text: string): string {
  // Strip HTML tags
  let normalized = text.replace(/<[^>]+>/g, '')

  // Unicode NFKD normalization
  normalized = normalized.normalize('NFKD')

  // Lowercase
  normalized = normalized.toLowerCase()

  // Trim and collapse whitespace
  normalized = normalized.trim().replace(/\s+/g, ' ')

  return normalized
}

/**
 * Compute SHA-256 fingerprint from normalized text
 */
export function computeFingerprint(text: string): string {
  const normalized = normalizeForHash(text)
  return createHash('sha256').update(normalized).digest('hex')
}

/**
 * Load fingerprints from disk
 */
export function loadFingerprints(): ProcessedArticles {
  if (!existsSync(FINGERPRINT_FILE)) {
    return {}
  }

  try {
    const content = readFileSync(FINGERPRINT_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

/**
 * Save fingerprints to disk
 */
export function saveFingerprints(fingerprints: ProcessedArticles): void {
  writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprints, null, 2), 'utf-8')
}

/**
 * Check if article is duplicate and record if not
 */
export function checkAndRecordFingerprint(
  text: string,
  metadata: FingerprintRecord,
  fingerprints: ProcessedArticles
): boolean {
  const fingerprint = computeFingerprint(text)

  if (fingerprint in fingerprints) {
    return true // Duplicate found
  }

  fingerprints[fingerprint] = metadata
  return false
}

/**
 * Rebuild fingerprints from existing markdown files in content/posts
 */
export function rebuildFingerprintsFromDisk(): ProcessedArticles {
  const contentDir = join(process.cwd(), 'content', 'posts')
  const fingerprints: ProcessedArticles = {}

  if (!existsSync(contentDir)) {
    return fingerprints
  }

  try {
    const files = readdirSync(contentDir).filter((f: string) => f.endsWith('.md'))

    for (const file of files) {
      const filePath = join(contentDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Skip frontmatter
      if (!content.startsWith('---')) continue

      const parts = content.split('---', 3)
      if (parts.length < 3) continue

      const body = parts[2]
        .replace(/^#.*$/gm, '') // Remove markdown headings
        .replace(/^\*Quelle:.*$/gm, '') // Remove source line

      const fingerprint = computeFingerprint(body)
      fingerprints[fingerprint] = {
        title: file.replace('.md', ''),
        source: 'rebuild',
        date: ''
      }
    }
  } catch (error) {
    console.error('Error rebuilding fingerprints:', error)
  }

  return fingerprints
}
