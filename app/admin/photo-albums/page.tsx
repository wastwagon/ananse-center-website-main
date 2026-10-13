'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import AdminFormSection from '../../../components/admin/AdminFormSection'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus } from '../../../components/admin/AdminStatus'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import MediaPicker from '../../../components/admin/MediaPicker'
import PublicationFields from '../../../components/admin/PublicationFields'
import RelatedOverridesFields from '../../../components/admin/RelatedOverridesFields'
import { PHOTO_COLLECTIONS } from '../../../lib/leadership/taxonomy'
import {
  createAdminPhotoAlbum,
  deleteAdminPhotoAlbum,
  fetchAdminEvents,
  fetchAdminPeople,
  fetchAdminPhotoAlbums,
  fetchAdminPrograms,
  updateAdminPhotoAlbum,
  type AdminEvent,
  type AdminPerson,
  type AdminMedia,
  type AdminPhotoAlbum,
  type AdminPhotoAlbumImage,
  type AdminProgram,
} from '../../../lib/admin-api'
import { mediaFileUrl } from '../../../lib/media'
import {
  fromDatetimeLocal,
  publishedFromStatus,
  statusFromPublished,
  toDatetimeLocal,
} from '../../../lib/publication'
import type { RelatedOverrides } from '../../../lib/related-overrides'

type AlbumImageDraft = { mediaId: string; caption: string; altText: string; sortOrder: number }

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  dateLabel: '',
  place: '',
  collection: PHOTO_COLLECTIONS[0] as string,
  programId: '',
  eventId: '',
  photographer: '',
  rightsNote: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  noindex: false,
  shareMediaId: null as string | null,
  coverMediaId: null as string | null,
  images: [] as AlbumImageDraft[],
  personIds: [] as string[],
  featured: false,
  published: true,
  publicationStatus: 'published',
  scheduledAtLocal: '',
  relatedPinned: {} as RelatedOverrides,
  relatedHidden: {} as RelatedOverrides,
  sortOrder: 0,
}

