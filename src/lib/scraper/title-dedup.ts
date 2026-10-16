// 同批次近重复标题抑制（翻译前）——与 dedup.ts 的 SHA-256 精确去重互补。
//
// 背景（真实事故）：2026-10-15 那轮 CI（gh run 38799987786）里 ChooseAuto 一次抓到 8 篇
// 待翻，其中 3 篇是同一个「捷途全新旅行者 7」上市稿——来自不同 URL、标题措辞不同：
//   智驾升级全能出行，全新旅行者 7 焕新上市 12.59 万起
//   方盒子市场变天后，捷途全新旅行者7的“可城可野可旅行”到底在回应什么？
//   全新旅行者7全球上市，树立7系方盒子新标杆，12.59万起
// 三篇各跑了一遍翻译 + QA + 编辑审核，约 3 次 LLM 调用被白烧（占该轮 54 次调用的 ~6%）。
// SHA-256 指纹只能挡「源文一字不差」，挡不住「同一件事、不同标题」。
//
// 本模块只做一件事：在同一批候选里，如果两篇标题指向同一件事，只留信息量最大的那篇。
//
// ============================ 为什么是这个算法 / 阈值 ============================
// 三条真实标题归一化后（NFKC + 去标点空白 + 小写）：
//   J1 智驾升级全能出行 全新旅行者 7 焕新上市 12 59 万起
//   J2 方盒子市场变天后 捷途全新旅行者7的 可城可野可旅行 到底在回应什么
//   J3 全新旅行者7全球上市 树立7系方盒子新标杆 12 59 万起
// 三者共享一段连续子串「全新旅行者7」（6 个字符，含中文）。
//
// 关键教训：单靠「一个」字符串相似度阈值救不了这个场景。
// 反面样例「BYD Atto 2 2027」vs「BYD Atto 3 2027」只差 1 个字符：字符 bigram Jaccard
// 约 0.69、词级 Jaccard 0.60，远高于 J1/J3 的词级 Jaccard（约 0.41）。任何
// 单调的字符串相似度都会把 Atto 2/3 排在捷途三连「更相似」的前面，因此不可能
// 靠单一阈值既合并捷途三连、又保留 Atto 2/3。
//
// 于是用两个正交信号做 OR：
//   (A) 词级 token 集合 Jaccard ≥ DEDUP_TITLE_SIMILARITY（默认 0.75）
//       —— 抓「几乎一字不差」的标题（也覆盖 CarNewsChina 之类的英文稿）。
//   (B) 共享的、含中文的连续子串长度 ≥ DEDUP_TITLE_ANCHOR_MIN（默认 6）
//       —— 抓「同一车型/事件、措辞完全不同」的中文标题；捷途三连靠这条。
// Atto 2/3 的共享前缀「bydatto」不含中文 → (B) 不触发；(A) 只有 0.60 < 0.75 → 两篇都留。
// 「小鹏 MONA L05 预售」vs「华为五界该怎么选」两条都不触发 → 都留。
//
// 保守性：宁漏不能误杀。阈值 0.75 偏严，宁可漏掉一些「同一件事」的改写，也不误杀。
// (B) 是本模块唯一可能误杀的信号（两篇不同事件若恰好共享 ≥6 字中文专有名词会中招），
// 定在 6 而不是 4/5，就是为了压低这种误判；实测语料里的误伤样例见提交说明。
// ==============================================================================
//
// 范围边界：只对「同一批次内的候选」生效（每个 source 一轮抓到的文章列表）。
// 跨天（与最近已发布文章比标题）只写 [Dedup] would-skip (dry-run) 日志，不跳转，
// 留作日后拿数据决定是否开启。

import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import type { Article } from '../article'

/** 词级 Jaccard 阈值：抓「几乎一字不差」的标题。 */
export const DEFAULT_TITLE_SIMILARITY = 0.75
/** 共享含中文连续子串阈值：抓「同车型/事件、措辞不同」的标题。 */
export const DEFAULT_TITLE_ANCHOR_MIN = 6
/** 跨天 dry-run 参照窗口（天）。 */
export const DEFAULT_CROSSDAY_WINDOW_DAYS = 14

const HAN = /\p{sc=Han}/u

export interface TitleDedupOptions {
  /** 覆盖 DEDUP_TITLE_SIMILARITY 阈值。 */
  similarity?: number
  /** 覆盖 DEDUP_TITLE_ANCHOR_MIN 阈值。 */
  anchorMin?: number
  /** 覆盖 DEDUP_TITLE_ENABLED 开关。 */
  enabled?: boolean
}

