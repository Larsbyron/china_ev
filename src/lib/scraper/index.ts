// Scraper orchestrator - runs all sources in parallel, handles deduplication and logging

import { writeFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import type { Article, ScraperOptions, ScraperResult, ProcessedArticles, SourceName } from '../article'
import { generateSlug, estimateReadTime, toISODateString, sanitizeDescription, truncateText } from '../article'
import { loadFingerprints, saveFingerprints, computeFingerprint, rebuildFingerprintsFromDisk } from './dedup'
import { scrapeAutohome } from './sources/autohome'
import { scrapeIfeng } from './sources/ifeng'
import { scrapeSina } from './sources/sina'
import { scrapePCauto } from './sources/pcauto'
import { scrapeAutohomeNewEnergy } from './sources/autohome_newenergy'
import { scrapeOfweekNev } from './sources/ofweek_nev'
import { scrapeChooseAuto } from './sources/chooseauto'
import { translateArticle } from '../translator'
import { lookupBrand } from '../translator/brand-glossary'
import { runQualityCheck, formatQualityReport } from '../translator/quality-check'
import { downloadAndSaveImage } from '../images'

const RUNLOG_FILE = resolve(process.cwd(), '.runlog.jsonl')
const CONTENT_DIR = resolve(process.cwd(), 'content/posts')
const DRAFTS_DIR = resolve(process.cwd(), 'content/posts/drafts')

type ScraperFn = (maxArticles?: number) => Promise<Article[]>

const SCRAPERS: Record<string, ScraperFn> = {
  autohome: scrapeAutohome,
  ifeng: scrapeIfeng,
  sina: scrapeSina,
  pcauto: scrapePCauto,
  autohome_newenergy: scrapeAutohomeNewEnergy,
  ofweek_nev: scrapeOfweekNev,
  chooseauto: scrapeChooseAuto
}

const SOURCE_NAMES: Record<string, SourceName> = {
  autohome: 'Autohome',
  ifeng: 'Ifeng',
  sina: 'Sina',
  pcauto: 'PCauto',
  autohome_newenergy: 'Autohome NewEnergy',
  ofweek_nev: 'OFweek NEV',
  chooseauto: 'ChooseAuto'
}

/**
 * Log an action to .runlog.jsonl
 */
function logRun(source: string, title: string, action: string, translationOk = true): void {
  const entry = {
    ts: new Date().toISOString(),
    source,
    title: title.slice(0, 100),
    action,
    translation_ok: translationOk
  }
  try {
    appendFileSync(RUNLOG_FILE, JSON.stringify(entry) + '\n', 'utf-8')
  } catch {
    // Non-fatal
  }
}

/**
 * Ensure directories exist
 */
function ensureDirs(): void {
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true })
  }
  if (!existsSync(DRAFTS_DIR)) {
    mkdirSync(DRAFTS_DIR, { recursive: true })
  }
}

/**
 * Save article as Markdown file with frontmatter
 */
