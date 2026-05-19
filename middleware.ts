import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE } from './lib/admin-server'

function getMiddlewareApiUrl() {
  const publicUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4035').replace(/\/+$/, '')
  const internal = process.env.API_INTERNAL_URL?.replace(/\/+$/, '')

  if (internal?.includes('backend:') && process.env.RUNNING_IN_DOCKER === 'true') {
    return internal
  }

  return publicUrl
}

async function fetchMaintenanceMode() {
  try {
    const response = await fetch(`${getMiddlewareApiUrl()}/api/v1/site/status`, {
      cache: 'no-store',
    })
    if (!response.ok) return false
    const payload = (await response.json()) as { maintenanceMode?: boolean }
    return payload.maintenanceMode === true
  } catch {
    return false
  }
}

function isBypassPath(pathname: string) {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/maintenance' ||
    pathname === '/favicon.ico'
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  if (!isBypassPath(pathname)) {
    const maintenance = await fetchMaintenanceMode()
    if (maintenance) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
}
