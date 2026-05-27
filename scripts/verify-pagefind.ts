import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ARTICLES_DIR = join(process.cwd(), '.next', 'server', 'app', 'articles')

const htmlFiles = readdirSync(ARTICLES_DIR, { withFileTypes: true })
  .filter(d => d.isFile() && d.name.endsWith('.html'))
  .map(d => d.name)

let missing = 0

for (const file of htmlFiles) {
  const htmlPath = join(ARTICLES_DIR, file)
  if (!existsSync(htmlPath)) {
    console.error(`[VERIFY-PAGEFIND] MISSING HTML: ${file}`)
    missing++
    continue
  }

  const html = readFileSync(htmlPath, 'utf-8')
  if (!html.includes('data-pagefind-body')) {
    console.error(`[VERIFY-PAGEFIND] MISSING data-pagefind-body: ${file}`)
    missing++
  }
}

if (missing > 0) {
  console.error(`\n[VERIFY-PAGEFIND] FAIL: ${missing} article(s) ohne data-pagefind-body`)
  process.exit(1)
}

console.log(`[VERIFY-PAGEFIND] OK: ${htmlFiles.length} article(s) mit data-pagefind-body`)
