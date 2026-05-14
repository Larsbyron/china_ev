#!/usr/bin/env npx tsx

/**
 * fetch-translate.ts
 *
 * CLI entry point for the article scraping and translation pipeline.
 * Handles --source, --weekly, and --rebuild-fingerprints flags.
 *
 * Usage:
 *   npx tsx scripts/fetch-translate.ts
 *   npx tsx scripts/fetch-translate.ts --weekly
 *   npx tsx scripts/fetch-translate.ts --rebuild-fingerprints
 *   npx tsx scripts/fetch-translate.ts --source autohome
 */

import * as dotenv from 'dotenv'
import { scrapeAll, rebuildFingerprints } from '@/lib/scraper'

// Load .env file
dotenv.config()

interface CliFlags {
  source?: string
  weekly?: boolean
  rebuildFingerprints?: boolean
}

function parseArgs(): CliFlags {
  const flags: CliFlags = {}
  const args = process.argv.slice(2)

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--source' && i + 1 < args.length) {
      flags.source = args[i + 1]
      i++
    } else if (arg === '--weekly') {
      flags.weekly = true
    } else if (arg === '--rebuild-fingerprints') {
      flags.rebuildFingerprints = true
    }
  }

  return flags
}

async function main() {
  const flags = parseArgs()

  console.log('E-Auto Blog — Fetch & Translate Pipeline')
  console.log('----------------------------------------')

  // Validate API key is present
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set in .env')
    console.error('Copy .env.example to .env and add your API key.')
    process.exit(1)
  }

  try {
    if (flags.rebuildFingerprints) {
      console.log('Rebuilding fingerprints from disk...')
      await rebuildFingerprints()
      console.log('Fingerprints rebuilt successfully.')
      return
    }

    if (flags.weekly) {
      console.log('Running weekly Top 5 pipeline...')
      // Weekly pipeline will call scrapeAll with a weekly flag
      await scrapeAll({ weekly: true })
      console.log('Weekly Top 5 articles fetched and translated.')
      return
    }

    if (flags.source) {
      const validSources = ['autohome', 'ifeng', 'sina', 'pcauto', 'autohome_newenergy', 'ofweek_nev', 'chooseauto', 'd1ev', 'carnewschina']
      if (!validSources.includes(flags.source)) {
        console.error(`Error: Unknown source "${flags.source}". Valid sources: ${validSources.join(', ')}`)
        process.exit(1)
      }
      console.log(`Fetching from source: ${flags.source}`)
      await scrapeAll({ sources: [flags.source] })
      console.log(`Articles from ${flags.source} fetched and translated.`)
      return
    }

    // Default: daily run
    console.log('Running daily fetch pipeline...')
    await scrapeAll({})
    console.log('Daily articles fetched and translated.')
  } catch (error) {
    console.error('Pipeline failed:', error)

    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`)
    }

    process.exit(1)
  }
}

main()