'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminFormSection from '../../../components/admin/AdminFormSection'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import PublicationFields from '../../../components/admin/PublicationFields'
import RelatedOverridesFields from '../../../components/admin/RelatedOverridesFields'
import { INSIGHT_CONTENT_TYPES, INSIGHT_TOPICS } from '../../../lib/leadership/taxonomy'
import {
  createAdminNews,
  deleteAdminNews,
  fetchAdminEvents,
  fetchAdminNews,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminNews,
  type AdminEvent,
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

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  dateLabel: '',
  subtitle: '',
  author: '',
  authorPersonId: '' as string,
  programId: '' as string,
  extraProgramIds: [] as string[],
  eventIds: [] as string[],
  primaryTopic: '' as string,
  contentType: INSIGHT_CONTENT_TYPES[0] as string,
  topics: [] as string[],
  showInLibraryRead: false,
  featured: false,
  linkHref: '',
  published: true,
  publicationStatus: 'published',
  scheduledAtLocal: '',
  relatedPinned: {} as RelatedOverrides,
  relatedHidden: {} as RelatedOverrides,
  sortOrder: 0,
  coverMediaId: null as string | null,
  imageCredit: '',
  pullQuote: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  noindex: false,
  shareMediaId: null as string | null,
}

function toggleTopic(topics: string[], topic: string): string[] {
  return topics.includes(topic) ? topics.filter((t) => t !== topic) : [...topics, topic]
}

