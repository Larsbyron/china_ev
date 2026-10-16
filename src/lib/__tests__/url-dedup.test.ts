import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import {
  canonicalizeSourceUrl,
  extractOriginalUrl,
  buildPublishedUrlIndex,
  isAlreadyPublishedUrl,
  recordPublishedUrl,
  isUrlDedupEnabled,
} from '../scraper/url-dedup'

afterEach(() => {
  delete process.env.DEDUP_URL_ENABLED
})

// 真实脏数据：双 host 伪 URL（sina 源抽取 bug），实测在 content/posts 里被发了 24 次。
const SINA_DOUBLE =
  'https://auto.sina.com.cn//auto.sina.com.cn/news/2026-06-04/detail-iniaeyvy0638789.shtml'
const SINA_CLEAN = 'https://auto.sina.com.cn/news/2026-06-04/detail-iniaeyvy0638789.shtml'

describe('url-dedup / canonicalizeSourceUrl', () => {
  it('repairs the real double-host sina pseudo-URL to the clean single-host form', () => {
    expect(canonicalizeSourceUrl(SINA_DOUBLE)).toBe(
      'auto.sina.com.cn/news/2026-06-04/detail-iniaeyvy0638789.shtml'
    )
    // 干净写法与本就会归一到同一 canonical（因此二者会被判为同一篇）
    expect(canonicalizeSourceUrl(SINA_CLEAN)).toBe(
      'auto.sina.com.cn/news/2026-06-04/detail-iniaeyvy0638789.shtml'
    )
    expect(canonicalizeSourceUrl(SINA_DOUBLE)).toBe(canonicalizeSourceUrl(SINA_CLEAN))
  })

  it('strips protocol (http/https/uppercase)', () => {
    expect(canonicalizeSourceUrl('http://example.com/a')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('https://example.com/a')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('HTTPS://Example.com/a')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('//example.com/a')).toBe('example.com/a')
  })

  it('lowercases host but preserves path case', () => {
    expect(canonicalizeSourceUrl('https://WWW.CarNewsChina.COM/Zeekr-8X')).toBe(
      'carnewschina.com/Zeekr-8X'
    )
  })

  it('removes leading www.', () => {
    expect(canonicalizeSourceUrl('https://www.autohome.com.cn/news/1.html')).toBe(
      'autohome.com.cn/news/1.html'
    )
  })

  it('removes a trailing slash but keeps the root host', () => {
    expect(canonicalizeSourceUrl('https://example.com/a/')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('https://www.example.com/')).toBe('example.com')
  })

  it('drops the fragment', () => {
    expect(canonicalizeSourceUrl('https://example.com/a#section')).toBe('example.com/a')
  })

  it('removes tracking query params but keeps meaningful ones (conservative)', () => {
    expect(canonicalizeSourceUrl('https://example.com/a?utm_source=wx&id=42')).toBe(
      'example.com/a?id=42'
    )
    expect(canonicalizeSourceUrl('https://example.com/a?utm_source=weibo')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('https://example.com/a?from=homepage')).toBe('example.com/a')
    expect(canonicalizeSourceUrl('https://example.com/a?spm=a1.b2&share_token=zzz')).toBe(
      'example.com/a'
    )
    // 拿不准的参数一律保留（宁漏不误）
    expect(canonicalizeSourceUrl('https://example.com/a?page=2&q=byd')).toBe(
      'example.com/a?page=2&q=byd'
    )
  })

  it('handles query-only URLs and empty input', () => {
    expect(canonicalizeSourceUrl('https://example.com?utm_source=a')).toBe('example.com')
    expect(canonicalizeSourceUrl('https://example.com?page=2')).toBe('example.com?page=2')
    expect(canonicalizeSourceUrl('')).toBe('')
    expect(canonicalizeSourceUrl('   ')).toBe('')
  })

  it('keeps genuinely different articles apart (3 real pairs), even when they look alike', () => {
    const pairs: [string, string][] = [
      // ofweek：同栏目同批次，仅文章号不同
      [
        'https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html',
        'https://nev.ofweek.com/2026-05/ART-71008-8220-30688339.html',
      ],
      // autohome：仅日期目录不同
      [
        'http://www.autohome.com.cn/news/202605/1314459.html',
        'http://www.autohome.com.cn/news/202607/1315753.html',
      ],
      // sina 双 host：仅 detail-id 不同
      [
        'https://auto.sina.com.cn//auto.sina.com.cn/news/2026-06-04/detail-iniaeyvy0638789.shtml',
        'https://auto.sina.com.cn//auto.sina.com.cn/news/2026-06-17/detail-inicsrqv7101734.shtml',
      ],
    ]
    for (const [a, b] of pairs) {
      expect(canonicalizeSourceUrl(a), `${a} vs ${b}`).not.toBe(canonicalizeSourceUrl(b))
    }
  })
})

