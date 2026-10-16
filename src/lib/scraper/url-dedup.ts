// 翻译前的「源 URL 身份去重」——与 dedup.ts 的 SHA-256 精确去重互补。
//
// 背景（真实泄漏，本人实测 2026-10-16，脚本 ~/.hermes/cache/scratch/cev_url_repeats.py）：
//   content/posts/ 共 3,086 篇；原始源 URL 出现 >1 次的有 343 个 URL，累计 1,944 篇冗余稿
//   （典型：nev.ofweek.com 某篇被发了 140 次；同一个 carnewschina URL 被重复发 54 次）。
//   泄漏仍在继续：10-14 一天就有 5 组重复。
//
// 为什么 SHA-256 指纹挡不住：现有去重键 = 源文内容哈希（dedup.ts / processed_articles.json）。
// 实测该文件里 102 个相同源标题对应多个不同 hash —— 同一篇文章重抓时，抽取到的正文文本
// 变了（页面 chrome/时间戳/推荐位等），hash 就变，去重不命中，于是重复翻译发布。
//
//   → 源 URL 本身是稳定、零误杀的键：同一 URL 重新翻译发布永远是冗余；
//     不同文章 URL 必然不同。所以在翻译之前就用「已发布过的源 URL」拦掉。
//
// 范围：只做「URL 身份」这一件事。不改 SHA-256 逻辑、不放宽任何 QA 判定、不动 prompt。
// ==============================================================================

import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'

/** 明确的跟踪参数名（小写精确匹配）。宁漏不误：只删这个白名单。 */
const TRACKING_PARAMS_EXACT = new Set(['from', 'spm', 'share_token'])
/** 展示性 query 参数前缀（小写）。`utm_*` 全族。 */
const TRACKING_PARAMS_PREFIX = ['utm_']

/** 一键开关：DEDUP_URL_ENABLED（默认开）。设为 0/false/no/off 即整条链路停用。 */
export function isUrlDedupEnabled(raw: string | undefined = process.env.DEDUP_URL_ENABLED): boolean {
  if (raw === undefined || raw.trim() === '') return true
  return !/^(0|false|no|off)$/i.test(raw.trim())
}

function isTrackingParam(name: string): boolean {
  const n = name.toLowerCase()
  if (TRACKING_PARAMS_EXACT.has(n)) return true
  return TRACKING_PARAMS_PREFIX.some((p) => n.startsWith(p))
}

/** 过滤 query 串里的跟踪参数，保留其余（含无 `=` 的裸参数）。空串返回 ''。 */
function filterTrackingParams(query: string): string {
  if (!query) return ''
  const kept: string[] = []
  for (const pair of query.split('&')) {
    if (pair === '') continue
    const eq = pair.indexOf('=')
    const name = eq < 0 ? pair : pair.slice(0, eq)
    if (isTrackingParam(name)) continue
    kept.push(pair)
  }
  return kept.join('&')
}

/**
 * 归一化源 URL，得到一个稳定、可比较的 canonical 形式。
 *
 * 操作（保守优先：拿不准的一律保留，宁漏不误）：
 *   - trim，去两侧引号
 *   - 去协议（http/https/任意 scheme://）
 *   - 去 fragment（`#锚点` 不标识另一篇文章）
 *   - host 小写、去 `www.`、去 userinfo
 *   - 折叠前导斜杠；修复「双 host 伪 URL」`host//host/path` → `host/path`
 *   - 去末尾 `/`
 *   - 仅删除白名单内的跟踪 query 参数（`utm_*`/`from`/`spm`/`share_token`），
 *     其余 query 原样保留
 *
 * 无法归一（空串）时返回 ''，调用方必须把 '' 当作「不判重」。
 */
