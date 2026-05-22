'use client'

import { useState } from 'react'
import { submitCommunityStory } from '../lib/api'

export default function StorySubmissionForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const result = await submitCommunityStory({ name, email, title, body })
      setStatus('done')
      setMessage(result.data.message)
      setName('')
      setEmail('')
      setOrg('')
      setTitle('')
      setBody('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Submission failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-column flex-column--snug">
      <div className="form-group">
        <label htmlFor="story-name" className="form-label">
          Your name
        </label>
        <input
          id="story-name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="story-email" className="form-label">
          Email
        </label>
        <input
          id="story-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="story-org" className="form-label">
          Organization (optional)
        </label>
        <input
          id="story-org"
          className="form-input"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="Cooperative, school, or partner name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="story-title" className="form-label">
          Title
        </label>
        <input
          id="story-title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="story-body" className="form-label">
          Your story
        </label>
        <textarea
          id="story-body"
          className="form-input form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-primary contact-form-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Submit for review'}
      </button>
      {message ? <p className="page-body-text text-body-md mt-note">{message}</p> : null}
    </form>
  )
}
