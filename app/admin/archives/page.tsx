'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  createAdminArchive,
  deleteAdminArchive,
  fetchAdminArchives,
  updateAdminArchive,
  type AdminArchiveRecord,
} from '../../../lib/admin-api'

const emptyForm = {
  title: '',
  description: '',
  culture: '',
  era: '',
  rightsNote: '',
  tagsText: '',
  published: true,
  sortOrder: 0,
}

function tagsToText(tags: unknown) {
  return Array.isArray(tags) ? tags.filter((t) => typeof t === 'string').join(', ') : ''
}

function textToTags(text: string) {
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export default function AdminArchivesPage() {
  const [records, setRecords] = useState<AdminArchiveRecord[]>([])
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
      const { data } = await fetchAdminArchives()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load archives')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function startEdit(record: AdminArchiveRecord) {
    setEditingId(record.id)
    setForm({
      title: record.title,
      description: record.description,
      culture: record.culture,
      era: record.era,
      rightsNote: record.rightsNote,
      tagsText: tagsToText(record.tags),
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
        title: form.title,
        description: form.description,
        culture: form.culture,
        era: form.era,
        rightsNote: form.rightsNote,
        tags: textToTags(form.tagsText),
        published: form.published,
        sortOrder: form.sortOrder,
      }
      if (editingId) {
        await updateAdminArchive(editingId, payload)
        setNotice('Archive record updated.')
      } else {
        await createAdminArchive(payload)
        setNotice('Archive record created.')
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
    if (!confirm('Delete this archive record?')) return
    try {
      await deleteAdminArchive(id)
      if (editingId === id) resetForm()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Digital archives">
      {loading ? <p>Loading archives…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <form className="admin-form admin-card admin-card--spaced" onSubmit={onSubmit}>
        <h2 className="admin-card-title">{editingId ? 'Edit record' : 'Add record'}</h2>
        <div className="admin-field">
          <label htmlFor="archive-title">Title</label>
          <input
            id="archive-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="archive-desc">Description</label>
          <textarea
            id="archive-desc"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="archive-culture">Culture</label>
          <input
            id="archive-culture"
            value={form.culture}
            onChange={(e) => setForm((f) => ({ ...f, culture: e.target.value }))}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="archive-era">Era</label>
          <input
            id="archive-era"
            value={form.era}
            onChange={(e) => setForm((f) => ({ ...f, era: e.target.value }))}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="archive-tags">Tags (comma-separated)</label>
          <input
            id="archive-tags"
            value={form.tagsText}
            onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
            placeholder="oral-history, textiles, sankofa"
          />
        </div>
        <div className="admin-field">
          <label htmlFor="archive-rights">Rights note</label>
          <textarea
            id="archive-rights"
            rows={2}
            value={form.rightsNote}
            onChange={(e) => setForm((f) => ({ ...f, rightsNote: e.target.value }))}
          />
        </div>
        <label className="admin-toggle-row">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          <span>Published on public archives page</span>
        </label>
        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId ? (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-card admin-card--spaced">
        <h2 className="admin-card-title">All records ({records.length})</h2>
        {records.length === 0 ? (
          <p className="admin-help">No archive records yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Culture</th>
                  <th>Published</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {records.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.culture}</td>
                    <td>{row.published ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => startEdit(row)}
                      >
                        Edit
                      </button>{' '}
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => void onDelete(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
