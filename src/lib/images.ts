import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_MAX_WIDTH = 1200
const DEFAULT_QUALITY = 80
const IMAGES_DIR = 'public/images'
const IMAGES_URL_PREFIX = '/images'

const IMAGE_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

export interface ConvertOptions {
  maxWidth?: number
  quality?: number
}

/**
 * Downloads an image from a URL. Returns null if the URL is empty,
 * the request fails, or the response is not an image.
 */
export async function downloadImage(url: string): Promise<Buffer | null> {
  if (!url) return null

  try {
    const res = await fetch(url)
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') ?? ''
    const mimeType = contentType.split(';')[0].trim().toLowerCase()
    if (!IMAGE_CONTENT_TYPES.has(mimeType)) return null

    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

/**
 * Converts a raw image Buffer to WebP at up to maxWidth wide (never upscales).
 */
export async function convertToWebP(input: Buffer, opts: ConvertOptions = {}): Promise<Buffer> {
  const maxWidth = opts.maxWidth ?? DEFAULT_MAX_WIDTH
  const quality = opts.quality ?? DEFAULT_QUALITY

  return sharp(input)
    .resize(maxWidth, undefined, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()
}

/**
 * Writes a WebP buffer to public/images/<sanitizedSlug>.webp.
 * Returns the public URL path, e.g. "/images/my-article.webp".
 */
export async function saveImage(buffer: Buffer, slug: string): Promise<string> {
  const safeSlug = slug.replace(/[^a-z0-9\-_]/gi, '-').replace(/-+/g, '-')
  const filename = `${safeSlug}.webp`
  const dir = path.resolve(process.cwd(), IMAGES_DIR)
  const filePath = path.join(dir, filename)

  await mkdir(dir, { recursive: true })
  await writeFile(filePath, buffer)

  return `${IMAGES_URL_PREFIX}/${filename}`
}

/**
 * Converts a local image path (e.g. "/images/foo.webp") to a full
 * absolute URL using siteUrl or NEXT_PUBLIC_SITE_URL env var.
 * External URLs (starting with http) are returned unchanged.
 * Returns empty string for empty/null/undefined input.
 */
export function buildAbsoluteImageUrl(localPath: string | null | undefined, siteUrl?: string): string {
  if (!localPath) return ''
  if (localPath.startsWith('http')) return localPath

  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
  if (!base) return ''

  return `${base.replace(/\/$/, '')}${localPath}`
}

/**
 * Downloads a remote image, converts to WebP, and saves to public/images/.
 * Returns the local path on success, null on any failure.
 */
export async function downloadAndSaveImage(url: string, slug: string): Promise<string | null> {
  if (!url) return null

  const raw = await downloadImage(url)
  if (!raw) return null

  const webp = await convertToWebP(raw)
  return saveImage(webp, slug)
}

// Brand → best Pexels search query (real car photos, not generic EV stock)
const BRAND_PEXELS_QUERIES: Record<string, string> = {
  byd: 'BYD electric car',
  nio: 'NIO electric car',
  xpeng: 'XPeng electric vehicle',
  'li auto': 'Li Auto electric SUV',
  zeekr: 'Zeekr electric car',
  geely: 'Geely electric vehicle',
  mg: 'MG electric car',
  aito: 'Huawei electric car',
  leapmotor: 'Leapmotor electric vehicle',
  aion: 'GAC Aion electric car',
  chery: 'Chery electric vehicle',
  changan: 'Changan electric car',
  saic: 'SAIC electric vehicle',
  deepblue: 'Chinese electric sedan',
  denza: 'Denza electric car',
  voyah: 'Voyah electric car',
  xiaomi: 'Xiaomi SU7 electric car',
}

/**
 * Searches Pexels for a car photo matching the given brand/title,
 * downloads the result, converts to WebP, and saves locally.
 * Returns the local path on success, null if no key or no results.
 */
export async function fetchPexelsImage(brand: string | null | undefined, title: string, slug: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return null

  const brandKey = (brand ?? '').toLowerCase()
  const query = BRAND_PEXELS_QUERIES[brandKey]
    ?? (brand ? `${brand} electric car` : 'Chinese electric vehicle')

  try {
    const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
    const res = await fetch(searchUrl, {
      headers: { Authorization: apiKey },
    })
    if (!res.ok) return null

    const data = await res.json() as { photos: Array<{ src: { large2x: string } }> }
    if (!data.photos?.length) return null

    // Pick the first photo (Pexels returns relevance-ranked results)
    const photoUrl = data.photos[0].src.large2x
    return downloadAndSaveImage(photoUrl, `pexels-${slug}`)
  } catch {
    return null
  }
}
