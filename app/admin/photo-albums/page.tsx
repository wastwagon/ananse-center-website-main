'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import AdminShell from '../../../components/admin/AdminShell'
import CoverMediaField from '../../../components/admin/CoverMediaField'
import MediaPicker from '../../../components/admin/MediaPicker'
import { PHOTO_COLLECTIONS } from '../../../lib/leadership/taxonomy'
import {
  createAdminPhotoAlbum,
  deleteAdminPhotoAlbum,
  fetchAdminEvents,
  fetchAdminPhotoAlbums,
  fetchAdminPrograms,
  updateAdminPhotoAlbum,
  type AdminEvent,
  type AdminMedia,
  type AdminPhotoAlbum,
  type AdminPhotoAlbumImage,
  type AdminProgram,
} from '../../../lib/admin-api'
import { mediaFileUrl } from '../../../lib/media'

type AlbumImageDraft = { mediaId: string; caption: string; sortOrder: number }

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  dateLabel: '',
  place: '',
  collection: PHOTO_COLLECTIONS[0] as string,
  programId: '',
  eventId: '',
  coverMediaId: null as string | null,
  images: [] as AlbumImageDraft[],
  featured: false,
  published: true,
  sortOrder: 0,
}

export default function AdminPhotoAlbumsPage() {
  const [records, setRecords] = useState<AdminPhotoAlbum[]>([])
  const [programs, setPrograms] = useState<AdminProgram[]>([])
  const [events, setEvents] = useState<AdminEvent[]>([])
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
      const [albumsRes, programsRes, eventsRes] = await Promise.all([
        fetchAdminPhotoAlbums(),
        fetchAdminPrograms(),
        fetchAdminEvents(),
      ])
      setRecords(albumsRes.data)
      setPrograms(programsRes.data)
      setEvents(eventsRes.data)
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
      coverMediaId: record.coverMediaId,
      images: imagesFromRecord(record.images ?? []),
      featured: record.featured,
      published: record.published,
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
      images: [...f.images, { mediaId: asset.id, caption: '', sortOrder: f.images.length }],
    }))
  }

  function updateImageCaption(index: number, caption: string) {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? { ...img, caption } : img)),
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
        coverMediaId: form.coverMediaId,
        images: form.images.map((img, index) => ({
          mediaId: img.mediaId,
          caption: img.caption.trim(),
          sortOrder: index,
        })),
        featured: form.featured,
        published: form.published,
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
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Curate photo galleries for <code>/library/photos</code>. Add images from the media library and optional
        captions.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          New album
        </button>
      </div>

      {editingId ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
            {editingId === 'new' ? 'Create album' : 'Edit album'}
          </h2>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="album-title">Title</label>
              <input
                id="album-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="album-slug">Slug (optional)</label>
              <input
                id="album-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="album-collection">Collection</label>
              <select
                id="album-collection"
                className="admin-input"
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
            <div className="admin-field">
              <label htmlFor="album-desc">Description</label>
              <textarea
                id="album-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
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
              <label htmlFor="album-place">Place</label>
              <input
                id="album-place"
                value={form.place}
                onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
              />
            </div>
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
            <CoverMediaField
              value={form.coverMediaId}
              onChange={(coverMediaId) => setForm((f) => ({ ...f, coverMediaId }))}
            />
            <div className="admin-field">
              <label>Album images</label>
              {form.images.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  {form.images.map((img, index) => (
                    <div key={img.mediaId} className="admin-actions" style={{ alignItems: 'flex-start', gap: '0.75rem' }}>
                      <Image
                        src={mediaFileUrl(img.mediaId)}
                        alt=""
                        width={72}
                        height={72}
                        unoptimized
                        className="admin-cover-preview-image"
                      />
                      <input
                        className="admin-input"
                        style={{ flex: 1 }}
                        value={img.caption}
                        placeholder="Caption (optional)"
                        onChange={(e) => updateImageCaption(index, e.target.value)}
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
                <p className="admin-help">No images yet.</p>
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
                  href={`/library/photos/${form.slug}`}
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
          <p>Loading albums…</p>
        ) : records.length === 0 ? (
          <p className="admin-help">No photo albums yet.</p>
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
                    {record.title}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>/{record.slug}</div>
                  </td>
                  <td>{record.collection}</td>
                  <td>{record.images?.length ?? 0}</td>
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