export function canonicalizeSourceUrl(raw: string): string {
  if (typeof raw !== 'string') return ''
  let s = raw.trim()
  if (!s) return ''

  // 去两侧引号（YAML 字符串写法可能带引号）
  s = s.replace(/^["']+|["']+$/g, '').trim()
  if (!s) return ''

  // 去协议（http、https 以及任意 scheme://），以及 protocol-relative 的前导 //
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
  s = s.replace(/^\/\//, '')

  // 去 fragment
  const hashIdx = s.indexOf('#')
  if (hashIdx >= 0) s = s.slice(0, hashIdx)
  if (!s) return ''

  // 拆分 authority 与 path/query —— 取 '/' 或 '?' 中先出现的一个作为界
  let cut = s.length
  for (const ch of ['/', '?']) {
    const i = s.indexOf(ch)
    if (i >= 0 && i < cut) cut = i
  }
  let authority = s.slice(0, cut).toLowerCase()
  const rest = s.slice(cut)

  // 去 userinfo（user:pass@host）
  const at = authority.lastIndexOf('@')
  if (at >= 0) authority = authority.slice(at + 1)

  const originalAuthority = authority
  const host = authority.replace(/^www\./, '')

  // rest 形如 '' | '/path' | '//path' | '?query' | '/path?query'
  const qIdx = rest.indexOf('?')
  const pathRaw = qIdx >= 0 ? rest.slice(0, qIdx) : rest
  const query = qIdx >= 0 ? rest.slice(qIdx + 1) : ''

  // 双 host 伪 URL 修复：仅当 path 以异常的双斜杠开头时触发，且紧邻的一段必须
  // 恰好等于 host（去 www 前或后）。例：
  //   auto.sina.com.cn//auto.sina.com.cn/news/...  →  auto.sina.com.cn/news/...
  const hadDoubleSlash = pathRaw.startsWith('//')
  let pathPart = pathRaw.replace(/^\/+/, '')
  if (hadDoubleSlash) {
    for (const prefixHost of [originalAuthority, host]) {
      if (!prefixHost) continue
      if (pathPart.toLowerCase().startsWith(prefixHost + '/')) {
        pathPart = pathPart.slice(prefixHost.length).replace(/^\/+/, '')
        break
      }
    }
  }

  // 去末尾 `/`
  pathPart = pathPart.replace(/\/+$/, '')

  const keptQuery = filterTrackingParams(query)

  let out = host
  if (pathPart) out += '/' + pathPart
  if (keptQuery) out += '?' + keptQuery
  return out
}

export interface PublishedUrlIndex {
  /** 已发布稿件的 canonical 源 URL 集合。 */
  urls: Set<string>
  /** 诊断计数（供启动日志）：files/withUrl/withoutUrl/blockStyle/inlineStyle/distinctUrls/redundantPosts。 */
  stats: Record<string, number>
}

const ORIGINAL_URL_KEY = /^original_url:[ \t]*(.*)$/

/**
 * 从单篇 markdown 的 frontmatter 里取出 original_url。
 * 同时支持两种真实写法：
 *   - 单行：  original_url: https://...   （实测 2,774 篇）
 *   - 块标量：original_url: >-             （实测 292 篇）
 *                 https://...   （缩进续行）
 * 没有该字段（实测 14 篇 weekly-top5）→ 返回 null，绝不抛错、绝不返回空串。
 */
export function extractOriginalUrl(content: string): { url: string; style: 'inline' | 'block' } | null {
  if (!content.startsWith('---')) return null
  // frontmatter = 开头 '---' 行到下一个 '---' 行之间
  const end = content.indexOf('\n---', 3)
  const fm = end < 0 ? content.slice(3) : content.slice(3, end)
  const lines = fm.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(ORIGINAL_URL_KEY)
    if (!m) continue
    const value = m[1].trim()

    // 块标量（>- / > / |- / | / 空值）→ 收集后续缩进行
    if (value === '' || value === '>-' || value === '>' || value === '|' || value === '|-') {
      const parts: string[] = []
      for (let j = i + 1; j < lines.length; j++) {
        if (/^[ \t]+\S/.test(lines[j])) parts.push(lines[j].trim())
        else break
      }
      // URL 不含空白；若块标量把长 URL 折行，拼接时不应引入空格
      const url = parts.join('')
      return url ? { url, style: 'block' } : null
    }

    // 单行（可能带引号）
    const url = value.replace(/^["']+|["']+$/g, '').trim()
    return url ? { url, style: 'inline' } : null
  }
  return null
}

/**
 * 扫描 content/posts/*.md 的 frontmatter，构建「已发布源 URL」索引。
 * 不依赖 processed_articles.json，不写任何持久化状态。
 */
export function buildPublishedUrlIndex(
  contentDir: string = resolve(process.cwd(), 'content', 'posts')
): PublishedUrlIndex {
  const urls = new Set<string>()
  const counts = new Map<string, number>()
  const stats: Record<string, number> = {
    files: 0,
    withUrl: 0,
    withoutUrl: 0,
    blockStyle: 0,
    inlineStyle: 0,
    readErrors: 0,
    distinctUrls: 0,
    redundantPosts: 0,
  }

  if (!existsSync(contentDir)) return { urls, stats }

  for (const file of readdirSync(contentDir)) {
    if (!file.endsWith('.md')) continue
    stats.files++

    let content: string
    try {
      content = readFileSync(join(contentDir, file), 'utf-8')
    } catch {
      stats.readErrors++
      continue
    }

    const parsed = extractOriginalUrl(content)
    const canon = parsed ? canonicalizeSourceUrl(parsed.url) : ''
    if (!canon) {
      stats.withoutUrl++
      continue
    }

    stats.withUrl++
    if (parsed && parsed.style === 'block') stats.blockStyle++
    else stats.inlineStyle++

    urls.add(canon)
    counts.set(canon, (counts.get(canon) ?? 0) + 1)
  }

  stats.distinctUrls = urls.size
  let redundant = 0
  for (const c of counts.values()) if (c > 1) redundant += c - 1
  stats.redundantPosts = redundant

  return { urls, stats }
}

/**
 * 候选 URL 是否「已经发布过」。
 * 空/无法归一的候选一律返回 false（宁漏不误：绝不因坏数据误杀）。
 */
export function isAlreadyPublishedUrl(
  candidateUrl: string,
  index: { urls: Set<string> }
): boolean {
  const canon = canonicalizeSourceUrl(candidateUrl)
  if (!canon) return false
  return index.urls.has(canon)
}

/** 把新发布的源 URL 记入索引（转发用；与 SHA-256 写入侧保持对称）。 */
export function recordPublishedUrl(candidateUrl: string, index: { urls: Set<string> }): void {
  const canon = canonicalizeSourceUrl(candidateUrl)
  if (canon) index.urls.add(canon)
}
