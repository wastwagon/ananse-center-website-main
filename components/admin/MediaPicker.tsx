'use client'

import Image from 'next/image'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Upload } from 'lucide-react'
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
  const titleId = useId()
  const [items, setItems] = useState<AdminMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 200)
    return () => window.clearTimeout(timer)
  }, [query])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchAdminMedia({
        q: debouncedQuery || undefined,
        type: imagesOnly ? 'image' : undefined,
        limit: 60,
      })
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, imagesOnly])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

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

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="admin-media-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-media-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-media-modal-header">
          <h2 id={titleId}>Choose media</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="admin-media-toolbar">
          <input
            ref={searchRef}
            type="search"
            placeholder="Search files…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="admin-media-search"
            aria-label="Search media library"
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
            <Upload size={14} strokeWidth={2} aria-hidden />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        <div
          className={`admin-media-dropzone${dragOver ? ' admin-media-dropzone--active' : ''}`}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            void onUpload(event.dataTransfer.files)
          }}
        >
          Drop an image here to upload, or use Upload.
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-media-grid-wrap">
          {loading ? (
            <p className="admin-media-empty">Loading…</p>
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
                        <FileText size={28} strokeWidth={1.5} />
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
    </div>,
    document.body,
  )
}
