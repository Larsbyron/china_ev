/**
 * Brand Glossary — official English names + European market status
 * Source of truth: SCRAPING-RULES.md Section 5
 *
 * europeStatus:
 *   'de'   = already selling in Germany
 *   'eu'   = selling in some EU countries, not Germany
 *   'plan' = announced European plans, not selling yet
 *   'none' = no European plans
 */

export interface BrandInfo {
  officialName: string
  group: string
  europeStatus: 'de' | 'eu' | 'plan' | 'none'
  euCountries?: string          // which EU countries if status is 'eu'
  euModels?: string             // models available in Germany/EU
  euNote?: string               // short note for "In Deutschland" section
}

export const BRAND_GLOSSARY: Record<string, BrandInfo> = {
  // === BYD Group ===
  'BYD': {
    officialName: 'BYD',
    group: 'BYD',
    europeStatus: 'de',
    euModels: 'Atto 2, Atto 3, Dolphin, Seal, Sealion 7, Han',
    euNote: 'BYD ist seit 2022 auf dem deutschen Markt aktiv und baut sein Händlernetz kontinuierlich aus.',
  },
  '比亚迪': { officialName: 'BYD', group: 'BYD', europeStatus: 'de', euModels: 'Atto 2, Atto 3, Dolphin, Seal, Sealion 7, Han' },
  'Denza': {
    officialName: 'Denza',
    group: 'BYD + Mercedes-Benz JV',
    europeStatus: 'plan',
    euNote: 'Denza (Joint Venture von BYD und Mercedes-Benz) hat eine Expansion nach Europa angekündigt, konkrete Markteinführungstermine für Deutschland stehen noch aus.',
  },
  '腾势': { officialName: 'Denza', group: 'BYD + Mercedes-Benz JV', europeStatus: 'plan' },
  'Yangwang': {
    officialName: 'Yangwang',
    group: 'BYD',
    europeStatus: 'none',
    euNote: 'Yangwang ist die Ultra-Luxus-Submarke von BYD und derzeit ausschließlich im chinesischen Markt erhältlich.',
  },
  '仰望': { officialName: 'Yangwang', group: 'BYD', europeStatus: 'none' },
  'Fang Cheng Bao': { officialName: 'Fang Cheng Bao (FCB)', group: 'BYD', europeStatus: 'none' },
  'FCB': { officialName: 'Fang Cheng Bao (FCB)', group: 'BYD', europeStatus: 'none' },
  '方程豹': { officialName: 'Fang Cheng Bao (FCB)', group: 'BYD', europeStatus: 'none' },

  // === NIO Group ===
  'NIO': {
    officialName: 'NIO',
    group: 'NIO',
    europeStatus: 'de',
    euModels: 'ET5, ET7, EL6, EL7, EL8',
    euNote: 'NIO ist seit 2021 in Europa aktiv und betreibt NIO Houses in München und anderen deutschen Städten.',
  },
  '蔚来': { officialName: 'NIO', group: 'NIO', europeStatus: 'de' },
  'Onvo': {
    officialName: 'Onvo',
    group: 'NIO',
    europeStatus: 'none',
    euNote: 'Onvo (乐道) ist die günstigere Submarke von NIO, bisher nur in China erhältlich.',
  },
  '乐道': { officialName: 'Onvo', group: 'NIO', europeStatus: 'none' },
  'Firefly': { officialName: 'NIO Firefly', group: 'NIO', europeStatus: 'plan', euNote: 'NIO Firefly (萤火虫), das Kleinwagen-Angebot von NIO, soll 2025/2026 auch nach Europa gebracht werden.' },
  '萤火虫': { officialName: 'NIO Firefly', group: 'NIO', europeStatus: 'plan' },

  // === XPeng ===
  'XPeng': {
    officialName: 'XPeng',
    group: 'XPeng',
    europeStatus: 'eu',
    euCountries: 'Norwegen, Schweden, Dänemark, Niederlande',
    euNote: 'XPeng ist in mehreren nordeuropäischen Ländern vertreten, der Markteintritt in Deutschland ist angekündigt.',
  },
  'Xpeng': { officialName: 'XPeng', group: 'XPeng', europeStatus: 'eu', euCountries: 'Norwegen, Schweden, Dänemark, Niederlande' },
  '小鹏': { officialName: 'XPeng', group: 'XPeng', europeStatus: 'eu' },

  // === Li Auto ===
  'Li Auto': {
    officialName: 'Li Auto',
    group: 'Li Auto',
    europeStatus: 'none',
    euNote: 'Li Auto hat bislang keine offiziellen Pläne für eine Expansion nach Europa bekannt gegeben. Das Unternehmen konzentriert sich auf den chinesischen Markt.',
  },
  '理想': { officialName: 'Li Auto', group: 'Li Auto', europeStatus: 'none' },

  // === Leapmotor ===
  'Leapmotor': {
    officialName: 'Leapmotor',
    group: 'Leapmotor + Stellantis',
    europeStatus: 'eu',
    euCountries: 'Niederlande, Frankreich, Belgien und weitere',
    euNote: 'Leapmotor International (Joint Venture mit Stellantis) vertreibt seit Ende 2024 Fahrzeuge in Europa, darunter T03 und C10.',
  },
  '零跑': { officialName: 'Leapmotor', group: 'Leapmotor + Stellantis', europeStatus: 'eu' },

  // === NETA ===
  'NETA': { officialName: 'NETA', group: 'Hozon Auto', europeStatus: 'plan', euNote: 'NETA (哪吒) plant eine Expansion nach Europa, konkrete Deutschland-Pläne wurden noch nicht bestätigt.' },
  '哪吒': { officialName: 'NETA', group: 'Hozon Auto', europeStatus: 'plan' },

  // === Huawei Ecosystem (HIMA) ===
  'AITO': {
    officialName: 'AITO',
    group: 'Huawei + Seres',
    europeStatus: 'none',
    euNote: 'AITO (问界) gehört zur Huawei-Allianz HIMA und ist ausschließlich im chinesischen Markt erhältlich.',
  },
  '问界': { officialName: 'AITO', group: 'Huawei + Seres', europeStatus: 'none' },
  'Luxeed': { officialName: 'Luxeed', group: 'Huawei + Chery', europeStatus: 'none' },
  '智界': { officialName: 'Luxeed', group: 'Huawei + Chery', europeStatus: 'none' },
  'Stelato': { officialName: 'Stelato', group: 'Huawei + BAIC', europeStatus: 'none' },
  '享界': { officialName: 'Stelato', group: 'Huawei + BAIC', europeStatus: 'none' },
  'Maextro': { officialName: 'Maextro', group: 'Huawei + JAC', europeStatus: 'none' },
  '尊界': { officialName: 'Maextro', group: 'Huawei + JAC', europeStatus: 'none' },
  'HIMA': { officialName: 'HIMA', group: 'Huawei Alliance', europeStatus: 'none' },
  '鸿蒙智行': { officialName: 'HIMA (Harmony Intelligent Mobility Alliance)', group: 'Huawei Alliance', europeStatus: 'none' },

  // === Great Wall Motors (GWM) ===
  'GWM': {
    officialName: 'GWM',
    group: 'Great Wall Motors',
    europeStatus: 'de',
    euNote: 'GWM (Great Wall Motors) ist mit den Marken ORA, Haval und WEY in Deutschland vertreten.',
  },
  '长城': { officialName: 'GWM', group: 'Great Wall Motors', europeStatus: 'de' },
  'Haval': { officialName: 'Haval', group: 'GWM', europeStatus: 'de', euModels: 'Jolion, H6' },
  '哈弗': { officialName: 'Haval', group: 'GWM', europeStatus: 'de' },
  'ORA': { officialName: 'ORA', group: 'GWM', europeStatus: 'de', euModels: 'Funky Cat (ORA 03)' },
  '欧拉': { officialName: 'ORA', group: 'GWM', europeStatus: 'de' },
  'WEY': { officialName: 'WEY', group: 'GWM', europeStatus: 'de', euModels: 'Coffee 01, Coffee 02' },
  '魏': { officialName: 'WEY', group: 'GWM', europeStatus: 'de' },
  'Tank': { officialName: 'Tank', group: 'GWM', europeStatus: 'eu', euCountries: 'ausgewählte EU-Märkte' },
  '坦克': { officialName: 'Tank', group: 'GWM', europeStatus: 'eu' },

  // === Geely Group ===
  'Geely': { officialName: 'Geely', group: 'Geely Group', europeStatus: 'eu', euCountries: 'ausgewählte EU-Märkte' },
  '吉利': { officialName: 'Geely', group: 'Geely Group', europeStatus: 'eu' },
  'Zeekr': {
    officialName: 'Zeekr',
    group: 'Geely Group',
    europeStatus: 'eu',
    euCountries: 'Niederlande, Schweden',
    euNote: 'Zeekr ist bereits in den Niederlanden und Schweden erhältlich. Ein Markteintritt in Deutschland wurde angekündigt, konkrete Termine stehen noch aus.',
  },
  '极氪': { officialName: 'Zeekr', group: 'Geely Group', europeStatus: 'eu' },
  'Lynk & Co': {
    officialName: 'Lynk & Co',
    group: 'Geely + Volvo',
    europeStatus: 'de',
    euModels: '01, 02, 03 (Abonnement-Modell)',
    euNote: 'Lynk & Co bietet in Deutschland ein innovatives Abonnement-Modell an, bei dem Fahrzeuge geteilt und flexibel genutzt werden können.',
  },
  '领克': { officialName: 'Lynk & Co', group: 'Geely + Volvo', europeStatus: 'de' },
  'Polestar': { officialName: 'Polestar', group: 'Geely + Volvo', europeStatus: 'de', euModels: 'Polestar 2, Polestar 3, Polestar 4' },
  '极星': { officialName: 'Polestar', group: 'Geely + Volvo', europeStatus: 'de' },
  'Lotus': { officialName: 'Lotus', group: 'Geely', europeStatus: 'de', euModels: 'Emira, Eletre, Emeya' },
  '路特斯': { officialName: 'Lotus', group: 'Geely', europeStatus: 'de' },
  'Radar': { officialName: 'Radar', group: 'Geely', europeStatus: 'none' },
  '雷达': { officialName: 'Radar', group: 'Geely', europeStatus: 'none' },
  'Geely Galaxy': { officialName: 'Geely Galaxy', group: 'Geely', europeStatus: 'none' },
  '银河': { officialName: 'Geely Galaxy', group: 'Geely', europeStatus: 'none' },

  // === SAIC Group ===
  'MG': {
    officialName: 'MG',
    group: 'SAIC',
    europeStatus: 'de',
    euModels: 'MG4, MG5, MG ZS EV, MG HS PHEV, Cyberster',
    euNote: 'MG (ursprünglich britische Marke, heute Teil von SAIC) ist eine der meistverkauften chinesischen Marken in Deutschland.',
  },
  '名爵': { officialName: 'MG', group: 'SAIC', europeStatus: 'de' },
  'IM Motors': { officialName: 'IM Motors', group: 'SAIC', europeStatus: 'none' },
  '智己': { officialName: 'IM Motors', group: 'SAIC', europeStatus: 'none' },

  // === Changan Group ===
  'Changan': { officialName: 'Changan', group: 'Changan', europeStatus: 'plan', euNote: 'Changan plant eine Expansion nach Europa, konkrete Deutschland-Pläne wurden bekannt gegeben, aber ein Marktstart steht noch aus.' },
  '长安': { officialName: 'Changan', group: 'Changan', europeStatus: 'plan' },
  'Deepal': { officialName: 'Deepal', group: 'Changan', europeStatus: 'plan', euNote: 'Deepal (深蓝), die Elektro-Submarke von Changan, plant eine europäische Expansion.' },
  '深蓝': { officialName: 'Deepal', group: 'Changan', europeStatus: 'plan' },
  'Avatr': { officialName: 'Avatr (AVATR)', group: 'Changan + Huawei + CATL', europeStatus: 'plan', euNote: 'Avatr, ein Joint Venture von Changan, Huawei und CATL, plant eine Expansion nach Europa.' },
  '阿维塔': { officialName: 'Avatr (AVATR)', group: 'Changan + Huawei + CATL', europeStatus: 'plan' },

  // === GAC Group ===
  'Aion': { officialName: 'Aion', group: 'GAC', europeStatus: 'plan', euNote: 'Aion (广汽埃安) plant eine Expansion nach Europa, der Marktstart in Deutschland ist noch nicht terminiert.' },
  '埃安': { officialName: 'Aion', group: 'GAC', europeStatus: 'plan' },
  'Hyper': { officialName: 'Hyper', group: 'GAC', europeStatus: 'none', euNote: 'Hyper (昊铂), die Premium-Submarke von GAC Aion, ist ausschließlich im chinesischen Markt erhältlich.' },
  '昊铂': { officialName: 'Hyper', group: 'GAC', europeStatus: 'none' },

  // === BAIC Group ===
  'ARCFOX': { officialName: 'ARCFOX', group: 'BAIC', europeStatus: 'none' },
  '极狐': { officialName: 'ARCFOX', group: 'BAIC', europeStatus: 'none' },

  // === Dongfeng ===
  'Voyah': { officialName: 'Voyah', group: 'Dongfeng', europeStatus: 'eu', euCountries: 'Norwegen', euNote: 'Voyah (岚图) von Dongfeng ist in Norwegen erhältlich. Weitere europäische Märkte sind geplant.' },
  '岚图': { officialName: 'Voyah', group: 'Dongfeng', europeStatus: 'eu', euCountries: 'Norwegen' },
  'M-Hero': { officialName: 'M-Hero', group: 'Dongfeng', europeStatus: 'none' },
  '猛士': { officialName: 'M-Hero', group: 'Dongfeng', europeStatus: 'none' },

  // === Xiaomi ===
  'Xiaomi': { officialName: 'Xiaomi', group: 'Xiaomi', europeStatus: 'none', euNote: 'Xiaomi Auto ist ausschließlich im chinesischen Markt erhältlich. Pläne für eine europäische Expansion wurden bislang nicht angekündigt.' },
  '小米': { officialName: 'Xiaomi', group: 'Xiaomi', europeStatus: 'none' },

  // === Others ===
  'Hongqi': { officialName: 'Hongqi', group: 'FAW', europeStatus: 'eu', euCountries: 'ausgewählte EU-Märkte in kleinen Stückzahlen' },
  '红旗': { officialName: 'Hongqi', group: 'FAW', europeStatus: 'eu' },
  'Chery': { officialName: 'Chery', group: 'Chery', europeStatus: 'plan', euNote: 'Chery plant mit der Marke Omoda eine Expansion nach Europa.' },
  '奇瑞': { officialName: 'Chery', group: 'Chery', europeStatus: 'plan' },
  'Omoda': { officialName: 'Omoda', group: 'Chery', europeStatus: 'plan', euNote: 'Omoda ist die Exportmarke von Chery und plant einen Markteintritt in Deutschland.' },
}