function parseBoolFlag(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined || raw.trim() === '') return fallback
  return !/^(0|false|no|off)$/i.test(raw.trim())
}

/** 一键开关：DEDUP_TITLE_ENABLED（默认开）。设为 0/false/no/off 即整条链路停用。 */
export function isTitleDedupEnabled(): boolean {
  return parseBoolFlag(process.env.DEDUP_TITLE_ENABLED, true)
}

/** DEDUP_TITLE_SIMILARITY（默认 0.75）。非法值回退默认。 */
export function getTitleSimilarityThreshold(): number {
  const v = Number(process.env.DEDUP_TITLE_SIMILARITY)
  return Number.isFinite(v) && v > 0 && v <= 1 ? v : DEFAULT_TITLE_SIMILARITY
}

/** DEDUP_TITLE_ANCHOR_MIN（默认 6）。非法值回退默认。 */
export function getTitleAnchorMin(): number {
  const v = Number(process.env.DEDUP_TITLE_ANCHOR_MIN)
  return Number.isFinite(v) && v > 0 ? Math.floor(v) : DEFAULT_TITLE_ANCHOR_MIN
}

// ---------------------------------------------------------------------------
// 归一化
// ---------------------------------------------------------------------------

// 源站名尾巴清单（小写匹配）。标题形如 "… - CarNewsChina" / "… | ChooseAuto" 时剥掉。
const KNOWN_SOURCE_SUFFIXES = [
  'carnewschina', 'chooseauto', 'autohome', 'ifeng', 'sina', 'pcauto',
  'ofweek', 'ofweek nev', 'd1ev', 'gasgoo', 'car news china',
  '汽车之家', '易车', '凤凰网汽车', '凤凰汽车', '新浪汽车', '太平洋汽车',
  '盖世汽车', '第一电动网', '第一电动', '维科网', '电动邦', '电车汇',
]
// 一般化的源站尾巴启发式：仅当尾巴看起来像站名（含 car/auto/news/china 或中文站名关键词）才剥。
const SOURCE_TAIL_HINT = /(car|auto|news|motors?|china|汽车|之家|电动|车网|网\b)/i

/**
 * 剥掉标题末尾的源站后缀，如 "… - CarNewsChina"、"… | ChooseAuto"。
 * 只剥「分隔符 + 尾巴」形式的末尾段，且尾巴必须像站名，避免误剥正文。
 */
export function stripSourceSuffix(title: string): string {
  if (!title) return title
  // 末尾一段由 |｜-–—_丨 之一分隔；尾巴里不含分隔符、长度 1..30。
  const m = title.match(/^(.*?)\s*[|｜\-–—_丨]\s*([^|｜\-–—_丨]{1,30})\s*$/u)
  if (!m) return title
  const head = m[1].trim()
  const tail = m[2].trim()
  if (!head || !tail) return title
  const tailLower = tail.toLowerCase()
  const known = KNOWN_SOURCE_SUFFIXES.includes(tailLower) || SOURCE_TAIL_HINT.test(tail)
  return known ? head : title
}

/**
 * 标题归一化：NFKC → 去源站后缀 → 小写 → 标点/符号→空白 → 折叠空白。
 * 结果保留词间单空格（供分词）；比较时再压缩掉空格。
 */
export function normalizeTitle(raw: string): string {
  if (!raw) return ''
  let s = raw.normalize('NFKC')
  s = stripSourceSuffix(s.trim())
  s = s.toLowerCase()
  s = s.replace(/[\p{P}\p{S}]/gu, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

/** 比较用压缩串（去空白），用于「共享连续子串」判定。 */
export function compactTitle(raw: string): string {
  return normalizeTitle(raw).replace(/\s+/g, '')
}

// ---------------------------------------------------------------------------
// 相似度
// ---------------------------------------------------------------------------

let segmenter: Intl.Segmenter | null | undefined

function getSegmenter(): Intl.Segmenter | null {
  if (segmenter === undefined) {
    try {
      segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
    } catch {
      segmenter = null
    }
  }
  return segmenter
}

/** 仅测试用：清掉分词器缓存。 */
export function __resetSegmenterCache(): void {
  segmenter = undefined
}

/**
 * 词级 token：用 Intl.Segmenter 切词（中文按词典、拉丁按空格）。
 * 没有 Segmenter 时回退到「拉丁/数字串 + 单个汉字」。
 */
export function titleTokens(normalized: string): string[] {
  if (!normalized) return []
  const seg = getSegmenter()
  if (!seg) {
    return normalized.match(/[a-z0-9]+|[\u3400-\u9fff]|[\uf900-\ufaff]/gu) ?? []
  }
  const out: string[] = []
  for (const part of seg.segment(normalized)) {
    if (part.isWordLike) out.push(part.segment)
  }
  return out
}

/** token 集合 Jaccard 系数。任一侧为空 → 0（空标题绝不判重）。 */
export function tokenJaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter)
}

