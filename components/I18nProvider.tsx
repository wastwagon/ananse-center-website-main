'use client'

import { usePathname } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultLocale, t, type Locale } from '../lib/i18n'
import { LOCALE_COOKIE, localeFromPathname } from '../lib/locale-path'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  translate: (key: string) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
  translate: (key) => t(key, defaultLocale),
})

function persistLocaleCookie(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem(LOCALE_COOKIE, locale)
    document.documentElement.lang = locale
  } catch {
    /* ignore */
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pathLocale = localeFromPathname(pathname)
  const [locale, setLocaleState] = useState<Locale>(pathLocale)

  useEffect(() => {
    setLocaleState(pathLocale)
    persistLocaleCookie(pathLocale)
  }, [pathLocale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocaleCookie(next)
  }, [])

  const translate = useCallback((key: string) => t(key, locale), [locale])

  const value = useMemo(() => ({ locale, setLocale, translate }), [locale, setLocale, translate])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