/**
 * Look up brand info. Try exact match first, then partial match.
 */
export function lookupBrand(brandName: string): BrandInfo | null {
  if (!brandName) return null
  const direct = BRAND_GLOSSARY[brandName]
  if (direct) return direct
  // Case-insensitive fallback
  const lower = brandName.toLowerCase()
  for (const [key, val] of Object.entries(BRAND_GLOSSARY)) {
    if (key.toLowerCase() === lower) return val
  }
  return null
}

/**
 * Build the "In Deutschland" section text based on brand info.
 */
export function buildInDeutschlandSection(brandName: string): string {
  const info = lookupBrand(brandName)

  if (!info) {
    return `## In Deutschland\n\n*Zu diesem Hersteller liegen uns aktuell keine gesicherten Informationen über einen europäischen Markteintritt vor. Das Modell ist derzeit auf dem chinesischen Markt erhältlich.*`
  }

  const name = info.officialName

  if (info.europeStatus === 'de') {
    const modelsLine = info.euModels ? `\nAktuelle Modelle in Deutschland: **${info.euModels}**.` : ''
    const noteLine = info.euNote ? `\n\n${info.euNote}` : ''
    return `## In Deutschland\n\n${name} ist bereits auf dem deutschen Markt vertreten.${modelsLine}${noteLine}`
  }

  if (info.europeStatus === 'eu') {
    const countries = info.euCountries || 'ausgewählten EU-Ländern'
    const noteLine = info.euNote ? `\n\n${info.euNote}` : ''
    return `## In Deutschland\n\n${name} ist in ${countries} erhältlich, jedoch noch nicht offiziell in Deutschland. ${noteLine}`
  }

  if (info.europeStatus === 'plan') {
    const noteLine = info.euNote || `${name} hat eine Expansion nach Europa angekündigt. Konkrete Termin für Deutschland stehen noch aus.`
    return `## In Deutschland\n\n${noteLine}`
  }

  // 'none'
  const noteLine = info.euNote || `${name} ist ausschließlich auf dem chinesischen Markt erhältlich. Es gibt aktuell keine offiziellen Pläne für einen Markteintritt in Deutschland oder Europa.`
  return `## In Deutschland nicht erhältlich\n\n${noteLine}`
}
