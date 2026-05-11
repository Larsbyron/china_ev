#!/usr/bin/env npx tsx
/**
 * tweet-latest.ts
 *
 * Finds the most recent article not yet tweeted, posts it to X/Twitter,
 * and records it in tweet-log.json to avoid duplicates.
 *
 * Usage:
 *   npx tsx scripts/tweet-latest.ts
 *   npx tsx scripts/tweet-latest.ts --dry-run
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import matter from 'gray-matter'
import { TwitterApi } from 'twitter-api-v2'

const POSTS_DIR = resolve(process.cwd(), 'content/posts')
const TWEET_LOG = resolve(process.cwd(), 'tweet-log.json')
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://china-autonews.de').trim()
const DRY_RUN = process.argv.includes('--dry-run')

const BRAND_HASHTAGS: Record<string, string> = {
  'BYD': '#BYD',
  'NIO': '#NIO',
  'XPeng': '#XPeng',
  'Li Auto': '#LiAuto',
  'Geely': '#Geely',
  'Zeekr': '#Zeekr',
  'Tesla': '#Tesla',
  'Volkswagen': '#VW',
  'Audi': '#Audi',
  'BMW': '#BMW',
  'Xiaomi': '#Xiaomi',
  'Haval': '#Haval',
  'Leapmotor': '#Leapmotor',
}

function loadTweetLog(): Set<string> {
  if (!existsSync(TWEET_LOG)) return new Set()
  const data = JSON.parse(readFileSync(TWEET_LOG, 'utf-8')) as string[]
  return new Set(data)
}

function saveTweetLog(slugs: Set<string>): void {
  writeFileSync(TWEET_LOG, JSON.stringify([...slugs], null, 2), 'utf-8')
}

function buildTweet(slug: string, title: string, description: string, brand?: string): string {
  const url = `${SITE_URL}/articles/${slug}/`
  const brandTag = brand && BRAND_HASHTAGS[brand] ? ` ${BRAND_HASHTAGS[brand]}` : ''
  const hashtags = `#ElektroAuto #ChinaEV #EV${brandTag}`

  // Twitter counts all URLs as 23 chars (t.co shortlink)
  const TWITTER_URL_LENGTH = 23
  const separator = '\n\n'
  // Fixed overhead: URL (23) + two separators + hashtags
  const fixedLength = TWITTER_URL_LENGTH + separator.length * 2 + hashtags.length
  const available = 280 - fixedLength

  // Split available space: title gets up to 120, rest goes to description
  const maxTitle = Math.min(120, available)
  const shortTitle = title.length > maxTitle ? title.slice(0, maxTitle - 1) + '…' : title

  const maxDesc = available - shortTitle.length - 1 // -1 for the \n between title and desc
  const shortDesc = description && maxDesc > 20
    ? description.length > maxDesc
      ? description.slice(0, maxDesc - 1) + '…'
      : description
    : ''

  return [
    shortTitle,
    shortDesc ? `\n${shortDesc}` : '',
    `${separator}${url}`,
    `${separator}${hashtags}`,
  ].join('')
}

async function main() {
  console.log(`Tweet Latest Article — ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log('─'.repeat(50))

  // Load all published articles, sorted newest first
  const files = readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .sort()
    .reverse()

  const tweetLog = loadTweetLog()

  // Find first article not yet tweeted
  let target: { slug: string; title: string; description: string; brand?: string } | null = null

  for (const file of files) {
    const content = readFileSync(resolve(POSTS_DIR, file), 'utf-8')
    const { data } = matter(content)
    if (data.draft) continue

    const slug = file.replace(/\.md$/, '')
    if (tweetLog.has(slug)) continue

    target = {
      slug,
      title: data.title as string,
      description: data.description as string,
      brand: data.brand as string | undefined,
    }
    break
  }

  if (!target) {
    console.log('No new articles to tweet.')
    return
  }

  const tweet = buildTweet(target.slug, target.title, target.description, target.brand)

  console.log(`Article: ${target.title}`)
  console.log(`\nTweet preview (${tweet.length} chars):\n`)
  console.log('─'.repeat(50))
  console.log(tweet)
  console.log('─'.repeat(50))

  if (DRY_RUN) {
    console.log('\n(dry run — not posted)')
    return
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  })

  const { data: posted } = await client.v2.tweet(tweet)
  console.log(`\n✓ Tweeted! ID: ${posted.id}`)
  console.log(`  https://twitter.com/ChinaEVNews_DE/status/${posted.id}`)

  tweetLog.add(target.slug)
  saveTweetLog(tweetLog)
}

main().catch(e => {
  console.error('Tweet failed:', e.message || e)
  process.exit(1)
})
