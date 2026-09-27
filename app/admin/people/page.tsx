'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import { PEOPLE_GROUPS } from '../../../lib/leadership/taxonomy'
import {
  createAdminPerson,
  deleteAdminPerson,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminPerson,
  type AdminPerson,
  type AdminProgram,
} from '../../../lib/admin-api'

const emptyForm = {
  name: '',
  slug: '',
  roleTitle: '',
  expertise: '',
  cohortLabel: '',
  programIds: [] as string[],
  bio: '',
  groups: [] as string[],
  isOrganization: false,
  organizationName: '',
  websiteUrl: '',
  photoMediaId: null as string | null,
  logoMediaId: null as string | null,
  featured: false,
  published: true,
  sortOrder: 0,
}

function toggleGroup(groups: string[], group: string): string[] {
  return groups.includes(group) ? groups.filter((g) => g !== group) : [...groups, group]
}

export default function AdminPeoplePage() {
  const [records, setRecords] = useState<AdminPerson[]>([])
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
      const [peopleRes, programsRes] = await Promise.all([fetchAdminPeople(), fetchAdminPrograms()])
      setRecords(peopleRes.data)
      setPrograms(programsRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load people')
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

  function startEdit(record: AdminPerson) {
    setEditingId(record.id)
    setForm({
      name: record.name,
      slug: record.slug,
      roleTitle: record.roleTitle ?? '',
      expertise: record.expertise ?? '',
      cohortLabel: record.cohortLabel ?? '',
      programIds: record.programIds ?? [],
      bio: record.bio ?? '',
      groups: record.groups ?? [],
      isOrganization: record.isOrganization ?? false,
      organizationName: record.organizationName ?? '',
      websiteUrl: record.websiteUrl ?? '',
      photoMediaId: record.photoMediaId,
      logoMediaId: record.logoMediaId,
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
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        roleTitle: form.roleTitle.trim(),
        expertise: form.expertise.trim(),
        cohortLabel: form.cohortLabel.trim(),
        programIds: form.programIds,
        bio: form.bio,
        groups: form.groups,
        isOrganization: form.isOrganization,
        organizationName: form.isOrganization ? form.organizationName.trim() : '',
        websiteUrl: form.websiteUrl.trim(),
        photoMediaId: form.photoMediaId,
        logoMediaId: form.logoMediaId,
        featured: form.featured,
        published: form.published,
        sortOrder: form.sortOrder,
      }
      if (editingId && editingId !== 'new') {
        await updateAdminPerson(editingId, payload)
        setNotice('Profile updated.')
      } else {
        await createAdminPerson(payload)
        setNotice('Profile created.')
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
    if (!confirm('Delete this profile?')) return
    try {
      await deleteAdminPerson(id)
      if (editingId === id) resetForm()
      setNotice('Profile deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="People">
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          Leadership, mentors, speakers, fellows, and partners. Organizations use a logo; people use a portrait.
        </p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New profile
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'New profile' : 'Edit profile'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.isOrganization}
                onChange={(e) => setForm((f) => ({ ...f, isOrganization: e.target.checked }))}
              />
              <span>Organization / partner (use logo instead of portrait)</span>
            </label>
            <div className="admin-field">
              <label htmlFor="person-name">{form.isOrganization ? 'Display name' : 'Full name'}</label>
              <input
                id="person-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            {form.isOrganization ? (
              <div className="admin-field">
                <label htmlFor="person-org">Organization name (optional label)</label>
                <input
                  id="person-org"
                  value={form.organizationName}
                  onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                />
              </div>
            ) : null}
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="person-slug">Slug</label>
                <input
                  id="person-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-from-name"
                />
                <p className="admin-meta">Optional. Leave blank to generate from the name.</p>
              </div>
              <div className="admin-field">
                <label htmlFor="person-role">Role</label>
                <input
                  id="person-role"
                  value={form.roleTitle}
                  onChange={(e) => setForm((f) => ({ ...f, roleTitle: e.target.value }))}
                  placeholder="Executive Director"
                />
              </div>
            </div>
            <div className="admin-field">
              <label>Groups</label>
              <div className="admin-choice-stack">
                {PEOPLE_GROUPS.map((group) => (
                  <label key={group} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.groups.includes(group)}
                      onChange={() =>
                        setForm((f) => ({ ...f, groups: toggleGroup(f.groups, group) }))
                      }
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="person-expertise">Expertise</label>
                <input
                  id="person-expertise"
                  value={form.expertise}
                  onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
                  placeholder="Leadership, mentoring, public speaking"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="person-cohort">Cohort or season</label>
                <input
                  id="person-cohort"
                  value={form.cohortLabel}
                  onChange={(e) => setForm((f) => ({ ...f, cohortLabel: e.target.value }))}
                  placeholder="2026 Fellows"
                />
              </div>
            </div>
            <div className="admin-field">
              <label>Linked programs</label>
              <div className="admin-choice-stack">
                {programs.map((program) => (
                  <label key={program.id} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.programIds.includes(program.id)}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          programIds: f.programIds.includes(program.id)
                            ? f.programIds.filter((id) => id !== program.id)
                            : [...f.programIds, program.id],
                        }))
                      }
                    />
                    <span>{program.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="admin-field">
              <label>Bio</label>
              <CmsRichTextEditor
                value={form.bio}
                onChange={(bio) => setForm((f) => ({ ...f, bio }))}
                placeholder="Short biography…"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="person-website">Website (optional)</label>
              <input
                id="person-website"
                value={form.websiteUrl}
                onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                placeholder="https://"
              />
            </div>
            {form.isOrganization ? (
              <CoverMediaField
                label="Logo"
                value={form.logoMediaId}
                onChange={(logoMediaId) => setForm((f) => ({ ...f, logoMediaId }))}
              />
            ) : (
              <CoverMediaField
                label="Portrait photo"
                value={form.photoMediaId}
                onChange={(photoMediaId) => setForm((f) => ({ ...f, photoMediaId }))}
              />
            )}
            <div className="admin-field">
              <label htmlFor="person-sort">Sort order</label>
              <input
                id="person-sort"
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
              <span>Featured on people listing</span>
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
                  href={`/people#${form.slug}`}
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
          <p className="admin-empty">Loading people…</p>
        ) : records.length === 0 ? (
          <p className="admin-empty">No profiles yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Groups</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.name}</strong>
                    {record.isOrganization ? (
                      <span className="admin-badge admin-badge--neutral">Org</span>
                    ) : null}
                    <span className="admin-meta">/{record.slug}</span>
                  </td>
                  <td>{record.roleTitle || '—'}</td>
                  <td>{record.groups?.length ? record.groups.join(', ') : '—'}</td>
                  <td>
                    <AdminStatus value={record.published ? 'published' : 'draft'} />
                  </td>
                  <td>
                    <AdminRowActions
                      items={[
                        { label: 'View', href: `/people/${record.slug}`, external: true },
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
