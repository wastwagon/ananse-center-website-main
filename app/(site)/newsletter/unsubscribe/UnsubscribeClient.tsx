'use client'

import { useEffect, useState } from 'react'
import LocalizedLink from '../../../../components/LocalizedLink'
import { unsubscribeNewsletter } from '../../../../lib/api'

export default function UnsubscribeClient({ token }: { token: string }) {
  const [message, setMessage] = useState(token ? 'Removing this address…' : 'This unsubscribe link is incomplete.')
  const [failed, setFailed] = useState(!token)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    void unsubscribeNewsletter(token)
      .then((result) => {
        if (!cancelled) setMessage(result.message)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setFailed(true)
        setMessage(error instanceof Error ? error.message : 'Unable to unsubscribe')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <article className="content-page">
      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <h1 className="content-page-title">Newsletter</h1>
          <p className={failed ? 'form-error' : 'page-body-text'} role="status">
            {message}
          </p>
          <LocalizedLink href="/events#newsletter" className="btn-outline">
            Back to events
          </LocalizedLink>
        </div>
      </section>
    </article>
  )
}