describe('url-dedup / extractOriginalUrl', () => {
  it('parses the single-line form', () => {
    const md = `---
title: "x"
original_url: https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html
date: 2026-05-01
---

body`
    expect(extractOriginalUrl(md)).toEqual({
      url: 'https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html',
      style: 'inline',
    })
  })

  it('parses the quoted single-line form', () => {
    const md = `---\noriginal_url: "https://example.com/a"\n---\n`
    expect(extractOriginalUrl(md)).toEqual({ url: 'https://example.com/a', style: 'inline' })
  })

  it('parses the real ">-" block-scalar form (292 posts use this)', () => {
    // 取自 content/posts/2026-04-05-byds-new-ev-is-luring-in-buyers-with-5-minute-char-electrek-a4d949.md
    const md = `---
title: >-
  BYDs neues E-Auto lockt Käufer
date: 2026-04-05T14:08:12.894Z
description: >-
  BYD hat den Song Ultra EV in China eingeführt.
original_url: >-
  https://electrek.co/2026/04/03/byds-new-ev-lures-buyers-with-5-min-charging-low-prices/
primaryTopic: modelle-marktstarts
brands:
  - BYD
---`
    expect(extractOriginalUrl(md)).toEqual({
      url: 'https://electrek.co/2026/04/03/byds-new-ev-lures-buyers-with-5-min-charging-low-prices/',
      style: 'block',
    })
  })

  it('returns null (never throws, never empty string) when original_url is absent', () => {
    // 真实情况：14 篇 weekly-top5 没有 original_url 字段
    const weekly = `---
title: "Top 5 chinesische E-Autos diese Woche"
date: 2026-10-14T00:00:00.000Z
source: "Weekly"
category: "weekly"
draft: false
---

# Top 5`
    expect(extractOriginalUrl(weekly)).toBeNull()
    expect(extractOriginalUrl('not-markdown')).toBeNull()
    expect(extractOriginalUrl('')).toBeNull()
  })

  it('returns null for an empty block scalar (no continuation line)', () => {
    const md = `---\noriginal_url: >-\nprimaryTopic: x\n---\n`
    expect(extractOriginalUrl(md)).toBeNull()
  })
})

