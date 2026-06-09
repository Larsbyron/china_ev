import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === 'www.china-autonews.de') {
    const url = request.nextUrl.clone()
    url.protocol = 'https'
    url.hostname = 'china-autonews.de'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