/**
 * 两串最长的「含至少一个汉字」的公共连续子串。
 * 关键：只接受含汉字的候选，因此 "bydatto22027"/"bydatto32027" 这类
 * 纯拉丁公共前缀（不含汉字）不会被当作 anchor。
 */
export function longestCommonCjkSubstring(a: string, b: string): string {
  if (!a || !b) return ''
  const n = a.length
  const m = b.length
  const cjkPrefix = new Uint16Array(n + 1)
  for (let i = 0; i < n; i++) cjkPrefix[i + 1] = cjkPrefix[i] + (HAN.test(a[i]) ? 1 : 0)

  let prev = new Uint16Array(m + 1)
  let bestLen = 0
  let bestEnd = -1 // a 中下标（不含）
  for (let i = 1; i <= n; i++) {
    const cur = new Uint16Array(m + 1)
    const ai = a[i - 1]
    for (let j = 1; j <= m; j++) {
      if (ai !== b[j - 1]) continue
      const len = prev[j - 1] + 1
      cur[j] = len
      if (len > bestLen) {
        const start = i - len
        if (cjkPrefix[i] - cjkPrefix[start] > 0) {
          bestLen = len
          bestEnd = i
        }
      }
    }
    prev = cur
  }
  return bestEnd < 0 ? '' : a.slice(bestEnd - bestLen, bestEnd)
}

export interface TitleComparison {
  /** 是否判定为同一件事。 */
  duplicate: boolean
  /** 词级 token Jaccard。 */
  jaccard: number
  /** 含汉字公共连续子串长度。 */
  anchor: number
  /** 命中的信号。 */
  reason: 'jaccard' | 'anchor' | 'none'
}

/** 比较两个标题，返回是否近重复及打分（供日志/回放使用）。 */
export function compareTitles(a: string, b: string, opts: TitleDedupOptions = {}): TitleComparison {
  const similarity = opts.similarity ?? getTitleSimilarityThreshold()
  const anchorMin = opts.anchorMin ?? getTitleAnchorMin()

  const na = normalizeTitle(a)
  const nb = normalizeTitle(b)
  if (!na || !nb) return { duplicate: false, jaccard: 0, anchor: 0, reason: 'none' }

  const jaccard = tokenJaccard(new Set(titleTokens(na)), new Set(titleTokens(nb)))
  const anchor = longestCommonCjkSubstring(na.replace(/\s+/g, ''), nb.replace(/\s+/g, '')).length

  const byJaccard = jaccard >= similarity
  const byAnchor = anchorMin > 0 && anchor >= anchorMin
  return {
    duplicate: byJaccard || byAnchor,
    jaccard,
    anchor,
    reason: byJaccard ? 'jaccard' : byAnchor ? 'anchor' : 'none',
  }
}

// ---------------------------------------------------------------------------
// 同批次抑制
// ---------------------------------------------------------------------------

export interface BatchTitleSkip {
  /** 被跳过的文章。 */
  skipped: Article
  /** 视为同一件事、被保留的对照文章。 */
  kept: Article
  jaccard: number
  anchor: number
  reason: string
}

export interface BatchTitleDedupResult {
  kept: Article[]
  skipped: BatchTitleSkip[]
  enabled: boolean
}

/** 信息量代理：源文长度优先，其次标题长度。用于在重复簇里挑「信息量最大」的一篇。 */
function infoScore(a: Article): number {
  return a.content.length * 1_000_000 + a.title.length
}

/**
 * 同批次近重复标题抑制。
 * 先按标题把候选聚成「同一件事」的簇（单链接），再在每个簇里保留信息量最大的一篇，
 * 其余记为 skipped（对照对象统一指向该簇最终保留的那篇）。
 * 关闭开关（DEDUP_TITLE_ENABLED=0）时原样返回全部候选。
 */
