'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import {
  type AdminEvent,
  createAdminEvent,
  deleteAdminEvent,
  fetchAdminEvents,
  updateAdminEvent,
} from '../../../lib/admin-api'

const emptyForm = {
  title: '',
  description: '',
  dateLabel: '',
  location: '',
  venue: '',
  type: 'Festival',
  imageEmoji: '🎭',
  storyTitle: '',
  storyBody: '',
  highlightsText: '',
  featured: false,
  published: true,
  coverMediaId: null as string | null,
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchAdminEvents()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function startCreate() {
    setEditingId('new')
    setForm(emptyForm)
  }

  function startEdit(event: AdminEvent) {
    setEditingId(event.id)
    setForm({
      title: event.title,
      description: event.description,
      dateLabel: event.dateLabel,
      location: event.location,
      venue: event.venue ?? '',
      type: event.type,
      imageEmoji: event.imageEmoji,
      storyTitle: event.storyTitle ?? '',
      storyBody: event.storyBody ?? '',
      highlightsText: (event.highlights ?? []).join('\n'),
      featured: event.featured,
      published: event.published,
      coverMediaId: event.coverMediaId,
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        dateLabel: form.dateLabel,
        location: form.location,
        venue: form.venue,
        type: form.type,
        imageEmoji: form.imageEmoji,
        storyTitle: form.storyTitle || null,
        storyBody: form.storyBody || null,
        highlights: form.highlightsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        featured: form.featured,
        published: form.published,
        coverMediaId: form.coverMediaId,
      }
      if (editingId === 'new') {
        await createAdminEvent(payload)
      } else if (editingId) {
        await updateAdminEvent(editingId, payload)
      }
      setEditingId(null)
      setForm(emptyForm)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this event?')) return
    setError(null)
    try {
      await deleteAdminEvent(id)
      if (editingId === id) setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Events">
      {error ? <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New event
        </button>
      </div>

      {editingId ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            {editingId === 'new' ? 'Create event' : 'Edit event'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="dateLabel">Date label</label>
              <input
                id="dateLabel"
                required
                value={form.dateLabel}
                onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="venue">Venue</label>
              <input
                id="venue"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="type">Type</label>
              <input
                id="type"
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </div>
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm({ ...form, coverMediaId })}
            />
            <div className="admin-field">
              <label htmlFor="imageEmoji">Emoji</label>
              <input
                id="imageEmoji"
                value={form.imageEmoji}
                onChange={(e) => setForm({ ...form, imageEmoji: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="storyTitle">Story heading</label>
              <input
                id="storyTitle"
                value={form.storyTitle}
                onChange={(e) => setForm({ ...form, storyTitle: e.target.value })}
                placeholder="Experience Highlights"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="storyBody">Story body</label>
              <textarea
                id="storyBody"
                rows={6}
                value={form.storyBody}
                onChange={(e) => setForm({ ...form, storyBody: e.target.value })}
                placeholder="Long-form copy for the detail page. Separate paragraphs with a blank line."
              />
            </div>
            <div className="admin-field">
              <label htmlFor="highlightsText">Highlights (one per line)</label>
              <textarea
                id="highlightsText"
                rows={4}
                value={form.highlightsText}
                onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published
            </label>
            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p>Loading events…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    {event.imageEmoji} {event.title}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>/{event.slug}</div>
                  </td>
                  <td>{event.dateLabel}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        event.published ? 'admin-badge--published' : 'admin-badge--draft'
                      }`}
                    >
                      {event.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => startEdit(event)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={() => void onDelete(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
