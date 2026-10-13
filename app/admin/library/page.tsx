'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import AdminFormSection from '../../../components/admin/AdminFormSection'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import PublicationFields from '../../../components/admin/PublicationFields'
import RelatedOverridesFields from '../../../components/admin/RelatedOverridesFields'
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
import {
  fromDatetimeLocal,
  publishedFromStatus,
  statusFromPublished,
  toDatetimeLocal,
} from '../../../lib/publication'
import type { RelatedOverrides } from '../../../lib/related-overrides'

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
  duration: '',
  rightsNote: '',
  seoTitle: '',
  seoDescription: '',
  episodeNumber: '' as string,
  dateLabel: '',
  originalAtLocal: '',
  publishedAtLocal: '',
  noindex: false,
  shareMediaId: null as string | null,
  topics: [] as string[],
  programId: '' as string,
  personId: '' as string,
  newsPostId: '' as string,
  eventId: '' as string,
  coverMediaId: null as string | null,
  downloadMediaId: null as string | null,
  downloadUrl: '',
  audioMediaId: null as string | null,
  videoMediaId: null as string | null,
  audioUrl: '',
  videoUrl: '',
  featured: false,
  published: true,
  publicationStatus: 'published',
  scheduledAtLocal: '',
  relatedPinned: {} as RelatedOverrides,
  relatedHidden: {} as RelatedOverrides,
  sortOrder: 0,
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
      duration: record.duration ?? '',
      rightsNote: record.rightsNote ?? '',
      seoTitle: record.seoTitle ?? '',
      seoDescription: record.seoDescription ?? '',
      episodeNumber: record.episodeNumber != null ? String(record.episodeNumber) : '',
      dateLabel: record.dateLabel ?? '',
      originalAtLocal: toDatetimeLocal(record.originalAt),
      publishedAtLocal: toDatetimeLocal(record.publishedAt),
      noindex: record.noindex ?? false,
      shareMediaId: record.shareMediaId ?? null,
      topics: record.topics ?? [],
      programId: record.programId ?? '',
      personId: record.personId ?? '',
      newsPostId: record.newsPostId ?? '',
      eventId: record.eventId ?? '',
      coverMediaId: record.coverMediaId,
      downloadMediaId: record.downloadMediaId ?? null,
      downloadUrl: record.downloadUrl ?? '',
      audioMediaId: record.audioMediaId,
      videoMediaId: record.videoMediaId,
      audioUrl: record.audioUrl ?? '',
      videoUrl: record.videoUrl ?? '',
      featured: record.featured,
      published: record.published,
      publicationStatus: record.publicationStatus ?? statusFromPublished(record.published),
      scheduledAtLocal: toDatetimeLocal(record.scheduledAt),
      relatedPinned: record.relatedPinned ?? {},
      relatedHidden: record.relatedHidden ?? {},
      sortOrder: record.sortOrder,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const wouldPublish =
      form.publicationStatus === 'published' ||
      publishedFromStatus(form.publicationStatus, form.scheduledAtLocal)
    if (wouldPublish && form.topics.length === 0) {
      setError('Choose at least one topic before publishing.')
      return
    }
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
        duration: form.duration.trim(),
        rightsNote: form.rightsNote.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        episodeNumber: Number.isFinite(episode) ? episode : null,
        dateLabel: form.dateLabel.trim(),
        originalAt: fromDatetimeLocal(form.originalAtLocal),
        publishedAt: fromDatetimeLocal(form.publishedAtLocal),
        noindex: form.noindex,
        shareMediaId: form.shareMediaId,
        topics: form.topics,
        programId: form.programId || null,
        personId: form.personId || null,
        newsPostId: form.newsPostId || null,
        eventId: form.eventId || null,
        coverMediaId: form.coverMediaId,
        downloadMediaId: form.downloadMediaId,
        downloadUrl: form.downloadUrl.trim(),
        audioMediaId: form.audioMediaId,
        videoMediaId: form.videoMediaId,
        audioUrl: form.audioUrl.trim(),
        videoUrl: form.videoUrl.trim(),
        featured: form.featured,
        publicationStatus: form.publicationStatus,
        scheduledAt: fromDatetimeLocal(form.scheduledAtLocal),
        relatedPinned: form.relatedPinned,
        relatedHidden: form.relatedHidden,
        published: wouldPublish,
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
            <AdminFormSection title="Basic information">
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
              <label htmlFor="lib-original-at">Original date</label>
              <input
                id="lib-original-at"
                type="datetime-local"
                value={form.originalAtLocal}
                onChange={(e) => setForm((f) => ({ ...f, originalAtLocal: e.target.value }))}
              />
              <p className="admin-meta">When the work was first made. Website publication is separate.</p>
            </div>
            <div className="admin-field">
              <label htmlFor="lib-published-at">Website publication date</label>
              <input
                id="lib-published-at"
                type="datetime-local"
                value={form.publishedAtLocal}
                onChange={(e) => setForm((f) => ({ ...f, publishedAtLocal: e.target.value }))}
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Main content">
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
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => setForm((f) => ({ ...f, noindex: e.target.checked }))}
              />
              <span>Hide from search engines</span>
            </label>
            </AdminFormSection>
            <AdminFormSection title="Images and media">
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
            <CoverMediaField
              label="Social sharing image"
              value={form.shareMediaId}
              onChange={(shareMediaId) => setForm((f) => ({ ...f, shareMediaId }))}
            />
            <CoverMediaField
              label="Download file (media library)"
              value={form.downloadMediaId}
              onChange={(downloadMediaId) => setForm((f) => ({ ...f, downloadMediaId }))}
              imagesOnly={false}
            />
            <div className="admin-field">
              <label htmlFor="lib-download-url">Or download URL</label>
              <input
                id="lib-download-url"
                value={form.downloadUrl}
                onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                placeholder="https://"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lib-duration">Duration</label>
              <input
                id="lib-duration"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="24 min"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lib-rights">Rights / permission</label>
              <input
                id="lib-rights"
                value={form.rightsNote}
                onChange={(e) => setForm((f) => ({ ...f, rightsNote: e.target.value }))}
                placeholder="Permission to publish or embed"
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Classification">
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="lib-seo-title">SEO title</label>
                <input
                  id="lib-seo-title"
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="lib-seo-description">SEO description</label>
                <input
                  id="lib-seo-description"
                  value={form.seoDescription}
                  onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                />
              </div>
            </div>
            </AdminFormSection>
            <AdminFormSection title="People and relationships">
            <div className="admin-field">
              <label>Topics</label>
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
            </AdminFormSection>
            <AdminFormSection title="Review and permissions">
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
              <PublicationFields
                value={{
                  publicationStatus: form.publicationStatus,
                  scheduledAtLocal: form.scheduledAtLocal,
                  published: form.published,
                }}
                checklist={[
                  {
                    label: 'Short description',
                    ok: Boolean(form.description.replace(/<[^>]+>/g, '').trim()),
                  },
                  { label: 'At least one topic', ok: form.topics.length > 0 },
                  {
                    label: 'File, embed, transcript, or body',
                    ok: Boolean(
                      form.body.replace(/<[^>]+>/g, '').trim() ||
                        form.transcript.replace(/<[^>]+>/g, '').trim() ||
                        form.audioUrl.trim() ||
                        form.videoUrl.trim() ||
                        form.downloadUrl.trim() ||
                        form.audioMediaId ||
                        form.videoMediaId ||
                        form.downloadMediaId,
                    ),
                  },
                ]}
                onChange={(next) =>
                  setForm((f) => ({
                    ...f,
                    publicationStatus: next.publicationStatus,
                    scheduledAtLocal: next.scheduledAtLocal,
                    published: next.published,
                  }))
                }
              />
            </AdminFormSection>
            <AdminFormSection title="Related content">
              <RelatedOverridesFields
                pinned={form.relatedPinned}
                hidden={form.relatedHidden}
                onPinnedChange={(relatedPinned) => setForm((f) => ({ ...f, relatedPinned }))}
                onHiddenChange={(relatedHidden) => setForm((f) => ({ ...f, relatedHidden }))}
              />
            </AdminFormSection>
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
                    <AdminStatus
                      value={
                        record.publicationStatus ?? (record.published ? 'published' : 'draft')
                      }
                    />
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
