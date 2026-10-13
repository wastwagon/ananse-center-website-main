'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminFormSection from '../../../components/admin/AdminFormSection'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import PublicationFields from '../../../components/admin/PublicationFields'
import RelatedOverridesFields from '../../../components/admin/RelatedOverridesFields'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import { INSIGHT_TOPICS } from '../../../lib/leadership/taxonomy'
import {
  type AdminPerson,
  type AdminProgram,
  createAdminProgram,
  deleteAdminProgram,
  fetchAdminPeople,
  fetchAdminPrograms,
  updateAdminProgram,
} from '../../../lib/admin-api'
import { linesToListHtml, listHtmlToLines } from '../../../lib/cms/richtext'
import {
  fromDatetimeLocal,
  publishedFromStatus,
  statusFromPublished,
  toDatetimeLocal,
} from '../../../lib/publication'
import type { RelatedOverrides } from '../../../lib/related-overrides'

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
  category: 'Program',
  section: 'catalog' as 'catalog' | 'sankofa',
  duration: '',
  level: '',
  iconKey: 'BookOpen',
  featuresText: '',
  sortOrder: 0,
  published: true,
  publicationStatus: 'published',
  scheduledAtLocal: '',
  relatedPinned: {} as RelatedOverrides,
  relatedHidden: {} as RelatedOverrides,
  coverMediaId: null as string | null,
  tagline: '',
  summary: '',
  ctaLabel: '',
  ctaHref: '',
  topics: [] as string[],
  keywords: '',
  noindex: false,
  shareMediaId: null as string | null,
  relatedPersonIds: [] as string[],
  seoTitle: '',
  seoDescription: '',
  leadPersonId: '',
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [programsRes, peopleRes] = await Promise.all([fetchAdminPrograms(), fetchAdminPeople()])
      setPrograms(programsRes.data)
      setPeople(peopleRes.data)
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
      publicationStatus:
        program.publicationStatus ?? statusFromPublished(program.published),
      scheduledAtLocal: toDatetimeLocal(program.scheduledAt),
      relatedPinned: program.relatedPinned ?? {},
      relatedHidden: program.relatedHidden ?? {},
      coverMediaId: program.coverMediaId,
      tagline: program.tagline ?? '',
      summary: program.summary ?? '',
      ctaLabel: program.ctaLabel ?? '',
      ctaHref: program.ctaHref ?? '',
      topics: program.topics ?? [],
      keywords: program.keywords ?? '',
      noindex: program.noindex ?? false,
      shareMediaId: program.shareMediaId ?? null,
      relatedPersonIds: program.relatedPersonIds ?? [],
      seoTitle: program.seoTitle ?? '',
      seoDescription: program.seoDescription ?? '',
      leadPersonId: program.leadPersonId ?? '',
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const publishing = form.publicationStatus === 'published' || form.publicationStatus === 'scheduled'
    if (publishing) {
      const missing = [
        !form.tagline.trim() ? 'tagline' : '',
        !form.summary.replace(/<[^>]+>/g, '').trim() ? 'short description' : '',
        !form.description.replace(/<[^>]+>/g, '').trim() ? 'full description' : '',
        form.topics.length === 0 ? 'at least one topic' : '',
        !form.ctaLabel.trim() || !form.ctaHref.trim() ? 'call to action' : '',
      ].filter(Boolean)
      if (missing.length > 0) {
        setError(`Before publication, complete: ${missing.join(', ')}.`)
        return
      }
    } else if (!form.description.replace(/<[^>]+>/g, '').trim()) {
      setError('Full description is required.')
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
        publicationStatus: form.publicationStatus,
        scheduledAt: fromDatetimeLocal(form.scheduledAtLocal),
        relatedPinned: form.relatedPinned,
        relatedHidden: form.relatedHidden,
        published:
          form.publicationStatus === 'published' ||
          publishedFromStatus(form.publicationStatus, form.scheduledAtLocal),
        coverMediaId: form.coverMediaId,
        tagline: form.tagline.trim(),
        summary: form.summary.trim(),
        ctaLabel: form.ctaLabel.trim(),
        ctaHref: form.ctaHref.trim(),
        topics: form.topics,
        keywords: form.keywords.trim(),
        noindex: form.noindex,
        shareMediaId: form.shareMediaId,
        relatedPersonIds: form.relatedPersonIds,
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        leadPersonId: form.leadPersonId || null,
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
            <AdminFormSection title="Basic information">
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
              <label htmlFor="program-tagline">Tagline</label>
              <input
                id="program-tagline"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Short memorable line"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="program-summary">Short description</label>
              <textarea
                id="program-summary"
                rows={3}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="About 30–60 words for cards and search"
              />
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
              <label htmlFor="sortOrder">Display order</label>
              <input
                id="sortOrder"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <details className="admin-field">
              <summary>Display extras</summary>
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
            </details>
            </AdminFormSection>
            <AdminFormSection title="Main content">
            <div className="admin-field">
              <label>Full description</label>
              <CmsRichTextEditor
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholder="Program overview and story…"
              />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="program-cta-label">Call to action</label>
                <input
                  id="program-cta-label"
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  placeholder="Get involved"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="program-cta-href">Call to action link</label>
                <input
                  id="program-cta-href"
                  value={form.ctaHref}
                  onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                  placeholder="/get-involved"
                />
              </div>
            </div>
            <div className="admin-field">
              <label>Topics</label>
              <div className="admin-choice-row">
                {INSIGHT_TOPICS.map((topic) => (
                  <label key={topic} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.topics.includes(topic)}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          topics: current.topics.includes(topic)
                            ? current.topics.filter((item) => item !== topic)
                            : [...current.topics, topic],
                        }))
                      }
                    />
                    <span>{topic}</span>
                  </label>
                ))}
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
            </AdminFormSection>
            <AdminFormSection title="Images and media">
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm({ ...form, coverMediaId })}
            />
            <CoverMediaField
              label="Social sharing image"
              value={form.shareMediaId}
              onChange={(shareMediaId) => setForm({ ...form, shareMediaId })}
            />
            </AdminFormSection>
            <AdminFormSection title="People and relationships">
            <div className="admin-field">
              <label htmlFor="program-lead">Program lead</label>
              <select
                id="program-lead"
                value={form.leadPersonId}
                onChange={(e) => setForm({ ...form, leadPersonId: e.target.value })}
              >
                <option value="">None</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Related people</label>
              <div className="admin-choice-row">
                {people.map((person) => (
                  <label key={person.id} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.relatedPersonIds.includes(person.id)}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          relatedPersonIds: current.relatedPersonIds.includes(person.id)
                            ? current.relatedPersonIds.filter((id) => id !== person.id)
                            : [...current.relatedPersonIds, person.id],
                        }))
                      }
                    />
                    <span>{person.name}</span>
                  </label>
                ))}
              </div>
            </div>
            </AdminFormSection>
            <AdminFormSection title="Classification">
            <div className="admin-field">
              <label htmlFor="program-keywords">Keywords</label>
              <input
                id="program-keywords"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="Comma-separated search terms"
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Publication and SEO">
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="program-seo-title">SEO title</label>
                <input
                  id="program-seo-title"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="program-seo-description">SEO description</label>
                <input
                  id="program-seo-description"
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                />
              </div>
            </div>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => setForm({ ...form, noindex: e.target.checked })}
              />
              <span>Keep this page out of search engines</span>
            </label>
            </AdminFormSection>
            <AdminFormSection title="Review and permissions">
              <PublicationFields
                checklist={[
                  { label: 'Tagline', ok: Boolean(form.tagline.trim()) },
                  { label: 'Short description', ok: Boolean(form.summary.trim()) },
                  { label: 'Full description', ok: Boolean(form.description.replace(/<[^>]+>/g, '').trim()) },
                  { label: 'Topics', ok: form.topics.length > 0 },
                  { label: 'Call to action', ok: Boolean(form.ctaLabel.trim() && form.ctaHref.trim()) },
                ]}
                value={{
                  publicationStatus: form.publicationStatus,
                  scheduledAtLocal: form.scheduledAtLocal,
                  published: form.published,
                }}
                onChange={(next) =>
                  setForm({
                    ...form,
                    publicationStatus: next.publicationStatus,
                    scheduledAtLocal: next.scheduledAtLocal,
                    published: next.published,
                  })
                }
              />
            </AdminFormSection>
            <AdminFormSection title="Related content">
              <RelatedOverridesFields
                pinned={form.relatedPinned}
                hidden={form.relatedHidden}
                onPinnedChange={(relatedPinned) => setForm({ ...form, relatedPinned })}
                onHiddenChange={(relatedHidden) => setForm({ ...form, relatedHidden })}
              />
            </AdminFormSection>
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
                    <AdminStatus
                      value={
                        program.publicationStatus ??
                        (program.published ? 'published' : 'draft')
                      }
                    />
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
