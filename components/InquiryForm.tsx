'use client'

import { useState, type FormEvent } from 'react'
import { submitContactMessage } from '../lib/api'
import { CONTACT_SUBJECTS } from '../lib/leadership/copy'

type InquiryFormProps = {
  id?: string
  heading: string
  intro?: string
  defaultSubject: string
  subjects?: readonly string[]
  messageLabel?: string
  submitLabel?: string
  successNote?: string
}

export default function InquiryForm({
  id,
  heading,
  intro,
  defaultSubject,
  subjects = CONTACT_SUBJECTS,
  messageLabel = 'Message',
  submitLabel = 'Send message',
  successNote,
}: InquiryFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [subject, setSubject] = useState(defaultSubject)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('loading')
    setFeedback('')
    try {
      const organizationLine = organization.trim()
      const messageBody = organizationLine
        ? `Organization: ${organizationLine}\n\n${message}`
        : message
      const result = await submitContactMessage({ name, email, subject, message: messageBody })
      setStatus('success')
      setFeedback(successNote || result.message)
      setName('')
      setEmail('')
      setOrganization('')
      setMessage('')
      setSubject(defaultSubject)
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to send message')
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="insight-card p-0">
      <div className="insight-card-bar" />
      <div className="insight-card-body p-20">
        <h2 className="page-section-heading">{heading}</h2>
        {intro ? <p className="page-body-text">{intro}</p> : null}
        <div className="contact-form-grid">
          <div className="form-group">
            <label htmlFor={`${id}-name`} className="form-label">
              Full name
            </label>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${id}-email`} className="form-label">
              Email address
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor={`${id}-organization`} className="form-label">
            Organization
          </label>
          <input
            id={`${id}-organization`}
            name="organization"
            type="text"
            autoComplete="organization"
            className="form-input"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`${id}-subject`} className="form-label">
            Subject
          </label>
          <select
            id={`${id}-subject`}
            name="subject"
            className="form-input form-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`${id}-message`} className="form-label">
            {messageLabel}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            className="form-input"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : submitLabel}
        </button>
        {feedback ? <p className="page-body-text">{feedback}</p> : null}
      </div>
    </form>
  )
}