export default function AdminInsightsPage() {
  const [records, setRecords] = useState<AdminNewsPost[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [newsRes, peopleRes, programsRes, eventsRes] = await Promise.all([
        fetchAdminNews(),
        fetchAdminPeople(),
        fetchAdminPrograms(),
        fetchAdminEvents(),
      ])
      setRecords(newsRes.data)
      setPeople(peopleRes.data)
      setPrograms(programsRes.data)
      setEvents(eventsRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights')
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

  function startEdit(record: AdminNewsPost) {
    setEditingId(record.id)
    setForm({
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt,
      body: record.body,
      dateLabel: record.dateLabel,
      subtitle: record.subtitle ?? '',
      author: record.author ?? '',
      authorPersonId: record.authorPersonId ?? '',
      programId: record.programIds?.[0] || record.programId || '',
      extraProgramIds: (record.programIds ?? []).slice(1),
      eventIds: record.eventIds ?? [],
      primaryTopic: record.primaryTopic ?? '',
      contentType:
        (record.contentType as (typeof INSIGHT_CONTENT_TYPES)[number]) ||
        INSIGHT_CONTENT_TYPES[0],
      topics: record.topics ?? [],
      showInLibraryRead: record.showInLibraryRead ?? false,
      featured: record.featured ?? false,
      linkHref: record.linkHref,
      published: record.published,
      publicationStatus: record.publicationStatus ?? statusFromPublished(record.published),
      scheduledAtLocal: toDatetimeLocal(record.scheduledAt),
      relatedPinned: record.relatedPinned ?? {},
      relatedHidden: record.relatedHidden ?? {},
      sortOrder: record.sortOrder,
      coverMediaId: record.coverMediaId,
      imageCredit: record.imageCredit ?? '',
      pullQuote: record.pullQuote ?? '',
      seoTitle: record.seoTitle ?? '',
      seoDescription: record.seoDescription ?? '',
      keywords: record.keywords ?? '',
      noindex: record.noindex ?? false,
      shareMediaId: record.shareMediaId ?? null,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.excerpt.replace(/<[^>]+>/g, '').trim()) {
      setError('Excerpt is required.')
      return
    }
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const payload = {
        title: form.title,
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt,
        body: form.body,
        dateLabel: form.dateLabel.trim(),
        subtitle: form.subtitle.trim(),
        author: form.author.trim(),
        authorPersonId: form.authorPersonId || null,
        programId: form.programId || null,
        programIds: [form.programId, ...form.extraProgramIds].filter(Boolean),
        eventIds: form.eventIds,
        ...(form.primaryTopic ? { primaryTopic: form.primaryTopic } : {}),
        category: form.contentType,
        contentType: form.contentType,
        topics: form.topics,
        showInLibraryRead: form.showInLibraryRead,
        featured: form.featured,
        linkHref: form.linkHref.trim(),
        publicationStatus: form.publicationStatus,
        scheduledAt: fromDatetimeLocal(form.scheduledAtLocal),
        relatedPinned: form.relatedPinned,
        relatedHidden: form.relatedHidden,
        published:
          form.publicationStatus === 'published' ||
          publishedFromStatus(form.publicationStatus, form.scheduledAtLocal),
        sortOrder: form.sortOrder,
        coverMediaId: form.coverMediaId,
        imageCredit: form.imageCredit.trim(),
        pullQuote: form.pullQuote.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        keywords: form.keywords.trim(),
        noindex: form.noindex,
        shareMediaId: form.shareMediaId,
      }
      if (editingId && editingId !== 'new') {
        await updateAdminNews(editingId, payload)
        setNotice('Insight updated.')
      } else {
        await createAdminNews(payload)
        setNotice('Insight created.')
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
    if (!confirm('Delete this insight?')) return
    try {
      await deleteAdminNews(id)
      if (editingId === id) resetForm()
      setNotice('Insight deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Insights">
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          Written reflections and articles for the insights page. Topics power the public filters.
        </p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New insight
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'New insight' : 'Edit insight'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <AdminFormSection title="Basic information">
            <div className="admin-field">
              <label htmlFor="insight-title">Title</label>
              <input
                id="insight-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="insight-slug">Slug (optional)</label>
              <input
                id="insight-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-from-title"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="insight-subtitle">Subtitle</label>
              <input
                id="insight-subtitle"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="insight-type">Content type</label>
                <select
                  id="insight-type"
                  value={form.contentType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contentType: e.target.value as (typeof INSIGHT_CONTENT_TYPES)[number],
                    }))
                  }
                >
                  {INSIGHT_CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="insight-date">Date label</label>
                <input
                  id="insight-date"
                  value={form.dateLabel}
                  onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
                />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="insight-author">Author name</label>
              <input
                id="insight-author"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
              <p className="admin-meta">Used when no person profile is linked.</p>
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="insight-author-person">Author profile</label>
                <select
                  id="insight-author-person"
                  className="admin-input"
                  value={form.authorPersonId}
                  onChange={(e) => setForm((f) => ({ ...f, authorPersonId: e.target.value }))}
                >
                  <option value="">— None —</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="insight-program">Linked program</label>
                <select
                  id="insight-program"
                  className="admin-input"
                  value={form.programId}
                  onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
                >
                  <option value="">— None —</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="insight-primary-topic">Primary category</label>
                <select
                  id="insight-primary-topic"
                  className="admin-input"
                  value={form.primaryTopic}
                  onChange={(e) => setForm((f) => ({ ...f, primaryTopic: e.target.value }))}
                >
                  <option value="">— Choose —</option>
                  {INSIGHT_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label>Also appears on</label>
              <div className="admin-choice-stack">
                {programs
                  .filter((program) => program.id !== form.programId)
                  .map((program) => (
                    <label key={program.id} className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={form.extraProgramIds.includes(program.id)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            extraProgramIds: f.extraProgramIds.includes(program.id)
                              ? f.extraProgramIds.filter((id) => id !== program.id)
                              : [...f.extraProgramIds, program.id],
                          }))
                        }
                      />
                      <span>{program.title}</span>
                    </label>
                  ))}
              </div>
            </div>
            <div className="admin-field">
              <label>Linked gatherings</label>
              <div className="admin-choice-stack">
                {events.map((event) => (
                  <label key={event.id} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.eventIds.includes(event.id)}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          eventIds: f.eventIds.includes(event.id)
                            ? f.eventIds.filter((id) => id !== event.id)
                            : [...f.eventIds, event.id],
                        }))
                      }
                    />
                    <span>{event.title}</span>
                  </label>
                ))}
              </div>
            </div>
            </AdminFormSection>
            <AdminFormSection title="Main content">
            <div className="admin-field">
              <label>Excerpt (listing summary)</label>
              <CmsRichTextEditor
                value={form.excerpt}
                onChange={(excerpt) => setForm((f) => ({ ...f, excerpt }))}
                placeholder="Short summary for cards and search…"
                compact
              />
            </div>
            <div className="admin-field">
              <label>Full story</label>
              <CmsRichTextEditor
                value={form.body}
                onChange={(body) => setForm((f) => ({ ...f, body }))}
                allowEmbeds
                placeholder="Full insight story… Use Embed for YouTube, Vimeo, or audio players."
              />
            </div>
            <div className="admin-field">
              <label htmlFor="insight-quote">Pull quote</label>
              <textarea
                id="insight-quote"
                value={form.pullQuote}
                onChange={(e) => setForm((f) => ({ ...f, pullQuote: e.target.value }))}
                rows={3}
              />
            </div>
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
            <div className="admin-field">
              <label htmlFor="insight-credit">Image credit</label>
              <input
                id="insight-credit"
                value={form.imageCredit}
                onChange={(e) => setForm((f) => ({ ...f, imageCredit: e.target.value }))}
              />
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
              <label htmlFor="insight-link">External link (optional)</label>
              <input
                id="insight-link"
                value={form.linkHref}
                onChange={(e) => setForm((f) => ({ ...f, linkHref: e.target.value }))}
                placeholder="Leave empty for /insights/slug"
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Classification">
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="insight-seo-title">SEO title</label>
                <input
                  id="insight-seo-title"
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="insight-seo-description">SEO description</label>
                <input
                  id="insight-seo-description"
                  value={form.seoDescription}
                  onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="insight-keywords">Keywords</label>
              <input
                id="insight-keywords"
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
            <AdminFormSection title="Review and permissions">
            <div className="admin-field">
              <label htmlFor="insight-sort">Sort order</label>
              <input
                id="insight-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </div>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.showInLibraryRead}
                onChange={(e) => setForm((f) => ({ ...f, showInLibraryRead: e.target.checked }))}
              />
              <span>Also show in Library → Read (when published)</span>
            </label>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              <span>Featured on insights listing</span>
            </label>
              <PublicationFields
                value={{
                  publicationStatus: form.publicationStatus,
                  scheduledAtLocal: form.scheduledAtLocal,
                  published: form.published,
                }}
                checklist={[
                  { label: 'Primary category', ok: Boolean(form.primaryTopic) },
                  { label: 'Excerpt', ok: Boolean(form.excerpt.replace(/<[^>]+>/g, '').trim()) },
                  { label: 'Body', ok: Boolean(form.body.replace(/<[^>]+>/g, '').trim()) },
                  { label: 'Author', ok: Boolean(form.author.trim() || form.authorPersonId) },
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
              {editingId !== 'new' && form.slug && !form.linkHref.trim() ? (
                <a
                  className="admin-btn admin-btn--ghost"
                  href={`/insights/${form.slug}`}
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
          <p className="admin-empty">Loading insights…</p>
        ) : records.length === 0 ? (
          <p className="admin-empty">No insights yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Topics</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.title}</strong>
                    {record.featured ? (
                      <span className="admin-badge admin-badge--neutral">Featured</span>
                    ) : null}
                    <span className="admin-meta">/{record.slug}</span>
                  </td>
                  <td>{record.contentType || record.category || 'Articles'}</td>
                  <td>{record.topics?.length ? record.topics.join(', ') : '—'}</td>
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
                        { label: 'View', href: `/insights/${record.slug}`, external: true },
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
