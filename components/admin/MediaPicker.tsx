'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type AdminMedia,
  fetchAdminMedia,
  uploadAdminMedia,
} from '../../lib/admin-api'
import { formatMediaSize } from '../../lib/media'

type MediaPickerProps = {
  open: boolean
  onClose: () => void
  onSelect: (asset: AdminMedia) => void
  imagesOnly?: boolean
  selectedId?: string | null
}

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  imagesOnly = true,
  selectedId,
}: MediaPickerProps) {
  const [items, setItems] = useState<AdminMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchAdminMedia({
        q: query.trim() || undefined,
        type: imagesOnly ? 'image' : undefined,
        limit: 60,
      })
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [query, imagesOnly])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  async function onUpload(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { data } = await uploadAdminMedia(file)
      setItems((prev) => [data, ...prev])
      onSelect(data)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!open) return null

  return (
    <div className="admin-media-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-media-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-media-modal-header">
          <h2 id="media-picker-title">Media library</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="admin-media-toolbar">
          <input
            type="search"
            placeholder="Search files…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="admin-media-search"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={imagesOnly ? 'image/*' : undefined}
            className="admin-media-file-input"
            onChange={(e) => void onUpload(e.target.files)}
          />
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-media-grid-wrap">
          {loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <p className="admin-media-empty">No files yet. Upload an image to get started.</p>
          ) : (
            <ul className="admin-media-grid">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`admin-media-item${selectedId === item.id ? ' admin-media-item--selected' : ''}`}
                    onClick={() => {
                      onSelect(item)
                      onClose()
                    }}
                  >
                    {item.isImage ? (
                      <Image
                        src={item.url}
                        alt={item.altText || item.originalName}
                        width={160}
                        height={120}
                        className="admin-media-thumb"
                        unoptimized
                      />
                    ) : (
                      <span className="admin-media-file-icon" aria-hidden>
                        📄
                      </span>
                    )}
                    <span className="admin-media-item-name">{item.originalName}</span>
                    <span className="admin-media-item-meta">{formatMediaSize(item.sizeBytes)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
