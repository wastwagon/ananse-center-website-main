'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  type AdminProgram,
  createAdminProgram,
  deleteAdminProgram,
  fetchAdminPrograms,
  updateAdminProgram,
} from '../../../lib/admin-api'

const ICON_OPTIONS = [
  'Palette',
  'Music',
  'BookOpen',
  'Brush',
  'Drama',
  'Award',
  'UserCircle',
  'Bird',
  'Salad',
  'Sun',
]

const emptyForm = {
  title: '',
  description: '',
  category: 'Arts Education',
  section: 'catalog' as 'catalog' | 'sankofa',
  duration: '',
  level: '',
  iconKey: 'BookOpen',
  featuresText: '',
  sortOrder: 0,
  published: true,
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchAdminPrograms()
      setPrograms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs')
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

  function startEdit(program: AdminProgram) {
    setEditingId(program.id)
    setForm({
      title: program.title,
      description: program.description,
      category: program.category,
      section: program.section,
      duration: program.duration,
      level: program.level,
      iconKey: program.iconKey,
      featuresText: program.features.join('\n'),
      sortOrder: program.sortOrder,
      published: program.published,
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        section: form.section,
        duration: form.duration,
        level: form.level,
        iconKey: form.iconKey,
        features: form.featuresText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        sortOrder: form.sortOrder,
        published: form.published,
      }
      if (editingId === 'new') {
        await createAdminProgram(payload)
      } else if (editingId) {
        await updateAdminProgram(editingId, payload)
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
    if (!confirm('Delete this program?')) return
    try {
      await deleteAdminProgram(id)
      if (editingId === id) setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Programs">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Catalog programs appear on the Programs page; Sankofa tracks appear on the home page teaser.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New program
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">{editingId === 'new' ? 'Create program' : 'Edit program'}</h2>
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
              <label htmlFor="section">Section</label>
              <select
                id="section"
                value={form.section}
                onChange={(e) =>
                  setForm({ ...form, section: e.target.value as 'catalog' | 'sankofa' })
                }
              >
                <option value="catalog">Catalog (Programs page)</option>
                <option value="sankofa">Sankofa (Home teaser)</option>
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="duration">Duration</label>
              <input
                id="duration"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="level">Level</label>
              <input
                id="level"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="iconKey">Icon</label>
              <select
                id="iconKey"
                value={form.iconKey}
                onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
              >
                {ICON_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="sortOrder">Sort order</label>
              <input
                id="sortOrder"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="featuresText">Features (one per line)</label>
              <textarea
                id="featuresText"
                rows={4}
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
              />
            </div>
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
          <p>Loading programs…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Section</th>
                <th>Category</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.title}</td>
                  <td>{program.section}</td>
                  <td>{program.category}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        program.published ? 'admin-badge--published' : 'admin-badge--draft'
                      }`}
                    >
                      {program.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        onClick={() => startEdit(program)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => void onDelete(program.id)}
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
