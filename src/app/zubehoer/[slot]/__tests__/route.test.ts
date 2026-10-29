import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { AFFILIATE_SLOTS, buildAffiliateUrl, slotById } from '@/lib/affiliate'
import {
  bumpIpQuota,
  currentDay,
  hashIp,
  recordClick,
} from '@/lib/affiliate-clicks'
import { GET } from '../route'

/**
 * Integration test for the affiliate hop (`/zubehoer/[slot]/`).
 *
 * The whole KV layer is mocked out on purpose: `@/lib/affiliate-clicks` is the
 * only thing this route uses from it (bumpIpQuota / currentDay / hashIp /
 * recordClick), so replacing those four exports with vi.fn()s removes
 * `@vercel/kv` and its network/credential needs entirely. The KV helpers'
 * own behaviour (key shape, retry, TTL, quota arithmetic) belongs to
 * src/lib/__tests__ and is not the subject here — what is pinned here is the
 * route contract: which slot ids redirect, that unknown ids never do, and that
 * counting can neither block nor break the redirect.
 *
 * Note vi.mock replaces the module before `../route` is imported (vitest
 * hoists the call and the imports are evaluated after the mock registry is
 * primed), so no @vercel/kv instance is ever constructed.
 */
vi.mock('@/lib/affiliate-clicks', () => ({
  bumpIpQuota: vi.fn(),
  currentDay: vi.fn(),
  hashIp: vi.fn(),
  recordClick: vi.fn(),
}))

const bumpIpQuotaMock = vi.mocked(bumpIpQuota)
const currentDayMock = vi.mocked(currentDay)
const hashIpMock = vi.mocked(hashIp)
const recordClickMock = vi.mocked(recordClick)

const DAY = '2026-10-28'
const IP = '203.0.113.7'

function makeRequest(
  slot: string,
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(`https://china-autonews.de/zubehoer/${slot}/`, {
    headers,
  })
}

/** Route params are a Promise in Next 15. */
function ctx(slot: string): { params: Promise<{ slot: string }> } {
  return { params: Promise.resolve({ slot }) }
}

/**
 * A click as a real browser sends it: Chrome/Safari/Firefox all attach the
 * three Sec-Fetch headers to a top-level link navigation from our own page.
 */
const NAVIGATION = {
  'sec-fetch-mode': 'navigate',
  'sec-fetch-dest': 'document',
  'sec-fetch-site': 'same-origin',
}

/** The 302 contract: independent of whether the request was counted. */
function expectRedirect(res: Response, slot: string) {
  expect(res.status).toBe(302)
  expect(res.headers.get('location')).toBe(
    buildAffiliateUrl(slotById(slot) as NonNullable<ReturnType<typeof slotById>>)
  )
  expect(res.headers.get('cache-control')).toContain('no-store')
  expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow')
}

beforeEach(() => {
  vi.clearAllMocks()
  currentDayMock.mockReturnValue(DAY)
  hashIpMock.mockImplementation((ip: string) => `sha:${ip}`)
  bumpIpQuotaMock.mockResolvedValue(true)
  recordClickMock.mockResolvedValue(undefined)
})

describe('GET /zubehoer/[slot] — unknown slots', () => {
  test.each([
    ['evil', 'plain unknown id'],
    ['', 'empty id'],
    ['laden/../../x', 'path traversal'],
    ['https://evil.example', 'absolute url'],
    ['//evil.example', 'protocol-relative url'],
    ['laden?tag=evil-21', 'query injection'],
  ])('answers 404 (never 3xx) for %j (%s)', async (slot) => {
    const res = await GET(makeRequest(slot, NAVIGATION), ctx(slot))

    expect(res.status).toBe(404)
    // The core assertion: a crafted slot must never become a redirect.
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.headers.get('location')).toBeNull()
    // Nothing is counted for a slot that does not exist.
    expect(recordClickMock).not.toHaveBeenCalled()
    expect(bumpIpQuotaMock).not.toHaveBeenCalled()
  })
})

