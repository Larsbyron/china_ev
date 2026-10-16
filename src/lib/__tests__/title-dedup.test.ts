import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import {
  normalizeTitle,
  compactTitle,
  stripSourceSuffix,
  compareTitles,
  dedupeBatchTitles,
  longestCommonCjkSubstring,
  findCrossDayDuplicates,
  loadRecentPublishedTitles,
  isTitleDedupEnabled,
  getTitleSimilarityThreshold,
  getTitleAnchorMin,
  __resetPublishedTitleCache,
  __resetSegmenterCache,
} from '../scraper/title-dedup'
import type { Article } from '../article'

// 三条真实标题（来自 2026-10-15 那轮 CI，gh run 38799987786 的 ChooseAuto 批次）。
const J1 = '智驾升级全能出行，全新旅行者 7 焕新上市 12.59 万起'
const J2 = '方盒子市场变天后，捷途全新旅行者7的“可城可野可旅行”到底在回应什么？'
const J3 = '全新旅行者7全球上市，树立7系方盒子新标杆，12.59万起'

function article(title: string, content = 'x'.repeat(500), over: Partial<Article> = {}): Article {
  return {
    title,
    content,
    date: '2026-10-15T20:11:00.000Z',
    source: 'ChooseAuto',
    originalUrl: `https://example.com/${encodeURIComponent(title)}`,
    ...over,
  }
}

const ENV_KEYS = ['DEDUP_TITLE_ENABLED', 'DEDUP_TITLE_SIMILARITY', 'DEDUP_TITLE_ANCHOR_MIN'] as const

afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k]
  __resetPublishedTitleCache()
  __resetSegmenterCache()
})

describe('title-dedup / normalizeTitle', () => {
  it('strips punctuation, collapses whitespace, lowercases', () => {
    expect(normalizeTitle(J1)).toBe('智驾升级全能出行 全新旅行者 7 焕新上市 12 59 万起')
    expect(normalizeTitle('BYD   ATTO   2')).toBe('byd atto 2')
  })

  it('applies NFKC so full-width forms collapse to half-width', () => {
    expect(normalizeTitle('ＡＢＣ１２３')).toBe('abc123')
    expect(normalizeTitle('１２．５９')).toBe('12 59')
  })

  it('strips source-site suffixes before comparing', () => {
    expect(normalizeTitle('Xiaomi YU7 startet - CarNewsChina')).toBe('xiaomi yu7 startet')
    expect(normalizeTitle('BYD Atto 2 | ChooseAuto')).toBe('byd atto 2')
    expect(normalizeTitle('比亚迪海豚上市_汽车之家')).toBe('比亚迪海豚上市')
  })

  it('returns empty string for empty input', () => {
    expect(normalizeTitle('')).toBe('')
    expect(compactTitle('   ')).toBe('')
  })
})

describe('title-dedup / stripSourceSuffix', () => {
  it('removes " - Site" / " | Site" tails', () => {
    expect(stripSourceSuffix('标题内容 - CarNewsChina')).toBe('标题内容')
    expect(stripSourceSuffix('BYD Atto 2 | ChooseAuto')).toBe('BYD Atto 2')
  })

  it('leaves a legit non-site tail untouched', () => {
    // 尾巴不像站名 → 不动（宁漏不误杀）
    expect(stripSourceSuffix('Xiaomi YU7 - ein SUV')).toBe('Xiaomi YU7 - ein SUV')
    // 连字符出现在正文词内部时也不能剥
    expect(stripSourceSuffix('华为乾崑 ADS5 加持！全新旅行者 7 C-DM 来了')).toBe(
      '华为乾崑 ADS5 加持！全新旅行者 7 C-DM 来了'
    )
  })
})

