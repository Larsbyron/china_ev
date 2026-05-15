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

// dotenvx injects env vars before Node starts — parse .env directly to bypass it
import { parse } from 'dotenv'
import { readFileSync as _readFileSync, existsSync as _existsSync } from 'fs'

function loadEnv(): Record<string, string> {
  const envPath = new URL('../.env', import.meta.url)
  if (_existsSync(envPath)) return parse(_readFileSync(envPath))
  return {}
}
const _localEnv = loadEnv()

function getEnv(key: string): string {
  return _localEnv[key] || process.env[key] || ''
}

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import matter from 'gray-matter'
import { TwitterApi } from 'twitter-api-v2'
import {
  type TweetLogEntry,
  MAX_TWEETS_PER_DAY,
  MIN_INTERVAL_MS,
  normalizeTweetLog,
  tweetsToday,
  lastTweetTime,
} from '../src/lib/tweet-throttle.js'

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

// Per-model hashtags. Matched against the title in order — first hit wins, so
// list the more specific patterns first (e.g. "Audi RS 5" before plain "Audi").
// Only one model tag is added per tweet to keep hashtag noise low.
const MODEL_HASHTAGS: Array<[RegExp, string]> = [
  [/Xiaomi\s+YU7|\bYU7\b/i, '#XiaomiYU7'],
  [/Xiaomi\s+SU7|\bSU7\b/i, '#XiaomiSU7'],
  [/ID\.?\s*ERA\s*9X/i, '#IDera9X'],
  [/Audi\s+RS\s*5/i, '#AudiRS5'],
  [/Audi\s+E7X/i, '#AudiE7X'],
  [/BYD\s+Atto\s+3|\bAtto\s+3\b/i, '#Atto3'],
  [/Denza\s+B[58]/i, '#Denza'],
  [/Fangchengbao|\bBao\s+[578]\b/i, '#Fangchengbao'],
  [/Leapmotor\s+D19/i, '#LeapmotorD19'],
  [/Aion\s+N60/i, '#AionN60'],
  [/Luxeed\s+V[0-9]+/i, '#Luxeed'],
  [/Li\s+Auto\s+L[0-9]+/i, '#LiAutoL9'],
  [/Voyah\s+(Dream|Taishan|Zhiyin)/i, '#Voyah'],
  [/Zeekr\s+[0-9X]+/i, '#Zeekr'],
]

function pickModelHashtag(title: string): string | null {
  for (const [pattern, tag] of MODEL_HASHTAGS) {
    if (pattern.test(title)) return tag
  }
  return null
}

function loadTweetLog(): TweetLogEntry[] {
  if (!existsSync(TWEET_LOG)) return []
  return normalizeTweetLog(JSON.parse(readFileSync(TWEET_LOG, 'utf-8')))
}

function saveTweetLog(entries: TweetLogEntry[]): void {
  writeFileSync(TWEET_LOG, JSON.stringify(entries, null, 2), 'utf-8')
}

// Twitter 推文必须只含德语 — 剥离 CJK 字符（汉字、假名、韩文、全角标点）
// 1) 含 CJK 的括号片段整体替换为空格：Li Auto (理想) → Li Auto
// 2) 剩余 CJK 字符序列替换为空格：Das的大型SUV → Das SUV
// 3) 清理空括号、修剪标点前空格、折叠多余空格
const CJK_RANGES = '\\u3000-\\u303f\\u3040-\\u309f\\u30a0-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uac00-\\ud7af\\uff00-\\uffef'
const CJK_PAREN_FRAGMENT = new RegExp(`[（(][^)）]*[${CJK_RANGES}]+[^)）]*[)）]`, 'g')
const CJK_CHARS = new RegExp(`[${CJK_RANGES}]+`, 'g')
const EMPTY_PARENS = /\s*[（(]\s*[)）]/g