export default function AdminPhotoAlbumsPage() {
  const [records, setRecords] = useState<AdminPhotoAlbum[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [people, setPeople] = useState<AdminPerson[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [albumsRes, programsRes, eventsRes, peopleRes] = await Promise.all([
        fetchAdminPhotoAlbums(),
        fetchAdminPrograms(),
        fetchAdminEvents(),
        fetchAdminPeople(),
      ])
      setRecords(albumsRes.data)
      setPrograms(programsRes.data)
      setEvents(eventsRes.data)
      setPeople(peopleRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photo albums')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function imagesFromRecord(images: AdminPhotoAlbumImage[]): AlbumImageDraft[] {
    return images.map((img, index) => ({
      mediaId: img.mediaId,
      caption: img.caption ?? '',
      altText: img.altText ?? '',
      sortOrder: img.sortOrder ?? index,
    }))
  }

  function startCreate() {
    setEditingId('new')
    setForm(emptyForm)
  }

  function startEdit(record: AdminPhotoAlbum) {
    setEditingId(record.id)
    setForm({
      title: record.title,
      slug: record.slug,
      description: record.description ?? '',
      dateLabel: record.dateLabel ?? '',
      place: record.place ?? '',
      collection: (record.collection as (typeof PHOTO_COLLECTIONS)[number]) || PHOTO_COLLECTIONS[0],
      programId: record.programId ?? '',
      eventId: record.eventId ?? '',
      photographer: record.photographer ?? '',
      rightsNote: record.rightsNote ?? '',
      seoTitle: record.seoTitle ?? '',
      seoDescription: record.seoDescription ?? '',
      keywords: record.keywords ?? '',
      noindex: record.noindex ?? false,
      shareMediaId: record.shareMediaId ?? null,
      coverMediaId: record.coverMediaId,
      images: imagesFromRecord(record.images ?? []),
      personIds: record.personIds ?? [],
      featured: record.featured,
      published: record.published,
      publicationStatus: record.publicationStatus ?? statusFromPublished(record.published),
      scheduledAtLocal: toDatetimeLocal(record.scheduledAt),
      relatedPinned: record.relatedPinned ?? {},
      relatedHidden: record.relatedHidden ?? {},
      sortOrder: record.sortOrder,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function onAddImage(asset: AdminMedia) {
    if (form.images.some((img) => img.mediaId === asset.id)) return
    setForm((f) => ({
      ...f,
      images: [...f.images, { mediaId: asset.id, caption: '', altText: asset.altText ?? '', sortOrder: f.images.length }],
    }))
  }

  function updateImageCaption(index: number, caption: string) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? { ...img, caption } : img)),
    }))
  }

  function updateImageAlt(index: number, altText: string) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? { ...img, altText } : img)),
    }))
  }

  function removeImage(index: number) {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i })),
    }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const wouldPublish =
      form.publicationStatus === 'published' ||
      publishedFromStatus(form.publicationStatus, form.scheduledAtLocal)
    if (wouldPublish && form.images.length === 0) {
      setError('Add at least one photograph before publishing.')
      return
    }
    if (wouldPublish && !form.rightsNote.trim()) {
      setError('Add a rights note before publishing.')
      return
    }
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description,
        dateLabel: form.dateLabel.trim(),
        place: form.place.trim(),
        collection: form.collection,
        programId: form.programId || null,
        eventId: form.eventId || null,
        photographer: form.photographer.trim(),
        rightsNote: form.rightsNote.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        keywords: form.keywords.trim(),
        noindex: form.noindex,
        shareMediaId: form.shareMediaId,
        coverMediaId: form.coverMediaId,
        images: form.images.map((img, index) => ({
          mediaId: img.mediaId,
          caption: img.caption.trim(),
          altText: img.altText.trim(),
          sortOrder: index,
        })),
        personIds: form.personIds,
        featured: form.featured,
        publicationStatus: form.publicationStatus,
        scheduledAt: fromDatetimeLocal(form.scheduledAtLocal),
        relatedPinned: form.relatedPinned,
        relatedHidden: form.relatedHidden,
        published:
          form.publicationStatus === 'published' ||
          publishedFromStatus(form.publicationStatus, form.scheduledAtLocal),
        sortOrder: form.sortOrder,
      }
      if (editingId && editingId !== 'new') {
        await updateAdminPhotoAlbum(editingId, payload)
        setNotice('Photo album updated.')
      } else {
        await createAdminPhotoAlbum(payload)
        setNotice('Photo album created.')
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
    if (!confirm('Delete this photo album?')) return
    try {
      await deleteAdminPhotoAlbum(id)
      if (editingId === id) resetForm()
      setNotice('Photo album deleted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Photo albums">
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          Photo galleries for the library. Add images from the media library, with an optional caption.
        </p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New album
        </button>
      </div>

      {editingId ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">
            {editingId === 'new' ? 'New album' : 'Edit album'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <AdminFormSection title="Basic information">
            <div className="admin-field">
              <label htmlFor="album-title">Title</label>
              <input
                id="album-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="album-slug">Slug</label>
                <input
                  id="album-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
                <p className="admin-meta">Optional. Leave blank to generate from the title.</p>
              </div>
              <div className="admin-field">
                <label htmlFor="album-collection">Collection</label>
                <select
                  id="album-collection"
                  value={form.collection}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      collection: e.target.value as (typeof PHOTO_COLLECTIONS)[number],
                    }))
                  }
                >
                  {PHOTO_COLLECTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="album-date">Date label</label>
              <input
                id="album-date"
                value={form.dateLabel}
                onChange={(e) => setForm((f) => ({ ...f, dateLabel: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="album-photographer">Photographer / credit</label>
              <input
                id="album-photographer"
                value={form.photographer}
                onChange={(e) => setForm((f) => ({ ...f, photographer: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="album-rights">Permission / rights</label>
              <input
                id="album-rights"
                value={form.rightsNote}
                onChange={(e) => setForm((f) => ({ ...f, rightsNote: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="album-place">Place</label>
              <input
                id="album-place"
                value={form.place}
                onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Main content">
            <div className="admin-field">
              <label>Description</label>
              <CmsRichTextEditor
                value={form.description}
                onChange={(description) => setForm((f) => ({ ...f, description }))}
                placeholder="Album overview…"
                compact
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Classification">
            <div className="admin-field-row">
              <div className="admin-field">
                <label htmlFor="album-seo-title">SEO title</label>
                <input
                  id="album-seo-title"
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="album-seo-description">SEO description</label>
                <input
                  id="album-seo-description"
                  value={form.seoDescription}
                  onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="album-keywords">Keywords</label>
              <input
                id="album-keywords"
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
            <AdminFormSection title="People and relationships">
            <div className="admin-field">
              <label htmlFor="album-program">Linked program (optional)</label>
              <select
                id="album-program"
                className="admin-input"
                value={form.programId}
                onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
              >
                <option value="">— None —</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="album-event">Linked event (optional)</label>
              <select
                id="album-event"
                className="admin-input"
                value={form.eventId}
                onChange={(e) => setForm((f) => ({ ...f, eventId: e.target.value }))}
              >
                <option value="">— None —</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>People in this album</label>
              <div className="admin-choice-stack">
                {people.map((person) => (
                  <label key={person.id} className="admin-toggle-row">
                    <input
                      type="checkbox"
                      checked={form.personIds.includes(person.id)}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          personIds: f.personIds.includes(person.id)
                            ? f.personIds.filter((id) => id !== person.id)
                            : [...f.personIds, person.id],
                        }))
                      }
                    />
                    <span>{person.name}</span>
                  </label>
                ))}
              </div>
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
              <label>Album images</label>
              {form.images.length > 0 ? (
                <div className="admin-album-list">
                  {form.images.map((img, index) => (
                    <div key={img.mediaId} className="admin-album-row">
                      <Image
                        src={mediaFileUrl(img.mediaId)}
                        alt=""
                        width={72}
                        height={72}
                        unoptimized
                        className="admin-cover-preview-image"
                      />
                      <input
                        value={img.caption}
                        placeholder="Caption"
                        aria-label={`Caption for image ${index + 1}`}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                      />
                      <input
                        value={img.altText}
                        placeholder="Alt text"
                        aria-label={`Alt text for image ${index + 1}`}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No images yet.</p>
              )}
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPickerOpen(true)}>
                Add image
              </button>
              <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={onAddImage}
                imagesOnly
              />
            </div>
            </AdminFormSection>
            <AdminFormSection title="Review and permissions">
            <div className="admin-field">
              <label htmlFor="album-sort">Sort order</label>
              <input
                id="album-sort"
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
              <span>Featured</span>
            </label>
              <PublicationFields
                value={{
                  publicationStatus: form.publicationStatus,
                  scheduledAtLocal: form.scheduledAtLocal,
                  published: form.published,
                }}
                checklist={[
                  { label: 'At least one photograph', ok: form.images.length > 0 },
                  { label: 'Rights note', ok: Boolean(form.rightsNote.trim()) },
                  {
                    label: 'Short description',
                    ok: Boolean(form.description.replace(/<[^>]+>/g, '').trim()),
                  },
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
              {editingId !== 'new' && form.slug ? (
                <a
                  className="admin-btn admin-btn--ghost"
                  href={`/library/photo-gallery/${form.slug}`}
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
          <p className="admin-empty">Loading albums…</p>
        ) : records.length === 0 ? (
          <p className="admin-empty">No photo albums yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Collection</th>
                <th>Images</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.title}</strong>
                    <span className="admin-meta">/{record.slug}</span>
                  </td>
                  <td>{record.collection}</td>
                  <td>{record.images?.length ?? 0}</td>
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
