'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import {
  type AdminProgram,
  createAdminProgram,
  deleteAdminProgram,
  fetchAdminPrograms,
  updateAdminProgram,
} from '../../../lib/admin-api'
import { linesToListHtml, listHtmlToLines } from '../../../lib/cms/richtext'

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
  coverMediaId: null as string | null,
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
      featuresText: linesToListHtml(program.features),
      sortOrder: program.sortOrder,
      published: program.published,
      coverMediaId: program.coverMediaId,
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.description.replace(/<[^>]+>/g, '').trim()) {
      setError('Description is required.')
      return
    }
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
        features: listHtmlToLines(form.featuresText),
        sortOrder: form.sortOrder,
        published: form.published,
        coverMediaId: form.coverMediaId,
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
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          Catalog programs appear on the Programs page. Sankofa tracks appear on the home page teaser.
        </p>
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
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm({ ...form, coverMediaId })}
            />
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
              <label>Description</label>
              <CmsRichTextEditor
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholder="Program overview and story…"
              />
            </div>
            <div className="admin-field-row">
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
            </div>
            <div className="admin-field-row">
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
            </div>
            <div className="admin-field">
              <label>Features</label>
              <CmsRichTextEditor
                value={form.featuresText}
                onChange={(featuresText) => setForm({ ...form, featuresText })}
                placeholder="Add a bullet for each theme this program develops…"
                compact
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
          <p className="admin-empty">Loading programs…</p>
        ) : programs.length === 0 ? (
          <p className="admin-empty">No programs yet.</p>
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
                  <td>
                    <strong>{program.title}</strong>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--neutral">{program.section}</span>
                  </td>
                  <td>{program.category}</td>
                  <td>
                    <AdminStatus value={program.published ? 'published' : 'draft'} />
                  </td>
                  <td>
                    <AdminRowActions
                      items={[
                        { label: 'Edit', onClick: () => startEdit(program) },
                        { label: 'Delete', tone: 'danger', onClick: () => void onDelete(program.id) },
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
