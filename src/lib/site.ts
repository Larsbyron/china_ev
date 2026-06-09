export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://china-autonews.de').trim().replace(/\/$/, '')

export function canonicalUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_URL}${path}`
}
