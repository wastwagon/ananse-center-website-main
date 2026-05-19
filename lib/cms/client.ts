'use client'

import { useEffect, useMemo, useState } from 'react'
import { CONTENT_REGISTRY, type ContentKey } from './registry'
import { getPublicApiUrl } from '../api'

function defaultsForKeys<const K extends readonly ContentKey[]>(keys: K): Record<K[number], string> {
  const out = {} as Record<K[number], string>
  for (const key of keys) {
    out[key] = CONTENT_REGISTRY[key].defaultBody
  }
  return out
}

/** Client-side CMS text (defaults from registry; hydrates from API). */
export function useCmsText(key: ContentKey): string {
  return useCmsTexts([key] as const)[key]
}

/** Batch fetch for client pages (e.g. events). */
export function useCmsTexts<const K extends readonly ContentKey[]>(
  keys: K,
): Record<K[number], string> {
  const keysKey = keys.join('\0')
  const [texts, setTexts] = useState(() => defaultsForKeys(keys))

  useEffect(() => {
    setTexts(defaultsForKeys(keys))
  }, [keysKey])

  useEffect(() => {
    let cancelled = false
    fetch(`${getPublicApiUrl()}/api/v1/site/content`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: Record<string, string> } | null) => {
        if (cancelled || !payload?.data) return
        setTexts((prev) => {
          const next = { ...prev }
          for (const key of keys) {
            const fromApi = payload.data?.[key]?.trim()
            if (fromApi) next[key] = fromApi
          }
          return next
        })
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [keysKey])

  return useMemo(() => texts, [texts])
}
