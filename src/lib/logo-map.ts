export const brandLogoMap: Record<string, string> = {
  'BYD':         '/logos/byd.svg',
  'NIO':         '/logos/nio.svg',
  'Li Auto':     '/logos/li-auto.svg',
  'Geely':       '/logos/geely.svg',
  'Zeekr':       '/logos/zeekr.svg',
  'XPeng':       '/logos/xpeng.svg',
  'Haval':       '/logos/haval.svg',
  'Changan':     '/logos/changan.svg',
  'Leapmotor':   '/logos/leapmotor.svg',
  'Avatr':       '/logos/avatr.svg',
  'Denza':       '/logos/denza.svg',
  'Luxeed':      '/logos/luxeed.svg',
  'Lantu':       '/logos/lantu.svg',
  'Aion':        '/logos/aion.svg',
  'Xiaomi':      '/logos/xiaomi.svg',
  'Volkswagen':  '/logos/volkswagen.svg',
  'Audi':        '/logos/audi.svg',
  'BMW':         '/logos/bmw.svg',
  'Tesla':       '/logos/tesla.svg',
  'Škoda':       '/logos/skoda.svg',
  'MG':          '/logos/mg.svg',
}

export const sourceLogoMap: Record<string, string> = {
  'CnEVPost':            '/logos/source-cnevpost.svg',
  'Sina':                '/logos/source-sina.svg',
  'OFweek NEV':          '/logos/source-ofweek.svg',
  'Autohome NewEnergy':  '/logos/source-autohome.svg',
  'ChooseAuto':          '/logos/source-chooseauto.svg',
  'Electrek':            '/logos/source-electrek.svg',
  'D1EV':                '/logos/source-d1ev.svg',
}

export function getArticleLogo(brand?: string | null, source?: string): string | null {
  if (brand && brandLogoMap[brand]) return brandLogoMap[brand]
  if (source && sourceLogoMap[source]) return sourceLogoMap[source]
  return null
}