describe('title-dedup / compareTitles', () => {
  it('merges the three real Jetour Traveler 7 launch titles (same event, rephrased)', () => {
    for (const [a, b] of [
      [J1, J2],
      [J1, J3],
      [J2, J3],
    ] as const) {
      const c = compareTitles(a, b)
      expect(c.duplicate, `${a} ~ ${b}`).toBe(true)
      // 靠共享中文实体「全新旅行者7」命中，而非靠整体字面相似度
      expect(c.anchor).toBe(6)
      expect(c.reason).toBe('anchor')
    }
  })

  it('keeps genuinely different stories', () => {
    const atto = compareTitles('BYD Atto 2 2027', 'BYD Atto 3 2027')
    expect(atto.duplicate).toBe(false) // 只差一个数字 → 不同车型
    expect(atto.jaccard).toBeGreaterThan(0.5) // 字面确实很像，但没有含中文的 anchor
    expect(atto.anchor).toBe(0)

    const models = compareTitles('小鹏 MONA L05 预售', '华为五界该怎么选')
    expect(models.duplicate).toBe(false)
    expect(models.anchor).toBe(0)
  })

  it('never treats empty titles as duplicates', () => {
    expect(compareTitles('', '比亚迪海豚上市').duplicate).toBe(false)
    expect(compareTitles('   ', '   ').duplicate).toBe(false)
    expect(compareTitles('', '').duplicate).toBe(false)
  })

  it('treats titles differing only by source suffix as duplicates', () => {
    const c = compareTitles('Xiaomi YU7 startet - CarNewsChina', 'Xiaomi YU7 startet | ChooseAuto')
    expect(c.duplicate).toBe(true)
    expect(c.jaccard).toBe(1)
  })

  it('longestCommonCjkSubstring ignores purely-latin overlaps', () => {
    expect(longestCommonCjkSubstring('bydatto22027', 'bydatto32027')).toBe('')
    expect(longestCommonCjkSubstring('全新旅行者7上市', '全新旅行者7发布')).toBe('全新旅行者7')
  })
})

describe('title-dedup / dedupeBatchTitles', () => {
  it('collapses the three real titles to one and keeps the most informative', () => {
    // content 长度贴近真实抓取值：J2 最长 → 保留 J2
    const batch = [
      article(J1, 'a'.repeat(2699)),
      article(J2, 'b'.repeat(3629)),
      article(J3, 'c'.repeat(3077)),
    ]
    const res = dedupeBatchTitles(batch)
    expect(res.enabled).toBe(true)
    expect(res.kept).toHaveLength(1)
    expect(res.kept[0].title).toBe(J2)
    expect(res.skipped).toHaveLength(2)
    expect(res.skipped.map((s) => s.skipped.title).sort()).toEqual([J1, J3].sort())
    for (const s of res.skipped) {
      expect(s.kept.title).toBe(J2)
      expect(s.anchor).toBe(6)
    }
  })

  it('handles the full real 8-article ChooseAuto batch (3 Jetour dupes + 5 distinct)', () => {
    const batch = [
      article(J1, 'a'.repeat(2699)),
      article(J2, 'b'.repeat(3629)),
      article('新能源车的三年贬值陷阱 不全在电池、续航与智驾', 'c'.repeat(2430)),
      article(J3, 'd'.repeat(3077)),
      article('比亚迪大汉上市，196项全系标配，25万级旗舰该有的样子', 'e'.repeat(1420)),
      article('小鹏MONA L05开启预售，16.98万元起瞄准年轻人', 'f'.repeat(2473)),
      article('本周新车预告：上汽大众、比亚迪、捷途等品牌将带来新产品', 'g'.repeat(1432)),
      article('华为五界该怎么选：尚界、智界、尊界、享界、问界', 'h'.repeat(1025)),
    ]
    const res = dedupeBatchTitles(batch)
    expect(res.kept).toHaveLength(6) // 8 - 2
    expect(res.skipped).toHaveLength(2)
    expect(res.kept[0].title).toBe(J2)
    // 其余 5 条各不重复，全部保留
    for (const t of [
      '新能源车的三年贬值陷阱 不全在电池、续航与智驾',
      '比亚迪大汉上市，196项全系标配，25万级旗舰该有的样子',
      '小鹏MONA L05开启预售，16.98万元起瞄准年轻人',
      '本周新车预告：上汽大众、比亚迪、捷途等品牌将带来新产品',
      '华为五界该怎么选：尚界、智界、尊界、享界、问界',
    ]) {
      expect(res.kept.some((a) => a.title === t)).toBe(true)
    }
  })

  it('keeps everything when the kill-switch is off', () => {
    const batch = [article(J1), article(J2), article(J3)]
    const res = dedupeBatchTitles(batch, { enabled: false })
    expect(res.enabled).toBe(false)
    expect(res.kept).toHaveLength(3)
    expect(res.skipped).toHaveLength(0)
  })

  it('keeps empty-title articles untouched (never merged)', () => {
    const batch = [article('', 'x'.repeat(100), { originalUrl: 'u1' }), article('', 'y'.repeat(100), { originalUrl: 'u2' })]
    const res = dedupeBatchTitles(batch)
    expect(res.kept).toHaveLength(2)
    expect(res.skipped).toHaveLength(0)
  })

  it('does nothing for an empty batch', () => {
    const res = dedupeBatchTitles([])
    expect(res.kept).toEqual([])
    expect(res.skipped).toEqual([])
  })
})

