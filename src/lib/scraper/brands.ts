/**
 * Brand Extraction Utility
 *
 * Extracts Chinese EV brand names from article content.
 * Returns the first matched brand found in the content.
 */

const BRAND_PATTERNS: { brand: string; patterns: RegExp[] }[] = [
  {
    brand: 'BYD',
    patterns: [/\bBYD\b/i, /比亚迪/i, /腾势/i]
  },
  {
    brand: 'NIO',
    patterns: [/\bNIO\b/i, /蔚来/i, /蔚来汽车/i]
  },
  {
    brand: 'XPeng',
    patterns: [/\bXPeng\b/i, /\bXpeng\b/i, /小鹏/i, /小鹏汽车/i]
  },
  {
    brand: 'Li Auto',
    patterns: [/\bLi Auto\b/i, /理想/i, /理想汽车/i, /Li\s*Auto/i]
  },
  {
    brand: 'Geely',
    patterns: [/\bGeely\b/i, /吉利/i, /吉利汽车/i, /领克/i, /极氪/i]
  },
  {
    brand: 'Zeekr',
    patterns: [/\bZeekr\b/i, /极氪/i, /极星/i]
  },
  {
    brand: 'Xiaomi',
    patterns: [/\bXiaomi\b/i, /小米/i, /小米汽车/i, /SU7/i]
  },
  {
    brand: 'MG',
    patterns: [/\bMG\b/i, /上汽MG/i, /名爵/i]
  },
  {
    brand: 'Aion',
    patterns: [/\bAion\b/i, /埃安/i, /广汽埃安/i]
  },
  {
    brand: 'Leapmotor',
    patterns: [/\bLeapmotor\b/i, /零跑/i, /零跑汽车/i]
  },
  {
    brand: 'Onvo',
    patterns: [/\bOnvo\b/i, /乐道/i]
  },
  {
    brand: 'Tesla',
    patterns: [/\bTesla\b/i, /特斯拉/i]
  }
]

/**
 * Extract brand from article content (title + body)
 */
export function extractBrand(title: string, content: string): string | undefined {
  const text = `${title} ${content}`

  for (const { brand, patterns } of BRAND_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return brand
      }
    }
  }

  return undefined
}

/**
 * Get all brands mentioned in content
 */
export function extractAllBrands(title: string, content: string): string[] {
  const text = `${title} ${content}`
  const found: string[] = []

  for (const { brand, patterns } of BRAND_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text) && !found.includes(brand)) {
        found.push(brand)
        break
      }
    }
  }

  return found
}