async function saveArticle(article: Article, draft = false): Promise<string> {
  ensureDirs()

  const slug = generateSlug(article.title, article.source.toLowerCase())
  const date = toISODateString(new Date())
  const readTime = estimateReadTime(article.content)

  // Download remote image; if unavailable, leave null (logo placeholder shown in UI)
  let imageValue: string | null = article.image || null
  if (imageValue && imageValue.startsWith('http')) {
    const localPath = await downloadAndSaveImage(imageValue, slug)
    if (localPath) {
      imageValue = localPath
    } else {
      console.log(`[${article.source}] Image download failed — logo placeholder will be shown`)
      imageValue = null
    }
  }

  // Sanitize description to remove markdown artifacts and scraping residue
  const cleanDescription = article.description
    ? sanitizeDescription(article.description, article.content)
    : truncateText(article.content.replace(/<[^>]+>/g, '').replace(/\*{1,3}[^*]+\*{1,3}/g, '').replace(/[#>\[\]`]/g, '').replace(/\s+/g, ' ').trim(), 200)

  const frontmatter = {
    title: article.title,
    date,
    description: cleanDescription,
    source: article.source,
    image: imageValue,
    category: 'news',
    brand: article.brand || null,
    tags: extractTags(article.content, article.brand),
    draft,
    original_url: article.originalUrl,
    read_time_minutes: readTime
  }

  const safeTitle = frontmatter.title.replace(/"/g, "'")
  const safeDescription = frontmatter.description.replace(/"/g, "'")

  const frontmatterStr = `---
title: "${safeTitle}"
date: ${frontmatter.date}
description: "${safeDescription}"
source: "${frontmatter.source}"
${frontmatter.image ? `image: "${frontmatter.image}"` : ''}
category: "${frontmatter.category}"
${frontmatter.brand ? `brand: "${frontmatter.brand}"` : ''}
tags: [${frontmatter.tags.map(t => `"${t.replace(/"/g, "'")}"`).join(', ')}]
draft: ${frontmatter.draft}
original_url: "${frontmatter.original_url}"
read_time_minutes: ${frontmatter.read_time_minutes}
---

# ${frontmatter.title}

${article.content}
`

  const targetDir = draft ? DRAFTS_DIR : CONTENT_DIR
  const filename = resolve(targetDir, `${date.slice(0, 10)}-${slug}.md`)
  writeFileSync(filename, frontmatterStr, 'utf-8')

  return filename
}

/**
 * Extract relevant tags from content
 */
function extractTags(content: string, brand?: string): string[] {
  const keywords = [
    'BYD', 'NIO', 'XPeng', 'Xpeng', 'Li Auto', 'Xiaomi SU', 'Onvo',
    'Geely', 'Zeekr', 'Leapmotor', 'Aion', 'MG', 'Tesla',
    'Batterie', 'Reichweite', 'Ladestation', 'EU-Import', 'Zoll',
    'Elektroauto', 'E-Auto', 'EV', 'Marktanteil'
  ]

  const tags: string[] = []

  // Add brand as first tag if found
  if (brand) {
    tags.push(brand)
  }

  const upperContent = content.toUpperCase()

  for (const keyword of keywords) {
    if (upperContent.includes(keyword.toUpperCase())) {
      tags.push(keyword)
    }
  }

  return Array.from(new Set(tags)).slice(0, 8)
}

/**
 * Run a single scraper and process its articles
 */
async function processSource(
  sourceKey: string,
  scraperFn: ScraperFn,
  fingerprints: ProcessedArticles
): Promise<ScraperResult> {
  const sourceName = SOURCE_NAMES[sourceKey]
  const result: ScraperResult = {
    source: sourceName,
    articles: [],
    errors: []
  }

  try {
    console.log(`\n[${sourceName}] Starting scrape...`)
    const articles = await scraperFn(5)

    for (const article of articles) {
      // Check for duplicate
      const fingerprint = computeFingerprint(article.content)
      if (fingerprint in fingerprints) {
        console.log(`[${sourceName}] Duplicate: ${article.title.slice(0, 40)}...`)
        logRun(sourceName, article.title, 'skipped_dupe')
        continue
      }

      // Translate to German
      console.log(`[${sourceName}] Translating: ${article.title.slice(0, 40)}...`)
      let translatedArticle = article

      try {
        const translation = await translateArticle(article.title, article.content, {
          brand: article.brand
        })

        if (!translation.ok) {
          console.log(`[${sourceName}] Translation failed: ${translation.error} — saving to drafts`)
          logRun(sourceName, article.title, 'draft_translate_fail')
          try {
            await saveArticle({ ...article, title: `[TRANSLATION FAILED] ${article.title}`, content: `Translation error: ${translation.error}\n\nOriginal content:\n\n${article.content}` }, true)
          } catch (draftError) {
            const draftErrorMsg = draftError instanceof Error ? draftError.message : String(draftError)
            result.errors.push(`Failed to save draft ${article.title}: ${draftErrorMsg}`)
          }
          continue
        }

        // Append "In Deutschland" section to content if available
        const fullContent = translation.inDeutschland
          ? `${translation.content}\n\n---\n\n${translation.inDeutschland}`
          : translation.content

        // Use AI-generated description if available, otherwise generate from content
        const description = translation.description && translation.description.length > 20
          ? translation.description
          : undefined

        // Update article with translated content
        translatedArticle = {
          ...article,
          title: translation.title,
          content: fullContent,
          description
        }

        console.log(`[${sourceName}] Translated OK (${translation.content.length} chars)`)

        // === Quality Check ===
        const brandInfo = lookupBrand(article.brand || '')
        const qcResult = runQualityCheck({
          title: translation.title,
          description: description || '',
          content: fullContent,
          originalContent: article.content,
          brandOfficialName: brandInfo?.officialName,
        })

        if (!qcResult.passed) {
          console.log(`[${sourceName}] QA FAILED (${qcResult.errorCount} errors):`)
          console.log(formatQualityReport(qcResult))

          // 用清洗后的内容存到 drafts
          translatedArticle = {
            ...translatedArticle,
            title: `[QA FAILED] ${qcResult.title}`,
            content: qcResult.content,
            description: qcResult.description,
          }
          try {
            await saveArticle(translatedArticle, true)
            logRun(sourceName, translatedArticle.title, 'draft_qa_failed')
          } catch (draftError) {
            const draftErrorMsg = draftError instanceof Error ? draftError.message : String(draftError)
            result.errors.push(`Failed to save QA draft ${article.title}: ${draftErrorMsg}`)
          }
          continue
        }

        if (qcResult.warningCount > 0) {
          console.log(`[${sourceName}] QA passed with ${qcResult.warningCount} warnings`)
        }

        // 使用清洗后的内容
        translatedArticle = {
          ...translatedArticle,
          title: qcResult.title,
          content: qcResult.content,
          description: qcResult.description,
        }
        // ======================
      } catch (translateErr) {
        const translateErrMsg = translateErr instanceof Error ? translateErr.message : String(translateErr)
        console.log(`[${sourceName}] Translation error: ${translateErrMsg} — saving to drafts`)
        logRun(sourceName, article.title, 'draft_translate_fail')
        try {
          await saveArticle({ ...article, title: `[TRANSLATION ERROR] ${article.title}`, content: `Translation error: ${translateErrMsg}\n\nOriginal content:\n\n${article.content}` }, true)
        } catch (draftError) {
          const draftErrorMsg = draftError instanceof Error ? draftError.message : String(draftError)
          result.errors.push(`Failed to save draft ${article.title}: ${draftErrorMsg}`)
        }
        continue
      }

      // Save translated article
      try {
        const filename = await saveArticle(translatedArticle, false)
        result.articles.push(translatedArticle)

        // Record fingerprint (use translated content for uniqueness)
        const translatedFingerprint = computeFingerprint(translatedArticle.content)
        fingerprints[translatedFingerprint] = {
          title: translatedArticle.title,
          source: sourceName,
          date: new Date().toISOString()
        }

        console.log(`[${sourceName}] Saved: ${filename.split('/').pop()}`)
        logRun(sourceName, translatedArticle.title, 'published')
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.errors.push(`Failed to save ${article.title}: ${errorMsg}`)
        logRun(sourceName, article.title, 'error', false)
      }
    }

    console.log(`[${sourceName}] Done: ${result.articles.length} articles`)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    result.errors.push(`Scraper error: ${errorMsg}`)
    console.error(`[${sourceName}] Error:`, error)
    logRun(sourceName, '', 'error', false)
  }

  return result
}

/**
 * Run all scrapers in parallel
 */
export async function scrapeAll(options: ScraperOptions = {}): Promise<void> {
  console.log('='.repeat(60))
  console.log('E-Auto Blog — Scraper Pipeline')
  console.log('='.repeat(60))

  const fingerprints = loadFingerprints()
  const results: ScraperResult[] = []

  const sourcesToRun = options.sources?.length
    ? options.sources
    : Object.keys(SCRAPERS)

  console.log(`\nRunning ${sourcesToRun.length} sources: ${sourcesToRun.join(', ')}`)

  // Run all sources in parallel
  const promises = sourcesToRun.map(async (sourceKey) => {
    const scraperFn = SCRAPERS[sourceKey]
    if (!scraperFn) {
      console.error(`Unknown source: ${sourceKey}`)
      return null
    }
    return processSource(sourceKey, scraperFn, fingerprints)
  })

  const partialResults = await Promise.all(promises)

  for (const r of partialResults) {
    if (r) results.push(r)
  }

  // Save fingerprints
  saveFingerprints(fingerprints)

  // Build weekly Top 5 if requested
  if (options.weekly) {
    await buildWeeklyTop5()
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('Scraper Results:')
  for (const result of results) {
    const status = result.errors.length ? `⚠️ ${result.errors.length} errors` : '✓'
    console.log(`  ${result.source}: ${result.articles.length} articles ${status}`)
  }
  console.log(`Total fingerprints: ${Object.keys(fingerprints).length}`)
  console.log('='.repeat(60))
}

/**
 * Rebuild fingerprints from existing markdown files
 */
export async function rebuildFingerprints(): Promise<number> {
  console.log('Rebuilding fingerprints from disk...')
  const fingerprints = rebuildFingerprintsFromDisk()
  saveFingerprints(fingerprints)
  console.log(`Rebuilt ${Object.keys(fingerprints).length} fingerprints`)
  return Object.keys(fingerprints).length
}

/**
 * Build weekly Top 5 from recent articles
 */
export async function buildWeeklyTop5(): Promise<void> {
  console.log('\nBuilding Weekly Top 5...')

  // Load articles from content/posts
  if (!existsSync(CONTENT_DIR)) {
    console.log('No content directory found')
    return
  }

  const files = readdirSync(CONTENT_DIR).filter((f: string) => f.endsWith('.md'))
  const articles: { title: string; source: string; date: string; url: string }[] = []

  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), 'utf-8')
    if (!content.startsWith('---')) continue

    const parts = content.split('---', 3)
    if (parts.length < 2) continue

    const fm: Record<string, string> = {}
    for (const line of parts[1].split('\n')) {
      const colonIdx = line.indexOf(':')
      if (colonIdx < 0) continue
      const key = line.slice(0, colonIdx).trim()
      const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
      fm[key] = val
    }

    if (fm.source && !['autohome', 'ifeng', 'sina', 'pcauto'].some(s => fm.source.toLowerCase().includes(s))) {
      continue
    }

    if (fm.category === 'weekly' || fm.draft === 'true') continue

    try {
      const date = new Date(fm.date || '1970-01-01')
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      if (date > weekAgo) {
        articles.push({
          title: fm.title || 'Unknown',
          source: fm.source || '',
          date: fm.date || '',
          url: fm.original_url || ''
        })
      }
    } catch {
      // Skip invalid dates
    }
  }

  if (!articles.length) {
    console.log('No recent articles for weekly Top 5')
    return
  }

  // Sort by date descending and take top 5
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const top5 = articles.slice(0, 5)

  // Generate weekly article
  const isoWeek = getISOWeek(new Date())
  const year = new Date().getFullYear()

  let body = `# Top 5 chinesische E-Autos diese Woche\n\n`
  body += `*KW ${isoWeek}, ${new Date().toLocaleDateString('de-DE')}*\n\n`

  for (let i = 0; i < top5.length; i++) {
    const art = top5[i]
    const dateStr = new Date(art.date).toLocaleDateString('de-DE')
    const linkStr = art.url ? `[Quelle](${art.url})` : ''
    body += `${i + 1}. **${art.title}** — ${art.source} (${dateStr}) ${linkStr}\n`
  }

  body += '\n---\n*Kuratiert aus den besten chinesischen E-Auto-Nachrichten der Woche.*'

  const frontmatter = `---
title: "Top 5 chinesische E-Autos diese Woche"
date: ${new Date().toISOString()}
description: "Die fünf wichtigsten chinesischen E-Auto-Nachrichten dieser Woche"
source: "Weekly"
category: "weekly"
tags: ["Top 5", "China", "E-Auto"]
draft: false
---

`

  const filename = resolve(CONTENT_DIR, `weekly-top5-${year}-W${String(isoWeek).padStart(2, '0')}.md`)
  writeFileSync(filename, frontmatter + body, 'utf-8')

  console.log(`Weekly Top 5 saved: ${filename}`)
  logRun('weekly', `Top 5 KW ${isoWeek}`, 'weekly_published')
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export { scrapeAutohome, scrapeIfeng, scrapeSina, scrapePCauto, scrapeAutohomeNewEnergy, scrapeOfweekNev, scrapeChooseAuto }
