'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import {
  createAdminNews,
  deleteAdminNews,
  fetchAdminNews,
  updateAdminNews,
  type AdminNewsPost,
} from '../../../lib/admin-api'

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  dateLabel: '',
  author: '',
  category: 'News',
  featured: false,
  linkHref: '',
  published: true,
  sortOrder: 0,
  coverMediaId: null as string | null,
}

export default function AdminNewsPage() {
  const [records, setRecords] = useState<AdminNewsPost[]>([])
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
      const { data } = await fetchAdminNews()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
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
      author: record.author ?? '',
      category: record.category || 'News',
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
        author: form.author.trim(),
        category: form.category.trim() || 'News',
        featured: form.featured,
        linkHref: form.linkHref.trim(),
        published: form.published,
        sortOrder: form.sortOrder,
        coverMediaId: form.coverMediaId,
      }
      if (editingId && editingId !== 'new') {
        await updateAdminNews(editingId, payload)
        setNotice('News post updated.')
      } else {
        await createAdminNews(payload)
        setNotice('News post created.')
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
    if (!confirm('Delete this news post?')) return
    try {
      await deleteAdminNews(id)
      if (editingId === id) resetForm()
      setNotice('News post deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="News & blog">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Create and publish posts for <code>/news</code>. Use rich text for the full story, optional cover
        photo from Media, and leave External link empty for an on-site article at{' '}
        <code>/news/your-slug</code>.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New post
        </button>
      </div>

      {editingId ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            {editingId === 'new' ? 'Create post' : 'Edit post'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="news-title">Title</label>
              <input
                id="news-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-slug">Slug (optional)</label>
              <input
                id="news-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-from-title"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-date">Date label</label>
              <input
                id="news-date"
                value={form.dateLabel}
                onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
                placeholder="15 August 2026"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-author">Author</label>
              <input
                id="news-author"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Ananse Center"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-category">Category</label>
              <input
                id="news-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="News"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-excerpt">Excerpt (listing summary)</label>
              <textarea
                id="news-excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                required
              />
            </div>
            <div className="admin-field">
              <label>Full story</label>
              <CmsRichTextEditor
                value={form.body}
                onChange={(body) => setForm((f) => ({ ...f, body }))}
                placeholder="Write the full article…"
              />
            </div>
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
            <div className="admin-field">
              <label htmlFor="news-link">External link (optional)</label>
              <input
                id="news-link"
                value={form.linkHref}
                onChange={(e) => setForm((f) => ({ ...f, linkHref: e.target.value }))}
                placeholder="Leave empty for /news/slug — or paste an external URL"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="news-sort">Sort order</label>
              <input
                id="news-sort"
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
              <span>Featured on news listing</span>
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
              {editingId !== 'new' ? (
                <a
                  className="admin-btn admin-btn--ghost"
                  href={`/news/${form.slug}`}
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
          <p>Loading news…</p>
        ) : records.length === 0 ? (
          <p className="admin-help">No posts yet. Create your first article above.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Category</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    {record.title}
                    {record.featured ? (
                      <span className="admin-badge admin-badge--published" style={{ marginLeft: 8 }}>
                        Featured
                      </span>
                    ) : null}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>/{record.slug}</div>
                  </td>
                  <td>{record.dateLabel || '—'}</td>
                  <td>{record.category || 'News'}</td>
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
