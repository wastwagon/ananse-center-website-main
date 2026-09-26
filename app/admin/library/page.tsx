'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import { INSIGHT_TOPICS, LIBRARY_SHELVES } from '../../../lib/leadership/taxonomy'
import {
  createAdminLibraryItem,
  deleteAdminLibraryItem,
  fetchAdminLibrary,
  fetchAdminNews,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminLibraryItem,
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
  episodeNumber: '' as string,
  dateLabel: '',
  publishedAtLocal: '',
  topics: [] as string[],
  programId: '' as string,
  personId: '' as string,
  newsPostId: '' as string,
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
      const [libraryRes, programsRes, peopleRes, newsRes] = await Promise.all([
        fetchAdminLibrary(),
        fetchAdminPrograms(),
        fetchAdminPeople(),
        fetchAdminNews(),
      ])
      setRecords(libraryRes.data)
      setPrograms(programsRes.data)
      setPeople(peopleRes.data)
      setNewsPosts(newsRes.data)
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
      episodeNumber: record.episodeNumber != null ? String(record.episodeNumber) : '',
      dateLabel: record.dateLabel ?? '',
      publishedAtLocal: toDatetimeLocal(record.publishedAt),
      topics: record.topics ?? [],
      programId: record.programId ?? '',
      personId: record.personId ?? '',
      newsPostId: record.newsPostId ?? '',
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
        episodeNumber: Number.isFinite(episode) ? episode : null,
        dateLabel: form.dateLabel.trim(),
        publishedAt: fromDatetimeLocal(form.publishedAtLocal),
        topics: form.topics,
        programId: form.programId || null,
        personId: form.personId || null,
        newsPostId: form.newsPostId || null,
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
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Manage Listen, Watch, and Read content for <code>/library</code>. Photo galleries are managed under Photo
        albums.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New item
        </button>
      </div>

      {editingId ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            {editingId === 'new' ? 'Create item' : 'Edit item'}
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
            <div className="admin-field">
              <label htmlFor="lib-shelf">Shelf</label>
              <select
                id="lib-shelf"
                className="admin-input"
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
                className="admin-input"
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
            <div className="admin-field">
              <label htmlFor="lib-desc">Description</label>
              <textarea
                id="lib-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
                  <label htmlFor="lib-transcript">Transcript</label>
                  <textarea
                    id="lib-transcript"
                    rows={6}
                    value={form.transcript}
                    onChange={(e) => setForm((f) => ({ ...f, transcript: e.target.value }))}
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
                  <label htmlFor="lib-transcript-v">Transcript (optional)</label>
                  <textarea
                    id="lib-transcript-v"
                    rows={4}
                    value={form.transcript}
                    onChange={(e) => setForm((f) => ({ ...f, transcript: e.target.value }))}
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
                  <label htmlFor="lib-wisdom">Wisdom nugget</label>
                  <textarea
                    id="lib-wisdom"
                    rows={3}
                    value={form.wisdomNugget}
                    onChange={(e) => setForm((f) => ({ ...f, wisdomNugget: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="lib-study">Further study</label>
                  <textarea
                    id="lib-study"
                    rows={3}
                    value={form.furtherStudy}
                    onChange={(e) => setForm((f) => ({ ...f, furtherStudy: e.target.value }))}
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
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
            <div className="admin-field">
              <label>Topics (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
                {INSIGHT_TOPICS.map((topic) => (
                  <label key={topic} className="admin-toggle-row" style={{ margin: 0 }}>
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
          <p>Loading library…</p>
        ) : records.length === 0 ? (
          <p className="admin-help">No library items yet.</p>
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
                    {record.title}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>/{record.slug}</div>
                  </td>
                  <td>{record.shelf}</td>
                  <td>{record.collection}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        record.published ? 'admin-badge--published' : 'admin-badge--draft'
                      }`}
                    >
                      {record.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => startEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={() => void onDelete(record.id)}
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
