/**
 * Brand Extraction Utility
 *
 * Extracts car brand names from article content.
 * Primary brand = first brand appearing in the title; if none, first in body by position.
 */

const BRAND_PATTERNS: { brand: string; patterns: RegExp[] }[] = [
  // Chinese EV brands
  { brand: 'BYD',        patterns: [/\bBYD\b/i, /比亚迪/] },
  { brand: 'NIO',        patterns: [/\bNIO\b/i, /蔚来/] },
  { brand: 'XPeng',      patterns: [/\bXPeng\b/i, /小鹏/] },
  { brand: 'Li Auto',    patterns: [/\bLi\s*Auto\b/i, /理想/] },
  { brand: 'Geely',      patterns: [/\bGeely\b/i, /吉利/] },
  { brand: 'Zeekr',      patterns: [/\bZeekr\b/i, /极氪/] },
  { brand: 'Xiaomi',     patterns: [/\bXiaomi\b/i, /小米/, /\bSU7\b/i, /\bYU7\b/i] },
  { brand: 'MG',         patterns: [/\bMG\b/, /名爵/] },
  { brand: 'Aion',       patterns: [/\bAion\b/i, /埃安/] },
  { brand: 'Leapmotor',  patterns: [/\bLeapmotor\b/i, /零跑/] },
  { brand: 'Onvo',       patterns: [/\bOnvo\b/i, /乐道/] },
  { brand: 'Tesla',      patterns: [/\bTesla\b/i, /特斯拉/] },
  { brand: 'Huawei',     patterns: [/\bHuawei\b/i, /华为/, /\bAITO\b/i, /\bSELTO\b/i] },
  { brand: 'SAIC',       patterns: [/\bSAIC\b/i, /上汽/] },
  { brand: 'GAC',        patterns: [/\bGAC\b/i, /广汽/] },
  { brand: 'Chery',      patterns: [/\bChery\b/i, /奇瑞/] },
  { brand: 'BAIC',       patterns: [/\bBAIC\b/i, /北汽/] },
  { brand: 'Changan',    patterns: [/\bChangan\b/i, /长安/] },
  { brand: 'Great Wall', patterns: [/\bGreat\s*Wall\b/i, /长城/, /\bHaval\b/i, /\bWey\b/i, /\bTank\b/i] },
  { brand: 'Lynk & Co',  patterns: [/\bLynk\b/i, /领克/] },
  { brand: 'Denza',      patterns: [/\bDenza\b/i, /腾势/] },
  { brand: 'Lixiang',    patterns: [/\bLixiang\b/i] },
  { brand: 'HiPhi',      patterns: [/\bHiPhi\b/i, /高合/] },
  { brand: 'Neta',       patterns: [/\bNeta\b/i, /哪吒/] },
  { brand: 'Deepal',     patterns: [/\bDeepal\b/i, /深蓝/] },
  { brand: 'Avatr',      patterns: [/\bAvatr\b/i, /阿维塔/] },
  { brand: 'Voyah',      patterns: [/\bVoyah\b/i, /岚图/] },
  { brand: 'AITO',       patterns: [/\bAITO\b/i] },
  { brand: 'Xpeng',      patterns: [/\bXpeng\b/i] },
  { brand: 'IM',         patterns: [/\bIM\s*Motors\b/i, /智己/] },
  // European / foreign brands (relevant for comparison articles)
  { brand: 'Audi',       patterns: [/\bAudi\b/i, /奥迪/] },
  { brand: 'BMW',        patterns: [/\bBMW\b/, /宝马/] },
  { brand: 'Mercedes-Benz', patterns: [/\bMercedes[\s-]?Benz\b/i, /\bMercedes\b/i, /奔驰/] },
  { brand: 'Škoda',      patterns: [/Škoda/i, /\bSkoda\b/i, /斯柯达/] },
  { brand: 'Volkswagen', patterns: [/\bVolkswagen\b/i, /\bVW\b/, /大众/] },
  { brand: 'Porsche',    patterns: [/\bPorsche\b/i, /保时捷/] },
  { brand: 'MINI',       patterns: [/\bMINI\b/] },
  { brand: 'Smart',      patterns: [/\bSmart\b/i] },
  { brand: 'Volvo',      patterns: [/\bVolvo\b/i, /沃尔沃/] },
  { brand: 'Polestar',   patterns: [/\bPolestar\b/i, /极星/] },
  { brand: 'Toyota',     patterns: [/\bToyota\b/i, /丰田/] },
  { brand: 'Honda',      patterns: [/\bHonda\b/i, /本田/] },
  { brand: 'Nissan',     patterns: [/\bNissan\b/i, /日产/] },
  { brand: 'Hyundai',    patterns: [/\bHyundai\b/i, /现代/] },
  { brand: 'Kia',        patterns: [/\bKia\b/i, /起亚/] },
]

/**
 * Find the earliest position where any pattern matches in text.
 * Returns Infinity if no match.
 */
function firstMatchIndex(text: string, patterns: RegExp[]): number {
  let earliest = Infinity
  for (const pattern of patterns) {
    // Use a copy with global flag to find first occurrence
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
    re.lastIndex = 0
    const m = re.exec(text)
    if (m && m.index < earliest) {
      earliest = m.index
    }
  }
  return earliest
}

/**
 * Extract primary brand from article.
 * Priority: title match (first brand found in title) → earliest body position.
 */
export function extractBrand(title: string, content: string): string | undefined {
  // 1. Check title first — any brand appearing here is the article subject
  for (const { brand, patterns } of BRAND_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(title)) {
        return brand
      }
    }
  }

  // 2. Fall back to earliest position in body
  let primaryBrand: string | undefined
  let primaryPos = Infinity

  for (const { brand, patterns } of BRAND_PATTERNS) {
    const pos = firstMatchIndex(content, patterns)
    if (pos < primaryPos) {
      primaryPos = pos
      primaryBrand = brand
    }
  }

  return primaryBrand
}

/**
 * Get all brands mentioned in content (title + body), in order of appearance.
 */
export function extractAllBrands(title: string, content: string): string[] {
  const combined = `${title} ${content}`
  const found: string[] = []

  for (const { brand, patterns } of BRAND_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(combined) && !found.includes(brand)) {
        found.push(brand)
        break
      }
    }
  }

  return found
}