export function dedupeBatchTitles(
  articles: Article[],
  opts: TitleDedupOptions = {}
): BatchTitleDedupResult {
  const enabled = opts.enabled ?? isTitleDedupEnabled()
  if (!enabled) {
    return { kept: [...articles], skipped: [], enabled: false }
  }

  // 第一遍：聚类。空标题不参与判重，各自成簇。
  const clusters: { members: Article[]; empty: boolean }[] = []
  for (const article of articles) {
    const empty = !normalizeTitle(article.title)
    let found = -1
    if (!empty) {
      for (let c = 0; c < clusters.length; c++) {
        if (clusters[c].empty) continue
        if (clusters[c].members.some((m) => compareTitles(m.title, article.title, opts).duplicate)) {
          found = c
          break
        }
      }
    }
    if (found < 0) {
      clusters.push({ members: [article], empty })
    } else {
      clusters[found].members.push(article)
    }
  }

  // 第二遍：每簇保留信息量最大的一篇，其余记为跳过。
  const kept: Article[] = []
  const skipped: BatchTitleSkip[] = []
  for (const cluster of clusters) {
    const members = cluster.members
    if (members.length === 1) {
      kept.push(members[0])
      continue
    }
    let rep = members[0]
    for (const a of members) if (infoScore(a) > infoScore(rep)) rep = a
    kept.push(rep)
    for (const a of members) {
      if (a === rep) continue
      const c = compareTitles(rep.title, a.title, opts)
      skipped.push({ skipped: a, kept: rep, jaccard: c.jaccard, anchor: c.anchor, reason: c.reason })
    }
  }

  return { kept, skipped, enabled: true }
}

// ---------------------------------------------------------------------------
// 跨天 dry-run（只观测、不跳过）
// ---------------------------------------------------------------------------

export interface PublishedTitleRef {
  title: string
  date: string
  source: string
  file: string
}

export interface CrossDayHit {
  published: PublishedTitleRef
  jaccard: number
  anchor: number
  reason: string
}

let recentCache: { days: number; dir: string; refs: PublishedTitleRef[] } | null = null

/** 仅测试用：清掉已发布标题缓存。 */
export function __resetPublishedTitleCache(): void {
  recentCache = null
}

function parseFrontmatterTitle(content: string): string {
  const m = content.match(/^title:\s*(.+)$/m)
  if (!m) return ''
  return m[1].trim().replace(/^["']|["']$/g, '')
}

/**
 * 读取最近 N 天已发布文章的标题（按文件名日期前缀过滤，避免读全部 3k 文件）。
 * 标题是德文译文——与中文候选通常不会撞上，所以这条链路只做 dry-run 观测。
 */
export function loadRecentPublishedTitles(
  withinDays = DEFAULT_CROSSDAY_WINDOW_DAYS,
  contentDir = resolve(process.cwd(), 'content', 'posts'),
  { useCache = true }: { useCache?: boolean } = {}
): PublishedTitleRef[] {
  if (useCache && recentCache && recentCache.days === withinDays && recentCache.dir === contentDir) {
    return recentCache.refs
  }

  const refs: PublishedTitleRef[] = []
  if (!existsSync(contentDir)) return refs

  const cutoff = new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  for (const file of readdirSync(contentDir)) {
    if (!file.endsWith('.md')) continue
    const dateStr = file.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue
    if (dateStr < cutoffStr) continue // 文件名即日期，无需读文件

    let content: string
    try {
      content = readFileSync(join(contentDir, file), 'utf-8')
    } catch {
      continue
    }
    if (!content.startsWith('---')) continue
    if (/(^|\n)draft:\s*true\b/.test(content)) continue

    const title = parseFrontmatterTitle(content)
    if (!title) continue

    const sourceMatch = content.match(/^source:\s*["']?([^"'\n]+)["']?$/m)
    refs.push({ title, date: dateStr, source: sourceMatch ? sourceMatch[1].trim() : '', file })
  }

  if (useCache) recentCache = { days: withinDays, dir: contentDir, refs }
  return refs
}

/** 在已发布标题里找第一条近重复（dry-run 用）。找不到返回 null。 */
export function findCrossDayDuplicates(
  title: string,
  published: PublishedTitleRef[],
  opts: TitleDedupOptions = {}
): CrossDayHit | null {
  let best: CrossDayHit | null = null
  for (const ref of published) {
    const c = compareTitles(title, ref.title, opts)
    if (!c.duplicate) continue
    if (!best || c.jaccard > best.jaccard || (c.jaccard === best.jaccard && c.anchor > best.anchor)) {
      best = { published: ref, jaccard: c.jaccard, anchor: c.anchor, reason: c.reason }
    }
  }
  return best
}
