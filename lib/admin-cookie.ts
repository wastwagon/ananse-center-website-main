/** Secure httpOnly cookie options for admin session (Coolify / HTTPS). */

export function adminSessionCookieOptions(maxAgeSeconds: number) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const secureExplicit = process.env.COOKIE_SECURE === 'true'
  const secureFromHttps =
    process.env.NODE_ENV === 'production' && siteUrl.startsWith('https://')
  const secure = secureExplicit || secureFromHttps

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
