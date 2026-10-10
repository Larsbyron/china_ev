/**
 * IndexNow 提交器 — 把站点 URL 即时推送给 Bing / Yandex / Seznam / Naver 等
 * 支持 IndexNow 的搜索引擎（DuckDuckGo、Ecosia、Yahoo 用的是 Bing 索引）。
 *
 * 为什么：实测 30 天被推荐访客里 Bing 系(bing.com 541 + duckduckgo 195 + ecosia 50
 * + yahoo 36) 占 43%，Google 只有 27。新文章靠自然抓取要数周才被收录，
 * IndexNow 是官方 API，能在分钟级通知收录，不需要账号、不需要付费。
 *
 * 用法：npx tsx scripts/indexnow.ts [--limit N] [--dry-run]
 * 密钥文件：public/<KEY>.txt（内容=KEY），IndexNow 会先抓这个文件校验归属。
 */
import fs from 'fs'
import path from 'path'

const HOST = (process.env.NEXT_PUBLIC_SITE_URL || 'https://china-autonews.de')
  .trim()
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
const KEY = 'f520ad31a74f157dfda4db3bf56ff692'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const BATCH = 2000
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

const STATIC_PATHS = ['/', '/articles/', '/themen/', '/deutschland/', '/brands/', '/weekly/']

type Args = { limit: number | null; dryRun: boolean }

function parseArgs(argv: string[]): Args {
  let limit: number | null = null
  let dryRun = false
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--limit') limit = parseInt(argv[++i] || '0', 10) || null
    if (argv[i] === '--dry-run') dryRun = true
  }
  return { limit, dryRun }
}

function collectUrls(limit: number | null): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort().reverse()
  const urls: string[] = STATIC_PATHS.map((p) => `https://${HOST}${p}`)
  for (const file of files) {
    if (limit !== null && urls.length >= limit) break
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    if (/^draft:\s*true\s*$/m.test(raw)) continue
    urls.push(`https://${HOST}/articles/${file.replace(/\.md$/, '')}/`)
  }
  return urls
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function submit(batch: string[]): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch }),
  })
  const text = await res.text().catch(() => '')
  console.log(`[indexnow] ${batch.length} URLs -> HTTP ${res.status} ${text.slice(0, 200)}`)
  if (res.status >= 400) {
    console.warn('[indexnow] 非 2xx（Key 未生效/限流/参数问题），本轮跳过，不影响流水线')
  }
}

async function main(): Promise<void> {
  const { limit, dryRun } = parseArgs(process.argv.slice(2))
  const urls = collectUrls(limit)
  console.log(`[indexnow] host=${HOST} keyLocation=${KEY_LOCATION} urls=${urls.length}`)
  if (dryRun || urls.length === 0) {
    console.log('[indexnow] dry-run 或没有 URL，未提交')
    return
  }
  for (const batch of chunk(urls, BATCH)) {
    try {
      await submit(batch)
    } catch (err) {
      console.warn('[indexnow] 提交失败（网络/接口），跳过：', (err as Error).message)
    }
  }
}

main()
