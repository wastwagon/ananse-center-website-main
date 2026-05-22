'use client'

import { useState } from 'react'
import { registerForEvent } from '../lib/api'

type EventRegistrationFormProps = {
  eventSlug: string
  eventTitle: string
}

export default function EventRegistrationForm({ eventSlug, eventTitle }: EventRegistrationFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const result = await registerForEvent({
        eventSlug,
        eventTitle,
        name,
        email,
        phone,
        notes,
      })
      setStatus('done')
      setMessage(result.data.message)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-column flex-column--snug">
      <div className="form-group">
        <label htmlFor="reg-name" className="form-label">
          Full name
        </label>
        <input
          id="reg-name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-email" className="form-label">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-phone" className="form-label">
          Phone (optional)
        </label>
        <input
          id="reg-phone"
          className="form-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="reg-notes" className="form-label">
          Notes
        </label>
        <textarea
          id="reg-notes"
          className="form-input form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Accessibility needs, group size, etc."
        />
      </div>
      <button type="submit" className="btn-primary contact-form-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : 'Register interest'}
      </button>
      {message ? <p className="page-body-text text-body-md mt-note">{message}</p> : null}
    </form>
  )
}
