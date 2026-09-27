'use client'

import { FormEvent, useState } from 'react'
import { subscribeNewsletter } from '../lib/api'

type NewsletterSignupProps = {
  id?: string
  heading?: string
  lead?: string
  placeholder?: string
  buttonLabel?: string
  compact?: boolean
}

export default function NewsletterSignup({
  id = 'newsletter',
  heading = 'Stay in the loop',
  lead = 'Occasional notes on gatherings, programs, and reflections. Unsubscribe from any message.',
  placeholder = 'Email address',
  buttonLabel = 'Subscribe',
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const value = email.trim()
    if (!value) return
    setStatus('loading')
    setMessage('')
    try {
      const result = await subscribeNewsletter(value)
      setStatus('done')
      setMessage(result.message)
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to subscribe')
    }
  }

  return (
    <section id={id} className={compact ? 'newsletter-signup newsletter-signup--compact' : 'newsletter-signup'}>
      {heading ? <h2 className={compact ? 'footer-col-heading' : 'page-section-heading'}>{heading}</h2> : null}
      {lead ? <p className="page-body-text newsletter-signup-lead">{lead}</p> : null}
      <form onSubmit={onSubmit} className="newsletter-inline-form">
        <label className="sr-only" htmlFor={`${id}-email`}>
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          className="form-input newsletter-form-input"
          placeholder={placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" className="btn-primary newsletter-form-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : buttonLabel}
        </button>
      </form>
      {message ? (
        <p className={status === 'error' ? 'form-error newsletter-signup-note' : 'page-body-text newsletter-signup-note'} role="status">
          {message}
        </p>
      ) : null}
    </section>
  )
}