function stripCJK(text: string): string {
  if (!text) return text
  return text
    .replace(CJK_PAREN_FRAGMENT, ' ')
    .replace(CJK_CHARS, ' ')
    .replace(EMPTY_PARENS, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildTweet(slug: string, title: string, description: string, brand?: string): string {
  const url = `${SITE_URL}/articles/${slug}/`
  const brandTag = brand && BRAND_HASHTAGS[brand] ? BRAND_HASHTAGS[brand] : null
  const modelTag = pickModelHashtag(title)
  const extraTags = [brandTag, modelTag]
    .filter((t): t is string => t !== null)
    .filter((t, i, arr) => arr.indexOf(t) === i) // dedupe identical hashtags
    .join(' ')
  const hashtags = `#ElektroAuto #ChinaEV #EV${extraTags ? ' ' + extraTags : ''}`

  title = stripCJK(title)
  description = stripCJK(description)

  // Twitter counts all URLs as 23 chars (t.co shortlink)
  const TWITTER_URL_LENGTH = 23
  const separator = '\n\n'
  // Fixed overhead: URL (23) + two separators + hashtags
  const fixedLength = TWITTER_URL_LENGTH + separator.length * 2 + hashtags.length
  const available = 275 - fixedLength

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

  // Fail loud on missing Twitter credentials so we don't burn a slot only
  // to get an opaque OAuth error from the API later.
  if (!DRY_RUN) {
    const missing = [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_TOKEN_SECRET',
    ].filter((k) => !getEnv(k))
    if (missing.length > 0) {
      console.error(`Missing Twitter credentials: ${missing.join(', ')}`)
      process.exit(1)
    }
  }

  const tweetLog = loadTweetLog()
  // Only treat slugs with a real tweetedAt as "already tweeted". Entries with
  // tweetedAt: null are legacy/ghost records left behind by old pipeline bugs
  // (tweet log got committed, tweet never actually went out). Skipping those
  // here lets the throttle retry them.
  const tweetedSlugs = new Set(
    tweetLog.filter((e) => e.tweetedAt !== null).map((e) => e.slug),
  )

  // Throttle 1: daily cap
  const todayCount = tweetsToday(tweetLog)
  if (todayCount >= MAX_TWEETS_PER_DAY) {
    console.log(`Daily cap reached (${todayCount}/${MAX_TWEETS_PER_DAY}) — skipping.`)
    return
  }

  // Throttle 2: minimum interval since last tweet
  const lastAt = lastTweetTime(tweetLog)
  if (lastAt !== null) {
    const elapsedMs = Date.now() - lastAt
    if (elapsedMs < MIN_INTERVAL_MS) {
      const elapsedMin = Math.floor(elapsedMs / 60000)
      const needMin = Math.ceil(MIN_INTERVAL_MS / 60000)
      console.log(`Only ${elapsedMin} min since last tweet — need ≥ ${needMin} min. Skipping.`)
      return
    }
  }

  // Load all published articles, sorted newest first
  const files = readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .sort()
    .reverse()

  // Find first article not yet tweeted
  let target: { slug: string; title: string; description: string; brand?: string } | null = null

  for (const file of files) {
    const content = readFileSync(resolve(POSTS_DIR, file), 'utf-8')
    const { data } = matter(content)
    if (data.draft) continue

    const slug = file.replace(/\.md$/, '')
    if (tweetedSlugs.has(slug)) continue

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
    appKey: getEnv('TWITTER_API_KEY'),
    appSecret: getEnv('TWITTER_API_SECRET'),
    accessToken: getEnv('TWITTER_ACCESS_TOKEN'),
    accessSecret: getEnv('TWITTER_ACCESS_TOKEN_SECRET'),
  })

  const { data: posted } = await client.v2.tweet(tweet)
  console.log(`\n✓ Tweeted! ID: ${posted.id}`)
  console.log(`  https://twitter.com/i/web/status/${posted.id}`)

  tweetLog.push({ slug: target.slug, tweetedAt: new Date().toISOString() })
  try {
    saveTweetLog(tweetLog)
  } catch (err) {
    // The tweet was already posted at this point — failing to persist the
    // log means the next cron run will repost the same article. Surface
    // loudly so it shows up in the GitHub Actions failure email; the only
    // mitigation is manual: edit tweet-log.json on main to add the slug.
    console.error(
      `⚠️  Tweet posted (${posted.id}) but FAILED to update tweet-log.json. ` +
      `Next run will repost — add slug manually: ${target.slug}`,
    )
    console.error(err)
    process.exit(1)
  }
}

main().catch(e => {
  console.error('Tweet failed:', e.message || e)
  if (e.data) console.error('API response:', JSON.stringify(e.data, null, 2))
  if (e.code) console.error('Error code:', e.code)
  process.exit(1)
})
