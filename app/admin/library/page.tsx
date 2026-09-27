'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import { INSIGHT_TOPICS, LIBRARY_SHELVES } from '../../../lib/leadership/taxonomy'
import {
  createAdminLibraryItem,
  deleteAdminLibraryItem,
  fetchAdminEvents,
  fetchAdminLibrary,
  fetchAdminNews,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminLibraryItem,
  type AdminEvent,
  type AdminLibraryItem,
  type AdminNewsPost,
  type AdminPerson,
  type AdminProgram,
} from '../../../lib/admin-api'

type ShelfKey = (typeof LIBRARY_SHELVES)[number]['key']

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  shelf: 'listen' as ShelfKey,
  collection: LIBRARY_SHELVES[0].items[0] as string,
  body: '',
  transcript: '',
  furtherStudy: '',
  wisdomNugget: '',
  scriptureTheme: '',
  keywords: '',
  episodeNumber: '' as string,
  dateLabel: '',
  publishedAtLocal: '',
  topics: [] as string[],
  programId: '' as string,
  personId: '' as string,
  newsPostId: '' as string,
  eventId: '' as string,
  coverMediaId: null as string | null,
  audioMediaId: null as string | null,
  videoMediaId: null as string | null,
  audioUrl: '',
  videoUrl: '',
  featured: false,
  published: true,
  sortOrder: 0,
}

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

function toggleTopic(topics: string[], topic: string): string[] {
  return topics.includes(topic) ? topics.filter((t) => t !== topic) : [...topics, topic]
}

