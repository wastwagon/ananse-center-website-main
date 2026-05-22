import { cookies } from 'next/headers'
import { parseLocale } from './i18n'
import { LOCALE_COOKIE, localizedPath } from './locale-path'

export async function getServerLocale() {
  const cookieStore = await cookies()
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value)
}

export async function localizedHref(path: string) {
  const locale = await getServerLocale()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return localizedPath(normalized, locale)
}
