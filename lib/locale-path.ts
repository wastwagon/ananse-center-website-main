import { defaultLocale, type Locale } from './i18n'

export const LOCALE_COOKIE = 'ananse-locale'

export function localizedPath(path: string, locale: Locale = defaultLocale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === 'fr') {
    return normalized === '/' ? '/fr' : `/fr${normalized}`
  }
  return normalized
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/fr' || pathname === '/fr/') return '/'
  if (pathname.startsWith('/fr/')) return pathname.slice(3) || '/'
  return pathname
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/fr' || pathname.startsWith('/fr/') ? 'fr' : defaultLocale
}

export function isFrenchPath(pathname: string): boolean {
  return pathname === '/fr' || pathname.startsWith('/fr/')
}
