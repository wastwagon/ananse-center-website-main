'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import {
  type AdminMedia,
  type AdminMediaUsage,
  deleteAdminMedia,
  fetchAdminMedia,
  fetchAdminMediaUsage,
  replaceAdminMediaFile,
  updateAdminMedia,
  uploadAdminMedia,
} from '../../../lib/admin-api'
import { formatMediaSize } from '../../../lib/media'

export default function AdminMediaPage() {
  const [items, setItems] = useState<AdminMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'image' | 'file'>('all')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState<AdminMedia | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [usage, setUsage] = useState<AdminMediaUsage | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

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

  async function loadUsage(assetId: string) {
    setUsageLoading(true)
    setUsage(null)
    try {
      const { data } = await fetchAdminMediaUsage(assetId)
      setUsage(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage')
      setUsage({ total: 0, refs: [] })
    } finally {
      setUsageLoading(false)
    }
  }

  async function onUpload(files: FileList | null) {
    const list = files ? Array.from(files) : []
    if (!list.length) return
    setUploading(true)
    setError(null)
    setNotice(null)
    try {
      for (const file of list) {
        await uploadAdminMedia(file)
      }
      setNotice(`Uploaded ${list.length} file${list.length === 1 ? '' : 's'}.`)
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
    setDeleteConfirm('')
    setNotice(null)
    void loadUsage(asset.id)
  }

  function closeEdit() {
    setEditing(null)
    setUsage(null)
    setDeleteConfirm('')
  }

  async function onSaveMeta(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError(null)
    try {
      const { data } = await updateAdminMedia(editing.id, { altText: editAlt, title: editTitle })
      setEditing(data)
      setNotice('Saved title and alt text.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onReplaceFile(files: FileList | null) {
    const file = files?.[0]
    if (!file || !editing) return
    setReplacing(true)
    setError(null)
    setNotice(null)
    try {
      const { data } = await replaceAdminMediaFile(editing.id, file)
      setEditing(data)
      setNotice('File replaced in place. Same media ID — all attachments keep working.')
      await load()
      await loadUsage(data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replace failed')
    } finally {
      setReplacing(false)
      if (replaceInputRef.current) replaceInputRef.current.value = ''
    }
  }

  async function onDeletePermanent() {
    if (!editing) return
    if (deleteConfirm !== 'DELETE') {
      setError('Type DELETE to confirm permanent removal.')
      return
    }
    setDeleting(true)
    setError(null)
    try {
      await deleteAdminMedia(editing.id)
      setNotice(`Permanently deleted “${editing.originalName}”.`)
      closeEdit()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(
        typeof window !== 'undefined' ? `${window.location.origin}${url}` : url,
      )
      setNotice('URL copied.')
    } catch {
      setError('Could not copy URL')
    }
  }

  return (
    <AdminShell title="Media library">
      {error ? <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p> : null}
      {notice ? <p className="admin-notice" style={{ marginBottom: '1rem' }}>{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          One library for images, PDFs, audio, and video. Upload once, then reuse the file anywhere.
        </p>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Upload files'}
        </button>
      </div>
      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search by name, title, or alt text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search media"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'image' | 'file')}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="image">Images</option>
          <option value="file">Other files</option>
        </select>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,audio/*,video/*"
          className="admin-media-file-input"
          onChange={(e) => void onUpload(e.target.files)}
        />
      </div>

      {editing ? (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-page-tools">
            <div>
              <h2 className="admin-card-title">Manage media</h2>
              <p className="admin-meta">
                {editing.originalName} · {formatMediaSize(editing.sizeBytes)} · {editing.mimeType}
              </p>
            </div>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={closeEdit}>
              Close
            </button>
          </div>

          <div className="admin-media-manage">
            <div className="admin-cover-preview" style={{ minHeight: 140 }}>
              {editing.isImage ? (
                <Image
                  src={editing.url}
                  alt={editing.altText || editing.originalName}
                  width={220}
                  height={140}
                  className="admin-cover-preview-image"
                  unoptimized
                />
              ) : (
                <p className="admin-help" style={{ padding: '1rem' }}>
                  Non-image file
                </p>
              )}
            </div>
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
              <p className="admin-meta">
                Stable URL: <code>{editing.url}</code>
              </p>
              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save metadata'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => void copyUrl(editing.url)}
                >
                  Copy URL
                </button>
              </div>
            </form>
          </div>

          <div className="admin-subcard">
            <h3 className="admin-card-title">Replace file</h3>
            <p className="admin-help">
              Overwrites the bytes on disk. Events, people, albums, and other links keep working because
              the media ID does not change.
            </p>
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*,application/pdf,audio/*,video/*"
              className="admin-media-file-input"
              onChange={(e) => void onReplaceFile(e.target.files)}
            />
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={replacing}
              onClick={() => replaceInputRef.current?.click()}
            >
              {replacing ? 'Replacing…' : 'Choose replacement file'}
            </button>
          </div>

          <div className="admin-subcard">
            <h3 className="admin-card-title">
              Where used {usageLoading ? '' : usage ? `(${usage.total})` : ''}
            </h3>
            {usageLoading ? (
              <p className="admin-help">Checking attachments…</p>
            ) : usage && usage.refs.length === 0 ? (
              <p className="admin-help">Not attached anywhere. Safe to delete if unused.</p>
            ) : (
              <ul className="admin-check-rows">
                {usage?.refs.map((ref) => (
                  <li key={`${ref.kind}-${ref.id}-${ref.field}`} style={{ marginBottom: '0.35rem' }}>
                    <strong>{ref.kind}</strong> · {ref.title} · {ref.field}{' '}
                    <Link href={ref.href} className="admin-inline-link">
                      Open in admin
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-subcard admin-subcard--danger">
            <h3 className="admin-card-title">Permanent delete</h3>
            <p className="admin-help">
              Removes the file from the library and clears it from every record that used it (including
              Site content URL references). This cannot be undone.
            </p>
            {usage && usage.total > 0 ? (
              <p className="admin-help" style={{ color: '#9a3412' }}>
                This file is used in {usage.total} place{usage.total === 1 ? '' : 's'}. Detach is
                automatic on delete.
              </p>
            ) : null}
            <div className="admin-field">
              <label htmlFor="media-delete-confirm">Type DELETE to confirm</label>
              <input
                id="media-delete-confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              disabled={deleting || deleteConfirm !== 'DELETE'}
              onClick={() => void onDeletePermanent()}
            >
              {deleting ? 'Deleting…' : 'Permanently delete'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading media…</p>
        ) : items.length === 0 ? (
          <p className="admin-empty">No files match this search.</p>
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
                      <FileText size={28} strokeWidth={1.5} />
                    </span>
                  )}
                </div>
                <div className="admin-media-card-body">
                  <p className="admin-media-card-title">{item.title || item.originalName}</p>
                  <p className="admin-media-card-meta">
                    {formatMediaSize(item.sizeBytes)} · {item.mimeType}
                  </p>
                  <AdminRowActions
                    items={[
                      { label: 'Manage', onClick: () => startEdit(item) },
                      { label: 'Copy URL', onClick: () => void copyUrl(item.url) },
                    ]}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  )
}
