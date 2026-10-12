import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUT_FILE = path.join(process.cwd(), 'src', 'lib', 'image-manifest.json')

// Build-time whitelist of internal image paths that really exist on disk.
// `public/images/**` is excluded from the serverless bundle
// (next.config.ts -> experimental.outputFileTracingExcludes), so a runtime
// fs.existsSync() check on those paths is always false in production. The
// build step records the truth here instead.
function generateManifest(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory, skipping image manifest generation')
    return
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  const verified = new Set<string>()

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    const image = data.image
    if (typeof image !== 'string') continue
    if (!image.startsWith('/')) continue // external URLs are not bundled assets
    if (!fs.existsSync(path.join(PUBLIC_DIR, image))) continue
    verified.add(image)
  }

  const paths = Array.from(verified).sort()
  const json = JSON.stringify({ paths }, null, 0) + '\n'

  const outDir = path.dirname(OUT_FILE)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(OUT_FILE, json, 'utf-8')

  console.log(`[image-manifest] verified ${paths.length} internal image paths`)
}

generateManifest()
