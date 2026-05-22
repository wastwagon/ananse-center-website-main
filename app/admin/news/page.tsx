'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
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
  linkHref: '',
  published: true,
  sortOrder: 0,
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

  function startEdit(record: AdminNewsPost) {
    setEditingId(record.id)
    setForm({
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt,
      body: record.body,
      dateLabel: record.dateLabel,
      linkHref: record.linkHref,
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
      const payload = {
        ...form,
        slug: form.slug.trim() || undefined,
        linkHref: form.linkHref.trim(),
      }
      if (editingId) {
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
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="News & updates">
      {loading ? <p>Loading news…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <form className="admin-form admin-card admin-card--spaced" onSubmit={onSubmit}>
        <h2 className="admin-card-title">{editingId ? 'Edit post' : 'Add post'}</h2>
        <div className="admin-field">
          <label htmlFor="news-title">Title</label>
          <input
            id="news-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
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
            placeholder="2025-03-01"
          />
        </div>
        <div className="admin-field">
          <label htmlFor="news-excerpt">Excerpt</label>
          <textarea
            id="news-excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            rows={3}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="news-body">Full story (optional)</label>
          <textarea
            id="news-body"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            rows={8}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="news-link">External link (optional)</label>
          <input
            id="news-link"
            value={form.linkHref}
            onChange={(e) => setForm((f) => ({ ...f, linkHref: e.target.value }))}
            placeholder="https://… or leave empty for /news/slug"
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Published
        </label>
        <div className="admin-form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update post' : 'Create post'}
          </button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-card admin-card--spaced">
        <h2 className="admin-card-title">All posts ({records.length})</h2>
        <ul className="admin-list">
          {records.map((record) => (
            <li key={record.id}>
              <strong>{record.title}</strong>
              {record.published ? '' : ' (draft)'}
              <span className="admin-list-meta"> — {record.dateLabel || record.slug}</span>
              {' '}
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => startEdit(record)}
              >
                Edit
              </button>{' '}
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => void onDelete(record.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  )
}
