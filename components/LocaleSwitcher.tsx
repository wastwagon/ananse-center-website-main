'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from './I18nProvider'
import { locales, type Locale } from '../lib/i18n'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'

const labels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
}

export default function LocaleSwitcher() {
  const { locale, setLocale, translate } = useI18n()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(next: Locale) {
    if (next === locale) return
    const logical = stripLocalePrefix(pathname)
    setLocale(next)
    router.push(localizedPath(logical, next))
  }

  return (
    <div className="locale-switcher" role="group" aria-label={translate('locale.label')}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={`locale-switcher-btn${locale === code ? ' locale-switcher-btn--active' : ''}`}
          aria-pressed={locale === code}
          onClick={() => switchLocale(code)}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  )
}
