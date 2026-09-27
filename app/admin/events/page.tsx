'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import GalleryMediaField from '../../../components/admin/GalleryMediaField'
import { linesToListHtml, listHtmlToLines } from '../../../lib/cms/richtext'
import {
  EVENT_DELIVERY_MODES,
  EVENT_GATHERING_TYPES,
  EVENT_STATUSES,
  deliveryModeLabel,
  eventStatusLabel,
} from '../../../lib/leadership/taxonomy'
import {
  type AdminEvent,
  type AdminPerson,
  type AdminProgram,
  createAdminEvent,
  deleteAdminEvent,
  fetchAdminEvents,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminEvent,
} from '../../../lib/admin-api'

function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDatetimeLocal(value: string): string | null {
  if (!value.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const emptyForm = {
  title: '',
  description: '',
  dateLabel: '',
  startsAtLocal: '',
  endsAtLocal: '',
  timeLabel: '',
  capacity: '',
  registrationStatus: 'auto',
  location: '',
  venue: '',
  type: EVENT_GATHERING_TYPES[0] as string,
  imageEmoji: '📅',
  storyTitle: '',
  storyBody: '',
  highlightsText: '',
  eventStatus: 'scheduled',
  deliveryMode: 'in_person',
  meetingUrl: '',
  recordingUrl: '',
  audioUrl: '',
  subtitle: '',
  transcript: '',
  speakers: [] as { personId: string; role: string }[],
  galleryMediaIds: [] as string[],
  programId: '',
  featured: false,
  published: true,
  coverMediaId: null as string | null,
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [eventsRes, programsRes, peopleRes] = await Promise.all([
        fetchAdminEvents(),
        fetchAdminPrograms(),
        fetchAdminPeople(),
      ])
      setEvents(eventsRes.data)
      setPrograms(programsRes.data)
      setPeople(peopleRes.data)
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
      startsAtLocal: toDatetimeLocal(event.startsAt),
      endsAtLocal: toDatetimeLocal(event.endsAt),
      timeLabel: event.timeLabel ?? '',
      capacity: event.capacity != null ? String(event.capacity) : '',
      registrationStatus: event.registrationStatus || 'auto',
      location: event.location,
      venue: event.venue ?? '',
      type: event.type,
      imageEmoji: event.imageEmoji,
      storyTitle: event.storyTitle ?? '',
      storyBody: event.storyBody ?? '',
      highlightsText: linesToListHtml(event.highlights ?? []),
      eventStatus: event.eventStatus || 'scheduled',
      deliveryMode: event.deliveryMode || 'in_person',
      meetingUrl: event.meetingUrl ?? '',
      recordingUrl: event.recordingUrl ?? '',
      audioUrl: event.audioUrl ?? '',
      subtitle: event.subtitle ?? '',
      transcript: event.transcript ?? '',
      speakers: (event.speakers ?? []).map((speaker) => ({
        personId: speaker.personId,
        role: speaker.role || 'Speaker',
      })),
      galleryMediaIds: event.galleryMediaIds ?? [],
      programId: event.programId ?? '',
      featured: event.featured,
      published: event.published,
      coverMediaId: event.coverMediaId,
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.description.replace(/<[^>]+>/g, '').trim()) {
      setError('Short description is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const capacityValue = form.capacity.trim() ? Number(form.capacity) : null
      const payload = {
        title: form.title,
        description: form.description,
        dateLabel: form.dateLabel,
        startsAt: fromDatetimeLocal(form.startsAtLocal),
        endsAt: fromDatetimeLocal(form.endsAtLocal),
        timeLabel: form.timeLabel,
        capacity: Number.isFinite(capacityValue as number) ? capacityValue : null,
        registrationStatus: form.registrationStatus,
        location: form.location,
        venue: form.venue,
        type: form.type,
        imageEmoji: form.imageEmoji,
        storyTitle: form.storyTitle || null,
        storyBody: form.storyBody || null,
        highlights: listHtmlToLines(form.highlightsText),
        eventStatus: form.eventStatus,
        deliveryMode: form.deliveryMode,
        meetingUrl: form.meetingUrl.trim(),
        recordingUrl: form.recordingUrl.trim(),
        audioUrl: form.audioUrl.trim(),
        subtitle: form.subtitle.trim(),
        transcript: form.transcript,
        speakers: form.speakers.filter((speaker) => speaker.personId),
        galleryMediaIds: form.galleryMediaIds,
        programId: form.programId || null,
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
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">Gatherings, workshops, and festivals shown on the events page.</p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New event
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'New event' : 'Edit event'}
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
              <label htmlFor="subtitle">Subtitle</label>
              <input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Optional line under the title"
              />
            </div>
            <div className="admin-field">
              <label>Short description</label>
              <CmsRichTextEditor
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholder="Card summary for this gathering…"
                compact
              />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="dateLabel">Date label</label>
                <input
                  id="dateLabel"
                  required
                  value={form.dateLabel}
                  onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
                  placeholder="August 15-17, 2026"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="timeLabel">Time label</label>
                <input
                  id="timeLabel"
                  value={form.timeLabel}
                  onChange={(e) => setForm({ ...form, timeLabel: e.target.value })}
                  placeholder="9:00–17:00 daily"
                />
              </div>
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="startsAt">Starts at</label>
                <input
                  id="startsAt"
                  type="datetime-local"
                  value={form.startsAtLocal}
                  onChange={(e) => setForm({ ...form, startsAtLocal: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="endsAt">Ends at</label>
                <input
                  id="endsAt"
                  type="datetime-local"
                  value={form.endsAtLocal}
                  onChange={(e) => setForm({ ...form, endsAtLocal: e.target.value })}
                />
              </div>
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="120"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="registrationStatus">Registration</label>
                <select
                  id="registrationStatus"
                  value={form.registrationStatus}
                  onChange={(e) => setForm({ ...form, registrationStatus: e.target.value })}
                >
                  <option value="auto">Auto (from dates)</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="waitlist">Waitlist</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="admin-field-row">
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
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="type">Gathering type</label>
                <select
                  id="type"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {EVENT_GATHERING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  {!EVENT_GATHERING_TYPES.includes(form.type as (typeof EVENT_GATHERING_TYPES)[number]) ? (
                    <option value={form.type}>{form.type}</option>
                  ) : null}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="eventStatus">Event status</label>
                <select
                  id="eventStatus"
                  value={form.eventStatus}
                  onChange={(e) => setForm({ ...form, eventStatus: e.target.value })}
                >
                  {EVENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {eventStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="deliveryMode">Delivery mode</label>
              <select
                id="deliveryMode"
                className="admin-input"
                value={form.deliveryMode}
                onChange={(e) => setForm({ ...form, deliveryMode: e.target.value })}
              >
                {EVENT_DELIVERY_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {deliveryModeLabel(mode)}
                  </option>
                ))}
              </select>
            </div>
            {form.deliveryMode !== 'in_person' ? (
              <div className="admin-field">
                <label htmlFor="meetingUrl">Online meeting URL</label>
                <input
                  id="meetingUrl"
                  value={form.meetingUrl}
                  onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
                  placeholder="https://"
                />
              </div>
            ) : null}
            <div className="admin-field">
              <label htmlFor="recordingUrl">Recording URL (optional)</label>
              <input
                id="recordingUrl"
                value={form.recordingUrl}
                onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="audioUrl">Audio URL (optional)</label>
              <input
                id="audioUrl"
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="admin-field">
              <label>Transcript</label>
              <CmsRichTextEditor
                value={form.transcript}
                onChange={(transcript) => setForm({ ...form, transcript })}
                placeholder="Recording transcript…"
                compact
              />
            </div>
            <div className="admin-field">
              <label htmlFor="event-speaker">People</label>
              <div className="admin-choice-stack">
                {form.speakers.map((speaker, index) => (
                  <div className="admin-field-row" key={`${speaker.personId}-${index}`}>
                    <select
                      className="admin-input"
                      value={speaker.personId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          speakers: form.speakers.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, personId: e.target.value } : row,
                          ),
                        })
                      }
                    >
                      <option value="">— Person —</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                    <input
                      value={speaker.role}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          speakers: form.speakers.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, role: e.target.value } : row,
                          ),
                        })
                      }
                      placeholder="Speaker"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() =>
                        setForm({
                          ...form,
                          speakers: form.speakers.filter((_, rowIndex) => rowIndex !== index),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  id="event-speaker"
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() =>
                    setForm({
                      ...form,
                      speakers: [...form.speakers, { personId: '', role: 'Speaker' }],
                    })
                  }
                >
                  Add person
                </button>
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="programId">Linked program (optional)</label>
              <select
                id="programId"
                className="admin-input"
                value={form.programId}
                onChange={(e) => setForm({ ...form, programId: e.target.value })}
              >
                <option value="">— None —</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm({ ...form, coverMediaId })}
            />
            <details className="admin-details">
              <summary>Event story</summary>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="imageEmoji">Card mark</label>
                  <input
                    id="imageEmoji"
                    value={form.imageEmoji}
                    onChange={(e) => setForm({ ...form, imageEmoji: e.target.value })}
                  />
                  <p className="admin-meta">Shown only when there is no cover photo.</p>
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
              </div>
              <div className="admin-field">
                <label>Story body</label>
                <CmsRichTextEditor
                  value={form.storyBody}
                  onChange={(storyBody) => setForm({ ...form, storyBody })}
                />
              </div>
              <div className="admin-field">
                <label>Highlights</label>
                <CmsRichTextEditor
                  value={form.highlightsText}
                  onChange={(highlightsText) => setForm({ ...form, highlightsText })}
                  placeholder="Add a bullet for each highlight"
                  compact
                />
              </div>
              <GalleryMediaField
                value={form.galleryMediaIds}
                onChange={(galleryMediaIds) => setForm({ ...form, galleryMediaIds })}
              />
            </details>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <span>Featured</span>
            </label>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span>Published</span>
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
          <p className="admin-empty">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="admin-empty">No events yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Delivery</th>
                <th>Registration</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
                    <span className="admin-meta">/{event.slug}</span>
                  </td>
                  <td>
                    {event.dateLabel}
                    {event.timeLabel ? <span className="admin-meta">{event.timeLabel}</span> : null}
                  </td>
                  <td>{deliveryModeLabel(event.deliveryMode || 'in_person')}</td>
                  <td>
                    <span className="admin-badge admin-badge--neutral">
                      {event.registrationStatus || 'auto'}
                    </span>
                  </td>
                  <td>
                    <AdminStatus value={event.published ? 'published' : 'draft'} />
                  </td>
                  <td>
                    <AdminRowActions
                      items={[
                        { label: 'View', href: `/events/${event.slug}`, external: true },
                        { label: 'Edit', onClick: () => startEdit(event) },
                        { label: 'Delete', tone: 'danger', onClick: () => void onDelete(event.id) },
                      ]}
                    />
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