describe('GET /zubehoer/[slot] — known slots', () => {
  test.each(AFFILIATE_SLOTS.map((slot) => slot.id))(
    'redirects %s to its Amazon URL with no-store / noindex headers',
    async (slotId) => {
      const res = await GET(makeRequest(slotId, NAVIGATION), ctx(slotId))
      const target = buildAffiliateUrl(slotById(slotId) as NonNullable<ReturnType<typeof slotById>>)

      expect(res.status).toBe(302)
      expect(res.headers.get('location')).toBe(target)
      // Tag + per-slot attribution survive the hop.
      const url = new URL(res.headers.get('location') as string)
      expect(url.searchParams.get('tag')).toBe('byronbai-21')
      expect(url.searchParams.get('ascsubtag')).toBe(`cev-zubehoer-${slotId}`)
      // A counted click must never be cached or indexed.
      expect(res.headers.get('cache-control')).toContain('no-store')
      expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    }
  )
})

describe('GET /zubehoer/[slot] — counting', () => {
  test('a navigation click is counted exactly once, with the Berlin day', async () => {
    const res = await GET(
      makeRequest('dashcam', {
        ...NAVIGATION,
        'x-forwarded-for': `${IP}, 10.0.0.1`,
      }),
      ctx('dashcam')
    )

    expect(res.status).toBe(302)
    expect(recordClickMock).toHaveBeenCalledTimes(1)
    expect(recordClickMock).toHaveBeenCalledWith('dashcam', DAY)
    // Quota is keyed on the first X-Forwarded-For hop, hashed — never the raw IP.
    expect(hashIpMock).toHaveBeenCalledWith(IP)
    expect(bumpIpQuotaMock).toHaveBeenCalledTimes(1)
    expect(bumpIpQuotaMock).toHaveBeenCalledWith(`sha:${IP}`, DAY, 30)
  })

  test('a crawler-style request without Sec-Fetch-* and without Referer redirects but is not counted', async () => {
    // The 2026-10-28 inflation: 41 "clicks" over 158 page views, split evenly
    // over three slots — a crawler following every /zubehoer/ link on a page.
    // It sends neither Sec-Fetch-* nor a useful Referer.
    const res = await GET(makeRequest('reifen'), ctx('reifen'))

    // The redirect is unconditional — the verdict only ever gates counting.
    expectRedirect(res, 'reifen')
    expect(recordClickMock).not.toHaveBeenCalled()
    expect(bumpIpQuotaMock).not.toHaveBeenCalled()
  })

  test('same-site (www./subdomain) and cross-site (share link) navigations are counted', async () => {
    // Real clicks that are not same-origin must not be lost: `www.` vs apex is
    // same-site, a share link from a forum is cross-site. Both still carry
    // mode:navigate + dest:document, which no plain crawler forges.
    for (const site of ['same-site', 'cross-site']) {
      vi.clearAllMocks()
      bumpIpQuotaMock.mockResolvedValue(true)
      recordClickMock.mockResolvedValue(undefined)

      const res = await GET(
        makeRequest('laden', { ...NAVIGATION, 'sec-fetch-site': site }),
        ctx('laden')
      )

      expectRedirect(res, 'laden')
      expect(recordClickMock).toHaveBeenCalledTimes(1)
    }
  })

  test('sec-fetch-site: none (typed URL, bookmark, Googlebot direct crawl) is not counted', async () => {
    const res = await GET(
      makeRequest('dashcam', { ...NAVIGATION, 'sec-fetch-site': 'none' }),
      ctx('dashcam')
    )

    expectRedirect(res, 'dashcam')
    expect(recordClickMock).not.toHaveBeenCalled()
  })

  test('a navigation missing Sec-Fetch-Site but carrying our Referer is counted', async () => {
    const res = await GET(
      makeRequest('dashcam', {
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'document',
        referer: 'https://china-autonews.de/ratgeber/dashcam-test/',
      }),
      ctx('dashcam')
    )

    expectRedirect(res, 'dashcam')
    expect(recordClickMock).toHaveBeenCalledTimes(1)
  })

  test('no Sec-Fetch-* at all — even with our own Referer — is not counted', async () => {
    // A header the attacker fully controls (Referer) is not proof of a browser:
    // every current browser adds Sec-Fetch-*, so its absence outweighs it.
    const res = await GET(
      makeRequest('reifen', { referer: 'https://china-autonews.de/ratgeber/' }),
      ctx('reifen')
    )

    expectRedirect(res, 'reifen')
    expect(recordClickMock).not.toHaveBeenCalled()
  })

  test('a forged cross-site Referer without Sec-Fetch-Site is not counted', async () => {
    const res = await GET(
      makeRequest('reifen', {
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'document',
        referer: 'https://spam.example/',
      }),
      ctx('reifen')
    )

    expectRedirect(res, 'reifen')
    expect(recordClickMock).not.toHaveBeenCalled()
  })

  test('a non-browser fetch (mode: cors / no-cors, dest: empty) is not counted', async () => {
    for (const headers of [
      { 'sec-fetch-mode': 'cors', 'sec-fetch-dest': 'empty', 'sec-fetch-site': 'cross-site' },
      { 'sec-fetch-mode': 'no-cors', 'sec-fetch-dest': 'image', 'sec-fetch-site': 'cross-site' },
    ]) {
      vi.clearAllMocks()
      const res = await GET(makeRequest('laden', headers), ctx('laden'))

      expectRedirect(res, 'laden')
      expect(recordClickMock).not.toHaveBeenCalled()
    }
  })

  test('<img src="/zubehoer/…"> is redirected but not counted', async () => {
    const res = await GET(
      makeRequest('laden', { 'sec-fetch-dest': 'image' }),
      ctx('laden')
    )

    // Still redirects — the hop stays harmless for non-navigation requests.
    expectRedirect(res, 'laden')
    // But it must not inflate the click counter.
    expect(recordClickMock).not.toHaveBeenCalled()
    expect(bumpIpQuotaMock).not.toHaveBeenCalled()
  })

  test('a rejected recordClick does not cost the visitor the redirect', async () => {
    recordClickMock.mockRejectedValue(new Error('kv down'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await GET(makeRequest('dashcam', NAVIGATION), ctx('dashcam'))

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(
      buildAffiliateUrl(slotById('dashcam') as NonNullable<ReturnType<typeof slotById>>)
    )
    // The failure is logged, not swallowed.
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  test('a hung KV (promise that never settles) still redirects after the 800 ms cap', async () => {
    // Fake timers, deliberately: the route races the KV block against an
    // 800 ms setTimeout. On the wall clock that would cost ~0.8 s of real
    // waiting per run for a pure timing assertion; the fake clock makes the
    // assertion exact ("not before 800 ms, resolved after") instead of an
    // 800–1500 ms tolerance that goes flaky on a loaded machine.
    //
    // The liveness check uses a flag set by .then(), not Promise.race against
    // an already-resolved sentinel: the sentinel always wins the microtask
    // race while GET is still building its response, so it would report
    // "pending" even with the timeout deleted (verified by mutation).
    vi.useFakeTimers()
    try {
      recordClickMock.mockImplementation(() => new Promise<void>(() => {}))
      const pending = GET(makeRequest('dashcam', NAVIGATION), ctx('dashcam'))
      let settled: Response | null = null
      pending.then((res) => {
        settled = res
      })
      pending.catch(() => {})

      // Drain pending microtasks (0 ms) — GET must still be blocked on the
      // hung KV. This is what fails when the Promise.race cap is removed.
      await vi.advanceTimersByTimeAsync(0)
      expect(settled).toBeNull()

      // … still blocked just before the cap …
      await vi.advanceTimersByTimeAsync(700)
      expect(settled).toBeNull()

      // … and the redirect goes out once COUNT_TIMEOUT_MS elapses.
      await vi.advanceTimersByTimeAsync(200)
      const res = await pending
      expect(settled).not.toBeNull()

      expect(res.status).toBe(302)
      expect(res.headers.get('location')).toBe(
        buildAffiliateUrl(slotById('dashcam') as NonNullable<ReturnType<typeof slotById>>)
      )
      // Record was attempted once and then abandoned — never retried here.
      expect(recordClickMock).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })

  test('an exhausted daily IP quota redirects without counting', async () => {
    bumpIpQuotaMock.mockResolvedValue(false)
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const res = await GET(makeRequest('reifen', NAVIGATION), ctx('reifen'))

    expect(res.status).toBe(302)
    expect(recordClickMock).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
