import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSessionFromRequest } from '@pulse-r24/auth'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/app')) {
    const session = await getServerSessionFromRequest(req)
    if (!session) {
      url.pathname = '/auth/signin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/app/:path*']
}
