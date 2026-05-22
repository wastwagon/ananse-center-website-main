import { cookies } from 'next/headers'
import { LOCALE_COOKIE } from './locale-path'
import { parseLocale, t, type Locale } from './i18n'

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value)
}

/** French UI chrome for static CMS pages when locale cookie is `fr`. */
export function localizePageChrome(
  locale: Locale,
  prefix: string,
  fallback: { badge: string; title: string; lead?: string },
) {
  if (locale !== 'fr') return fallback

  const badgeKey = `${prefix}.badge`
  const titleKey = `${prefix}.title`
  const leadKey = `${prefix}.lead`

  return {
    badge: t(badgeKey, 'fr') !== badgeKey ? t(badgeKey, 'fr') : fallback.badge,
    title: t(titleKey, 'fr') !== titleKey ? t(titleKey, 'fr') : fallback.title,
    lead:
      fallback.lead && t(leadKey, 'fr') !== leadKey ? t(leadKey, 'fr') : fallback.lead,
  }
}