describe('title-dedup / config', () => {
  it('defaults: similarity 0.75, anchor 6, enabled', () => {
    expect(getTitleSimilarityThreshold()).toBe(0.75)
    expect(getTitleAnchorMin()).toBe(6)
    expect(isTitleDedupEnabled()).toBe(true)
  })

  it('reads env overrides and falls back on invalid values', () => {
    process.env.DEDUP_TITLE_SIMILARITY = '0.9'
    process.env.DEDUP_TITLE_ANCHOR_MIN = '8'
    process.env.DEDUP_TITLE_ENABLED = '0'
    expect(getTitleSimilarityThreshold()).toBe(0.9)
    expect(getTitleAnchorMin()).toBe(8)
    expect(isTitleDedupEnabled()).toBe(false)

    process.env.DEDUP_TITLE_SIMILARITY = 'nonsense'
    process.env.DEDUP_TITLE_ANCHOR_MIN = '-3'
    process.env.DEDUP_TITLE_ENABLED = 'false'
    expect(getTitleSimilarityThreshold()).toBe(0.75)
    expect(getTitleAnchorMin()).toBe(6)
    expect(isTitleDedupEnabled()).toBe(false)
  })

  it('an explicit higher anchor threshold stops the Jetour trio from merging', () => {
    const c = compareTitles(J1, J3, { anchorMin: 7, similarity: 0.75 })
    expect(c.duplicate).toBe(false)
    expect(c.anchor).toBe(6)
  })
})

describe('title-dedup / cross-day dry-run', () => {
  it('loads recent published titles and flags dry-run duplicates without skipping', () => {
    const dir = mkdtempSync(join(tmpdir(), 'title-dedup-'))
    const sub = join(dir, 'posts')
    mkdirSync(sub)
    const today = new Date().toISOString().slice(0, 10)
    writeFileSync(
      join(sub, `${today}-byd-dolphin-chooseauto-abc123.md`),
      `---\ntitle: "比亚迪海豚上市"\ndate: ${today}\nsource: "ChooseAuto"\ndraft: false\n---\n\nBody\n`,
      'utf-8'
    )
    writeFileSync(
      join(sub, `${today}-jetour-7-chooseauto-def456.md`),
      `---\ntitle: "捷途全新旅行者7上市"\ndate: ${today}\nsource: "ChooseAuto"\ndraft: false\n---\n\nBody\n`,
      'utf-8'
    )
    // 更早的文件（文件名日期太老）应被跳过，不读入
    writeFileSync(
      join(sub, `2000-01-01-old-chooseauto-zzz.md`),
      `---\ntitle: "Old"\ndate: 2000-01-01\nsource: "ChooseAuto"\ndraft: false\n---\n\nBody\n`,
      'utf-8'
    )

    const refs = loadRecentPublishedTitles(14, sub, { useCache: false })
    expect(refs).toHaveLength(2)

    const hit = findCrossDayDuplicates('全新旅行者7全球上市，树立7系方盒子新标杆，12.59万起', refs)
    expect(hit).not.toBeNull()
    expect(hit?.published.title).toBe('捷途全新旅行者7上市')
    expect(hit?.reason).toBe('anchor')

    expect(findCrossDayDuplicates('完全不相关的一条新闻标题', refs)).toBeNull()
  })
})
