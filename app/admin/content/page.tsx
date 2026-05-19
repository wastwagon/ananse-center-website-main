'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  createContentBlock,
  deleteContentBlock,
  fetchContentBlocks,
  updateContentBlock,
  type ContentBlock,
} from '../../../lib/admin-api'

const emptyForm = {
  key: '',
  label: '',
  section: 'general',
  body: '',
  published: true,
}

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchContentBlocks()
      setBlocks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function startEdit(block: ContentBlock) {
    setEditingId(block.id)
    setForm({
      key: block.key,
      label: block.label,
      section: block.section,
      body: block.body,
      published: block.published,
    })
  }

  function startCreate() {
    setEditingId('new')
    setForm(emptyForm)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId === 'new') {
        await createContentBlock(form)
      } else if (editingId) {
        await updateContentBlock(editingId, form)
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
    if (!confirm('Delete this content block?')) return
    try {
      await deleteContentBlock(id)
      if (editingId === id) setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Site content">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Edit text blocks used on the public site. Keys like <code>home.hero.lead</code> map to page
        sections.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New content block
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'Create block' : 'Edit block'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="key">Key</label>
              <input
                id="key"
                required
                pattern="[a-z0-9._-]+"
                disabled={editingId !== 'new'}
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="label">Label</label>
              <input
                id="label"
                required
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="section">Section</label>
              <input
                id="section"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="body">Content</label>
              <textarea
                id="body"
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span>Published on public site</span>
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
          <p>Loading content…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Label</th>
                <th>Section</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <td>
                    <code>{block.key}</code>
                  </td>
                  <td>{block.label}</td>
                  <td>{block.section}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => startEdit(block)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => void onDelete(block.id)}
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
