'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getPublicApiUrl } from '../lib/api'

const SESSION_KEY = 'ananse_analytics_sid'

function getSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing && existing.length >= 8) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return `s_${Date.now().toString(36)}`
  }
}

/** First-party pageview beacon — self-hosted, no third-party scripts. */
export default function AnalyticsBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    void fetch(`${getPublicApiUrl()}/api/v1/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
        sessionId: getSessionId(),
      }),
      keepalive: true,
      mode: 'cors',
    }).catch(() => {
      /* ignore tracking failures */
    })
  }, [pathname])

  return null
}
