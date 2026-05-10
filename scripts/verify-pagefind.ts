import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ARTICLES_DIR = join(process.cwd(), 'out', 'articles')

const slugs = readdirSync(ARTICLES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

let missing = 0

for (const slug of slugs) {
  const htmlPath = join(ARTICLES_DIR, slug, 'index.html')
  if (!existsSync(htmlPath)) {
    console.error(`[VERIFY-PAGEFIND] MISSING HTML: ${slug}`)
    missing++
    continue
  }

  const html = readFileSync(htmlPath, 'utf-8')
  if (!html.includes('data-pagefind-body')) {
    console.error(`[VERIFY-PAGEFIND] MISSING data-pagefind-body: ${slug}`)
    missing++
  }
}

if (missing > 0) {
  console.error(`\n[VERIFY-PAGEFIND] FAIL: ${missing} article(s) ohne data-pagefind-body`)
  process.exit(1)
}

console.log(`[VERIFY-PAGEFIND] OK: ${slugs.length} article(s) mit data-pagefind-body`)
