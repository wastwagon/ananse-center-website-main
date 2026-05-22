import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE } from './lib/admin-server'
import { getServerApiUrl } from './lib/server-api-url'
import {
  isFrenchPath,
  LOCALE_COOKIE,
  localizedPath,
  stripLocalePrefix,
} from './lib/locale-path'
import { parseLocale } from './lib/i18n'

async function fetchMaintenanceMode() {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/status`, {
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
  const logical = stripLocalePrefix(pathname)
  return (
    logical.startsWith('/admin') ||
    logical.startsWith('/api') ||
    logical.startsWith('/_next') ||
    logical.startsWith('/images') ||
    logical === '/maintenance' ||
    logical === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname.endsWith('/opengraph-image') ||
    pathname.endsWith('/icon') ||
    pathname.endsWith('/apple-icon')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (stripLocalePrefix(pathname).startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/fr/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', stripLocalePrefix(pathname))
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  if (isFrenchPath(pathname)) {
    const logicalPath = stripLocalePrefix(pathname)
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = logicalPath

    if (!isBypassPath(pathname)) {
      const maintenance = await fetchMaintenanceMode()
      if (maintenance) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }

    const response = NextResponse.rewrite(rewriteUrl)
    response.cookies.set(LOCALE_COOKIE, 'fr', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
    return response
  }

  const cookieLocale = parseLocale(request.cookies.get(LOCALE_COOKIE)?.value)
  if (
    cookieLocale === 'fr' &&
    !isBypassPath(pathname) &&
    !isFrenchPath(pathname)
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = localizedPath(pathname, 'fr')
    return NextResponse.redirect(redirectUrl)
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