export default function AdminLibraryPage() {
  const [records, setRecords] = useState<AdminLibraryItem[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [newsPosts, setNewsPosts] = useState<AdminNewsPost[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const collectionOptions = useMemo(() => {
    const shelfDef = LIBRARY_SHELVES.find((s) => s.key === form.shelf)
    return shelfDef?.items ?? []
  }, [form.shelf])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [libraryRes, programsRes, peopleRes, newsRes, eventsRes] = await Promise.all([
        fetchAdminLibrary(),
        fetchAdminPrograms(),
        fetchAdminPeople(),
        fetchAdminNews(),
        fetchAdminEvents(),
      ])
      setRecords(libraryRes.data)
      setPrograms(programsRes.data)
      setPeople(peopleRes.data)
      setNewsPosts(newsRes.data)
      setEvents(eventsRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library')
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

  function startEdit(record: AdminLibraryItem) {
    setEditingId(record.id)
    setForm({
      title: record.title,
      slug: record.slug,
      description: record.description ?? '',
      shelf: (record.shelf as ShelfKey) || 'listen',
      collection: record.collection,
      body: record.body ?? '',
      transcript: record.transcript ?? '',
      furtherStudy: record.furtherStudy ?? '',
      wisdomNugget: record.wisdomNugget ?? '',
      scriptureTheme: record.scriptureTheme ?? '',
      keywords: record.keywords ?? '',
      episodeNumber: record.episodeNumber != null ? String(record.episodeNumber) : '',
      dateLabel: record.dateLabel ?? '',
      publishedAtLocal: toDatetimeLocal(record.publishedAt),
      topics: record.topics ?? [],
      programId: record.programId ?? '',
      personId: record.personId ?? '',
      newsPostId: record.newsPostId ?? '',
      eventId: record.eventId ?? '',
      coverMediaId: record.coverMediaId,
      audioMediaId: record.audioMediaId,
      videoMediaId: record.videoMediaId,
      audioUrl: record.audioUrl ?? '',
      videoUrl: record.videoUrl ?? '',
      featured: record.featured,
      published: record.published,
      sortOrder: record.sortOrder,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const episode = form.episodeNumber.trim() ? Number(form.episodeNumber) : null
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description,
        shelf: form.shelf,
        collection: form.collection,
        body: form.body,
        transcript: form.transcript,
        furtherStudy: form.furtherStudy,
        wisdomNugget: form.wisdomNugget,
        scriptureTheme: form.scriptureTheme,
        keywords: form.keywords.trim(),
        episodeNumber: Number.isFinite(episode) ? episode : null,
        dateLabel: form.dateLabel.trim(),
        publishedAt: fromDatetimeLocal(form.publishedAtLocal),
        topics: form.topics,
        programId: form.programId || null,
        personId: form.personId || null,
        newsPostId: form.newsPostId || null,
        eventId: form.eventId || null,
        coverMediaId: form.coverMediaId,
        audioMediaId: form.audioMediaId,
        videoMediaId: form.videoMediaId,
        audioUrl: form.audioUrl.trim(),
        videoUrl: form.videoUrl.trim(),
        featured: form.featured,
        published: form.published,
        sortOrder: form.sortOrder,
      }
      if (editingId && editingId !== 'new') {
        await updateAdminLibraryItem(editingId, payload)
        setNotice('Library item updated.')
      } else {
        await createAdminLibraryItem(payload)
        setNotice('Library item created.')
      }
      resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this library item?')) return
    try {
      await deleteAdminLibraryItem(id)
      if (editingId === id) resetForm()
      setNotice('Library item deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Library">
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          Listen, Watch, and Read for the library. Photo galleries live under Photo albums.
        </p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New item
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'New item' : 'Edit item'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="lib-title">Title</label>
              <input
                id="lib-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lib-slug">Slug (optional)</label>
              <input
                id="lib-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="lib-shelf">Shelf</label>
                <select
                  id="lib-shelf"
                  value={form.shelf}
                  onChange={(e) => {
                    const shelf = e.target.value as ShelfKey
                    const first = LIBRARY_SHELVES.find((s) => s.key === shelf)?.items[0] ?? ''
                    setForm((f) => ({ ...f, shelf, collection: first }))
                  }}
                >
                  {LIBRARY_SHELVES.map((shelf) => (
                    <option key={shelf.key} value={shelf.key}>
                      {shelf.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="lib-collection">Collection</label>
                <select
                  id="lib-collection"
                  required
                  value={form.collection}
                  onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
                >
                  {collectionOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label>Description</label>
              <CmsRichTextEditor
                value={form.description}
                onChange={(description) => setForm((f) => ({ ...f, description }))}
                placeholder="Short overview for this library record…"
                compact
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lib-date">Date label</label>
              <input
                id="lib-date"
                value={form.dateLabel}
                onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lib-published-at">Published at (optional)</label>
              <input
                id="lib-published-at"
                type="datetime-local"
                value={form.publishedAtLocal}
                onChange={(e) => setForm((f) => ({ ...f, publishedAtLocal: e.target.value }))}
              />
            </div>
            {form.shelf === 'listen' ? (
              <>
                <div className="admin-field">
                  <label htmlFor="lib-episode">Episode number (optional)</label>
                  <input
                    id="lib-episode"
                    type="number"
                    min={1}
                    value={form.episodeNumber}
                    onChange={(e) => setForm((f) => ({ ...f, episodeNumber: e.target.value }))}
                  />
                </div>
                <CoverMediaField
                  label="Audio file (media library)"
                  value={form.audioMediaId}
                  onChange={(audioMediaId) => setForm((f) => ({ ...f, audioMediaId }))}
                  imagesOnly={false}
                />
                <div className="admin-field">
                  <label htmlFor="lib-audio-url">Or external audio URL</label>
                  <input
                    id="lib-audio-url"
                    value={form.audioUrl}
                    onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label>Transcript</label>
                  <CmsRichTextEditor
                    value={form.transcript}
                    onChange={(transcript) => setForm((f) => ({ ...f, transcript }))}
                    placeholder="Episode transcript…"
                  />
                </div>
              </>
            ) : null}
            {form.shelf === 'watch' ? (
              <>
                <CoverMediaField
                  label="Video file (media library)"
                  value={form.videoMediaId}
                  onChange={(videoMediaId) => setForm((f) => ({ ...f, videoMediaId }))}
                  imagesOnly={false}
                />
                <div className="admin-field">
                  <label htmlFor="lib-video-url">Or external video URL</label>
                  <input
                    id="lib-video-url"
                    value={form.videoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label>Transcript (optional)</label>
                  <CmsRichTextEditor
                    value={form.transcript}
                    onChange={(transcript) => setForm((f) => ({ ...f, transcript }))}
                    placeholder="Optional video transcript…"
                    compact
                  />
                </div>
              </>
            ) : null}
            {form.shelf === 'read' ? (
              <>
                <div className="admin-field">
                  <label>Body</label>
                  <CmsRichTextEditor
                    value={form.body}
                    onChange={(body) => setForm((f) => ({ ...f, body }))}
                  />
                </div>
                <div className="admin-field">
                  <label>Wisdom nugget</label>
                  <CmsRichTextEditor
                    value={form.wisdomNugget}
                    onChange={(wisdomNugget) => setForm((f) => ({ ...f, wisdomNugget }))}
                    placeholder="A short reflective takeaway…"
                    compact
                  />
                </div>
                <div className="admin-field">
                  <label>Further study</label>
                  <CmsRichTextEditor
                    value={form.furtherStudy}
                    onChange={(furtherStudy) => setForm((f) => ({ ...f, furtherStudy }))}
                    placeholder="Suggested readings or next steps…"
                    compact
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="lib-scripture">Scripture theme</label>
                  <input
                    id="lib-scripture"
                    value={form.scriptureTheme}
                    onChange={(e) => setForm((f) => ({ ...f, scriptureTheme: e.target.value }))}
                  />
                </div>
              </>
            ) : null}
            <div className="admin-field">
              <label htmlFor="lib-keywords">Keywords</label>
              <input
                id="lib-keywords"
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                placeholder="Comma-separated search terms"
              />
            </div>
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
            <div className="admin-field">
              <label>Topics (optional)</label>
              <div className="admin-choice-row">
                {INSIGHT_TOPICS.map((topic) => (
                  <label key={topic} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.topics.includes(topic)}
                      onChange={() =>
                        setForm((f) => ({ ...f, topics: toggleTopic(f.topics, topic) }))
                      }
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-program">Linked program (optional)</label>
              <select
                id="lib-program"
                className="admin-input"
                value={form.programId}
                onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
              >
                <option value="">— None —</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-person">Linked person (optional)</label>
              <select
                id="lib-person"
                className="admin-input"
                value={form.personId}
                onChange={(e) => setForm((f) => ({ ...f, personId: e.target.value }))}
              >
                <option value="">— None —</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-news">Linked insight / news post (optional)</label>
              <select
                id="lib-news"
                className="admin-input"
                value={form.newsPostId}
                onChange={(e) => setForm((f) => ({ ...f, newsPostId: e.target.value }))}
              >
                <option value="">— None —</option>
                {newsPosts.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-event">Linked event (optional)</label>
              <select
                id="lib-event"
                className="admin-input"
                value={form.eventId}
                onChange={(e) => setForm((f) => ({ ...f, eventId: e.target.value }))}
              >
                <option value="">— None —</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-sort">Sort order</label>
              <input
                id="lib-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </div>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              <span>Featured</span>
            </label>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              <span>Published</span>
            </label>
            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
                Cancel
              </button>
              {editingId !== 'new' && form.slug ? (
                <a
                  className="admin-btn admin-btn--ghost"
                  href={`/library/${form.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview
                </a>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading library…</p>
        ) : records.length === 0 ? (
          <p className="admin-empty">No library items yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Shelf</th>
                <th>Collection</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.title}</strong>
                    <span className="admin-meta">/{record.slug}</span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--neutral">{record.shelf}</span>
                  </td>
                  <td>{record.collection}</td>
                  <td>
                    <AdminStatus value={record.published ? 'published' : 'draft'} />
                  </td>
                  <td>
                    <AdminRowActions
                      items={[
                        { label: 'View', href: `/library/${record.slug}`, external: true },
                        { label: 'Edit', onClick: () => startEdit(record) },
                        { label: 'Delete', tone: 'danger', onClick: () => void onDelete(record.id) },
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
