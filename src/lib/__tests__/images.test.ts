import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('sharp', () => ({
  default: vi.fn(),
}))

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}))

import { downloadImage, convertToWebP, saveImage, buildAbsoluteImageUrl, downloadAndSaveImage } from '../images'
import sharp from 'sharp'
import * as fsMod from 'node:fs/promises'

const mockSharp = vi.mocked(sharp)
const mockMkdir = vi.mocked(fsMod.mkdir)
const mockWriteFile = vi.mocked(fsMod.writeFile)

function makeSharpChain(toBufferResult = Buffer.from('fake-webp')) {
  const chain = {
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(toBufferResult),
  }
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()
  mockMkdir.mockResolvedValue(undefined)
  mockWriteFile.mockResolvedValue(undefined)
  mockSharp.mockReturnValue(makeSharpChain() as any)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ── downloadImage ─────────────────────────────────────────────────────────────

describe('downloadImage', () => {
  function stubFetch(ok: boolean, contentType: string, data: ArrayBuffer | null = new ArrayBuffer(100)) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 404,
      headers: { get: (h: string) => h === 'content-type' ? contentType : null },
      arrayBuffer: vi.fn().mockResolvedValue(data),
    }))
  }

  it('returns Buffer on successful image fetch', async () => {
    const bytes = Buffer.from('jpeg-bytes')
    stubFetch(true, 'image/jpeg', bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
    const result = await downloadImage('https://example.com/photo.jpg')
    expect(result).toBeInstanceOf(Buffer)
    expect((result as Buffer).length).toBeGreaterThan(0)
  })

  it('returns null when response is not ok (e.g. 404)', async () => {
    stubFetch(false, 'text/html')
    expect(await downloadImage('https://example.com/missing.jpg')).toBeNull()
  })

  it('returns null when content-type is not an image', async () => {
    stubFetch(true, 'text/html')
    expect(await downloadImage('https://example.com/page.html')).toBeNull()
  })

  it('returns null when content-type is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => null },
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(100)),
    }))
    expect(await downloadImage('https://example.com/unknown')).toBeNull()
  })

  it('returns null when fetch throws (network error / timeout)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network failure')))
    expect(await downloadImage('https://example.com/photo.jpg')).toBeNull()
  })
})

// ── convertToWebP ─────────────────────────────────────────────────────────────

describe('convertToWebP', () => {
  it('calls sharp with correct defaults (1200px wide, quality 80)', async () => {
    const input = Buffer.from('raw-image')
    const chain = makeSharpChain(Buffer.from('webp-out'))
    mockSharp.mockReturnValue(chain as any)

    const result = await convertToWebP(input)

    expect(mockSharp).toHaveBeenCalledWith(input)
    expect(chain.resize).toHaveBeenCalledWith(1200, undefined, { withoutEnlargement: true })
    expect(chain.webp).toHaveBeenCalledWith({ quality: 80 })
    expect(result).toBeInstanceOf(Buffer)
  })

  it('respects custom maxWidth', async () => {
    const chain = makeSharpChain()
    mockSharp.mockReturnValue(chain as any)

    await convertToWebP(Buffer.from('img'), { maxWidth: 800 })
    expect(chain.resize).toHaveBeenCalledWith(800, undefined, { withoutEnlargement: true })
  })

  it('respects custom quality', async () => {
    const chain = makeSharpChain()
    mockSharp.mockReturnValue(chain as any)

    await convertToWebP(Buffer.from('img'), { quality: 60 })
    expect(chain.webp).toHaveBeenCalledWith({ quality: 60 })
  })

  it('never upscales images smaller than maxWidth', async () => {
    const chain = makeSharpChain()
    mockSharp.mockReturnValue(chain as any)

    await convertToWebP(Buffer.from('small'))
    const [, , resizeOpts] = chain.resize.mock.calls[0]
    expect(resizeOpts.withoutEnlargement).toBe(true)
  })
})

