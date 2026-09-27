'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import { INSIGHT_CONTENT_TYPES, INSIGHT_TOPICS } from '../../../lib/leadership/taxonomy'
import {
  createAdminNews,
  deleteAdminNews,
  fetchAdminNews,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminNews,
  type AdminNewsPost,
  type AdminPerson,
  type AdminProgram,
} from '../../../lib/admin-api'

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
  contentType: INSIGHT_CONTENT_TYPES[0] as string,
  topics: [] as string[],
  showInLibraryRead: false,
  featured: false,
  linkHref: '',
  published: true,
  sortOrder: 0,
  coverMediaId: null as string | null,
}

function toggleTopic(topics: string[], topic: string): string[] {
  return topics.includes(topic) ? topics.filter((t) => t !== topic) : [...topics, topic]
}

export default function AdminInsightsPage() {
  const [records, setRecords] = useState<AdminNewsPost[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
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
      const [newsRes, peopleRes, programsRes] = await Promise.all([
        fetchAdminNews(),
        fetchAdminPeople(),
        fetchAdminPrograms(),
      ])
      setRecords(newsRes.data)
      setPeople(peopleRes.data)
      setPrograms(programsRes.data)
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
      programId: record.programId ?? '',
      contentType:
        (record.contentType as (typeof INSIGHT_CONTENT_TYPES)[number]) ||
        INSIGHT_CONTENT_TYPES[0],
      topics: record.topics ?? [],
      showInLibraryRead: record.showInLibraryRead ?? false,
      featured: record.featured ?? false,
      linkHref: record.linkHref,
      published: record.published,
      sortOrder: record.sortOrder,
      coverMediaId: record.coverMediaId,
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
        category: form.contentType,
        contentType: form.contentType,
        topics: form.topics,
        showInLibraryRead: form.showInLibraryRead,
        featured: form.featured,
        linkHref: form.linkHref.trim(),
        published: form.published,
        sortOrder: form.sortOrder,
        coverMediaId: form.coverMediaId,
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
            </div>
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
              />
            </div>
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
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
                    <AdminStatus value={record.published ? 'published' : 'draft'} />
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