describe('url-dedup / buildPublishedUrlIndex + isAlreadyPublishedUrl', () => {
  function makePostsDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'url-dedup-'))
    // 单行写法
    writeFileSync(
      join(dir, '2026-05-01-ofweek-ofweek_nev-aaa.md'),
      `---\ntitle: "a"\noriginal_url: https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html\ndate: 2026-05-01\n---\n\nbody\n`
    )
    // 同一源 URL 的第二次发布（再写一次）
    writeFileSync(
      join(dir, '2026-05-02-ofweek-ofweek_nev-bbb.md'),
      `---\ntitle: "b"\noriginal_url: https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html\ndate: 2026-05-02\n---\n\nbody\n`
    )
    // 块标量写法
    writeFileSync(
      join(dir, '2026-04-05-electrek-electrek-ccc.md'),
      `---\ntitle: >-\n  x\noriginal_url: >-\n  https://electrek.co/2026/04/03/byds-new-ev-lures-buyers-with-5-min-charging-low-prices/\nbrands:\n  - BYD\n---\n\nbody\n`
    )
    // 无 original_url 的周报文（必须被忽略而不是互相误判）
    writeFileSync(
      join(dir, 'weekly-top5-2026-W42.md'),
      `---\ntitle: "Top 5"\ncategory: "weekly"\ndraft: false\n---\n\nbody\n`
    )
    return dir
  }

  it('builds the index from both frontmatter styles and ignores url-less files', () => {
    const dir = makePostsDir()
    const { urls, stats } = buildPublishedUrlIndex(dir)
    expect(urls.size).toBe(2)
    expect(urls.has('nev.ofweek.com/2026-05/ART-71008-8220-30687004.html')).toBe(true)
    expect(urls.has('electrek.co/2026/04/03/byds-new-ev-lures-buyers-with-5-min-charging-low-prices')).toBe(true)
    expect(stats.files).toBe(4)
    expect(stats.withUrl).toBe(3)
    expect(stats.withoutUrl).toBe(1)
    expect(stats.blockStyle).toBe(1)
    expect(stats.inlineStyle).toBe(2)
    expect(stats.distinctUrls).toBe(2)
    expect(stats.redundantPosts).toBe(1)
  })

  it('flags a re-published URL and clears a genuinely new one', () => {
    const index = buildPublishedUrlIndex(makePostsDir())
    expect(isAlreadyPublishedUrl('https://nev.ofweek.com/2026-05/ART-71008-8220-30687004.html', index)).toBe(true)
    // 块标量写入的 electrek URL 也能被命中（写法归一后一致）
    expect(isAlreadyPublishedUrl(
      'https://electrek.co/2026/04/03/byds-new-ev-lures-buyers-with-5-min-charging-low-prices/',
      index
    )).toBe(true)
    expect(isAlreadyPublishedUrl('https://nev.ofweek.com/2026-05/NEW-9999.html', index)).toBe(false)
  })

  it('matches a double-host candidate against a clean published URL', () => {
    const dir = mkdtempSync(join(tmpdir(), 'url-dedup-sina-'))
    writeFileSync(
      join(dir, '2026-06-04-sina-sina-ddd.md'),
      `---\ntitle: "x"\noriginal_url: ${SINA_CLEAN}\ndate: 2026-06-04\n---\n\nbody\n`
    )
    const index = buildPublishedUrlIndex(dir)
    expect(isAlreadyPublishedUrl(SINA_DOUBLE, index)).toBe(true)
  })

  it('returns an empty index for a missing dir without throwing', () => {
    const { urls, stats } = buildPublishedUrlIndex(join(tmpdir(), 'does-not-exist-xyz'))
    expect(urls.size).toBe(0)
    expect(stats.files).toBe(0)
  })

  it('never judges an empty/garbage candidate as already published', () => {
    const index = buildPublishedUrlIndex(makePostsDir())
    expect(isAlreadyPublishedUrl('', index)).toBe(false)
    expect(isAlreadyPublishedUrl('   ', index)).toBe(false)
  })

  it('recordPublishedUrl makes a freshly published URL hit on the next check', () => {
    const index = buildPublishedUrlIndex(makePostsDir())
    const fresh = 'https://carnewschina.com/2026/05/03/sunday-china-drive-zeekr-8x-ultra-plus-tested-with-885-hp-hybrid-europe-en'
    expect(isAlreadyPublishedUrl(fresh, index)).toBe(false)
    recordPublishedUrl(fresh, index)
    expect(isAlreadyPublishedUrl(fresh, index)).toBe(true)
  })
})

describe('url-dedup / kill switch', () => {
  it('DEDUP_URL_ENABLED defaults to enabled', () => {
    expect(isUrlDedupEnabled()).toBe(true)
    expect(isUrlDedupEnabled(undefined)).toBe(true)
    expect(isUrlDedupEnabled('')).toBe(true)
  })

  it('reads off-values as disabled and everything else as enabled', () => {
    for (const off of ['0', 'false', 'no', 'off', 'FALSE', ' 0 ']) {
      expect(isUrlDedupEnabled(off), off).toBe(false)
    }
    for (const on of ['1', 'true', 'yes', 'on', 'anything']) {
      expect(isUrlDedupEnabled(on), on).toBe(true)
    }
  })

  it('honours the env var', () => {
    process.env.DEDUP_URL_ENABLED = '0'
    expect(isUrlDedupEnabled()).toBe(false)
    delete process.env.DEDUP_URL_ENABLED
    expect(isUrlDedupEnabled()).toBe(true)
  })
})