// ── saveImage ─────────────────────────────────────────────────────────────────

describe('saveImage', () => {
  it('creates directory recursively and writes file', async () => {
    const buf = Buffer.from('webp-data')
    await saveImage(buf, 'my-article')

    expect(mockMkdir).toHaveBeenCalledWith(
      expect.stringContaining('public/images'),
      { recursive: true }
    )
    expect(mockWriteFile).toHaveBeenCalledWith(
      expect.stringContaining('my-article.webp'),
      buf
    )
  })

  it('returns local path /images/<slug>.webp', async () => {
    const localPath = await saveImage(Buffer.from('data'), 'byd-launches-ev')
    expect(localPath).toBe('/images/byd-launches-ev.webp')
  })

  it('sanitizes slug to safe filename (no spaces or special chars)', async () => {
    await saveImage(Buffer.from('data'), 'article with spaces & symbols!')
    const writePath = String(mockWriteFile.mock.calls[0][0])
    const filename = writePath.split('/').pop() ?? ''
    expect(filename).not.toMatch(/[ &!]/)
    expect(writePath).toMatch(/\.webp$/)
  })
})

// ── buildAbsoluteImageUrl ─────────────────────────────────────────────────────

describe('buildAbsoluteImageUrl', () => {
  it('prepends siteUrl to local path', () => {
    expect(buildAbsoluteImageUrl('/images/foo.webp', 'https://chinaev.vercel.app'))
      .toBe('https://chinaev.vercel.app/images/foo.webp')
  })

  it('returns empty string for empty input', () => {
    expect(buildAbsoluteImageUrl('')).toBe('')
  })

  it('returns empty string for null/undefined input', () => {
    expect(buildAbsoluteImageUrl(null as unknown as string)).toBe('')
    expect(buildAbsoluteImageUrl(undefined as unknown as string)).toBe('')
  })

  it('returns external URLs unchanged', () => {
    const ext = 'https://cdn.cnevpost.com/photo.jpg'
    expect(buildAbsoluteImageUrl(ext, 'https://chinaev.vercel.app')).toBe(ext)
  })

  it('reads NEXT_PUBLIC_SITE_URL env var as fallback', () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_SITE_URL = 'https://env.example.com'
    try {
      expect(buildAbsoluteImageUrl('/images/bar.webp')).toBe('https://env.example.com/images/bar.webp')
    } finally {
      process.env.NEXT_PUBLIC_SITE_URL = original
    }
  })

  it('falls back to empty string when no siteUrl and no env var', () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.NEXT_PUBLIC_SITE_URL
    try {
      expect(buildAbsoluteImageUrl('/images/baz.webp')).toBe('')
    } finally {
      process.env.NEXT_PUBLIC_SITE_URL = original
    }
  })
})

// ── downloadAndSaveImage ──────────────────────────────────────────────────────

describe('downloadAndSaveImage', () => {
  it('downloads, converts, saves and returns local path', async () => {
    const raw = Buffer.from('raw-jpeg')
    const webp = Buffer.from('converted-webp')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: (h: string) => h === 'content-type' ? 'image/jpeg' : null },
      arrayBuffer: vi.fn().mockResolvedValue(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength)),
    }))
    const chain = makeSharpChain(webp)
    mockSharp.mockReturnValue(chain as any)

    const result = await downloadAndSaveImage('https://example.com/img.jpg', 'test-article')
    expect(result).toBe('/images/test-article.webp')
    expect(mockWriteFile).toHaveBeenCalledWith(expect.stringContaining('test-article.webp'), webp)
  })

  it('returns null when download fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const result = await downloadAndSaveImage('https://example.com/img.jpg', 'test-article')
    expect(result).toBeNull()
  })

  it('returns null when image URL is empty', async () => {
    const result = await downloadAndSaveImage('', 'test-article')
    expect(result).toBeNull()
  })
})
