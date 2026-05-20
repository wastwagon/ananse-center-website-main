'use client'

import Image from 'next/image'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  type AdminMedia,
  deleteAdminMedia,
  fetchAdminMedia,
  updateAdminMedia,
  uploadAdminMedia,
} from '../../../lib/admin-api'
import { formatMediaSize } from '../../../lib/media'

export default function AdminMediaPage() {
  const [items, setItems] = useState<AdminMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'image' | 'file'>('all')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState<AdminMedia | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchAdminMedia({
        q: query.trim() || undefined,
        type: filter === 'all' ? undefined : filter,
        limit: 100,
      })
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [query, filter])

  useEffect(() => {
    const timer = setTimeout(() => {
      void load()
    }, 250)
    return () => clearTimeout(timer)
  }, [load])

  async function onUpload(files: FileList | null) {
    const list = files ? Array.from(files) : []
    if (!list.length) return
    setUploading(true)
    setError(null)
    try {
      for (const file of list) {
        await uploadAdminMedia(file)
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function startEdit(asset: AdminMedia) {
    setEditing(asset)
    setEditAlt(asset.altText)
    setEditTitle(asset.title)
  }

  async function onSaveMeta(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError(null)
    try {
      await updateAdminMedia(editing.id, { altText: editAlt, title: editTitle })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(asset: AdminMedia) {
    if (!confirm(`Delete “${asset.originalName}”? This cannot be undone.`)) return
    setError(null)
    try {
      await deleteAdminMedia(asset.id)
      if (editing?.id === asset.id) setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(
        typeof window !== 'undefined' ? `${window.location.origin}${url}` : url,
      )
    } catch {
      setError('Could not copy URL')
    }
  }

  return (
    <AdminShell title="Media library">
      {error ? <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p> : null}

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-media-toolbar">
          <input
            type="search"
            placeholder="Search by name, title, or alt text…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="admin-media-search"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'image' | 'file')}
            className="admin-media-filter"
          >
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="file">Other files</option>
          </select>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="admin-media-file-input"
            onChange={(e) => void onUpload(e.target.files)}
          />
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Upload files'}
          </button>
        </div>
        <p style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
          Upload images and documents once, then reuse them across events, programs, and the site.
          Files are served from <code>/api/media/file/…</code>.
        </p>
      </div>

      {editing ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Edit attachment</h2>
          <form className="admin-form" onSubmit={onSaveMeta}>
            <div className="admin-field">
              <label htmlFor="media-title">Title</label>
              <input
                id="media-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="media-alt">Alt text (images)</label>
              <input
                id="media-alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              URL: <code>{editing.url}</code>
            </p>
            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p>Loading media…</p>
        ) : items.length === 0 ? (
          <p>No media files match your search.</p>
        ) : (
          <ul className="admin-media-grid admin-media-grid--page">
            {items.map((item) => (
              <li key={item.id} className="admin-media-card">
                <div className="admin-media-card-preview">
                  {item.isImage ? (
                    <Image
                      src={item.url}
                      alt={item.altText || item.originalName}
                      fill
                      className="admin-media-card-image"
                      sizes="200px"
                      unoptimized
                    />
                  ) : (
                    <span className="admin-media-file-icon admin-media-file-icon--large" aria-hidden>
                      📄
                    </span>
                  )}
                </div>
                <div className="admin-media-card-body">
                  <p className="admin-media-card-title">{item.title || item.originalName}</p>
                  <p className="admin-media-card-meta">
                    {formatMediaSize(item.sizeBytes)} · {item.mimeType}
                  </p>
                  <div className="admin-actions" style={{ flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => void copyUrl(item.url)}
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      onClick={() => void onDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  )
}
