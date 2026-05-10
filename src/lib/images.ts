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

// Brand → descriptive adjective used in image prompt
const BRAND_DESCRIPTORS: Record<string, string> = {
  byd:        'BYD',
  nio:        'NIO',
  xpeng:      'XPeng',
  'li auto':  'Li Auto',
  zeekr:      'Zeekr',
  geely:      'Geely',
  mg:         'MG',
  aito:       'AITO Huawei',
  leapmotor:  'Leapmotor',
  aion:       'GAC Aion',
  chery:      'Chery',
  changan:    'Changan',
  saic:       'SAIC',
  denza:      'Denza',
  voyah:      'Voyah',
  xiaomi:     'Xiaomi',
  deepblue:   'Deep Blue',
}

// Detect car type from German title keywords
function detectCarType(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('suv') || t.includes('crossover')) return 'electric SUV'
  if (t.includes('limousine') || t.includes('sedan') || t.includes('saloon')) return 'electric sedan'
  if (t.includes('mpv') || t.includes('minivan') || t.includes('van')) return 'electric MPV'
  if (t.includes('pick') || t.includes('truck')) return 'electric pickup truck'
  if (t.includes('sportwagen') || t.includes('coupé') || t.includes('coupe')) return 'electric sports car'
  return 'electric car'
}

/**
 * Builds a Flux image prompt from brand + article title.
 * Keeps prompts short and photographic — Flux Schnell works best under ~70 words.
 */
function buildImagePrompt(brand: string | null | undefined, title: string): string {
  const brandLabel = BRAND_DESCRIPTORS[(brand ?? '').toLowerCase()] ?? (brand ?? 'Chinese')
  const carType = detectCarType(title)
  return (
    `Professional automotive photography, ${brandLabel} ${carType}, ` +
    `sleek modern design, dynamic studio lighting, silver or dark metallic color, ` +
    `clean background, high detail, photorealistic, 16:9`
  )
}

/**
 * Calls Replicate flux-schnell to generate a car image, downloads it,
 * converts to WebP and saves to public/images/.
 * Returns the local path on success, null on any failure.
 */
export async function generateArticleImage(
  brand: string | null | undefined,
  title: string,
  slug: string,
): Promise<string | null> {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) return null

  const prompt = buildImagePrompt(brand, title)

  try {
    // Create prediction
    const createRes = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'wait',           // wait up to 60 s for result inline
        },
        body: JSON.stringify({
          input: {
            prompt,
            aspect_ratio: '16:9',
            output_format: 'webp',
            output_quality: 85,
            num_outputs: 1,
          },
        }),
      },
    )

    if (!createRes.ok) {
      const err = await createRes.text()
      console.error(`[Replicate] API error ${createRes.status}: ${err.slice(0, 200)}`)
      return null
    }

    const prediction = await createRes.json() as {
      status: string
      output?: string[]
      error?: string
      urls?: { get: string }
    }

    // If not completed inline, poll until done (max 30 s)
    let output = prediction.output
    if (!output && prediction.urls?.get) {
      for (let i = 0; i < 15; i++) {
        await new Promise((r) => setTimeout(r, 2000))
        const poll = await fetch(prediction.urls.get, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const p = await poll.json() as { status: string; output?: string[]; error?: string }
        if (p.status === 'succeeded') { output = p.output; break }
        if (p.status === 'failed') { console.error('[Replicate] Generation failed:', p.error); return null }
      }
    }

    if (!output?.length) return null

    // Download the generated WebP and save locally
    const imageUrl = output[0]
    const raw = await downloadImage(imageUrl)
    if (!raw) return null

    // Flux already outputs WebP at the right quality — just save directly
    return saveImage(raw, `ai-${slug}`)
  } catch (e) {
    console.error('[Replicate] Unexpected error:', e)
    return null
  }
}
