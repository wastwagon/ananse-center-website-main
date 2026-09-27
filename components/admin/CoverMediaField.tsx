'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { AdminMedia } from '../../lib/admin-api'
import { mediaFileUrl } from '../../lib/media'
import MediaPicker from './MediaPicker'

type CoverMediaFieldProps = {
  label?: string
  value: string | null
  onChange: (mediaId: string | null) => void
  imagesOnly?: boolean
}

export default function CoverMediaField({
  label = 'Cover image',
  value,
  onChange,
  imagesOnly = true,
}: CoverMediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const previewUrl = value ? mediaFileUrl(value) : null

  function onSelect(asset: AdminMedia) {
    onChange(asset.id)
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <p className="admin-help" style={{ marginTop: 0 }}>
        Files come from the shared Media Library. Detach clears this field only — the file stays
        reusable until deleted in Media Library.
      </p>
      {previewUrl && imagesOnly ? (
        <div className="admin-cover-preview">
          <Image
            src={previewUrl}
            alt=""
            width={240}
            height={135}
            className="admin-cover-preview-image"
            unoptimized
          />
          <div className="admin-actions" style={{ marginTop: '0.5rem' }}>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPickerOpen(true)}>
              Replace / choose another
            </button>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => onChange(null)}>
              Detach
            </button>
          </div>
        </div>
      ) : previewUrl ? (
        <div className="admin-actions" style={{ marginBottom: '0.5rem' }}>
          <span className="admin-help">Media selected (id stored; file stays in library)</span>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPickerOpen(true)}>
            Replace / choose another
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={() => onChange(null)}>
            Detach
          </button>
        </div>
      ) : (
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPickerOpen(true)}>
          Choose from library
        </button>
      )}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onSelect}
        selectedId={value}
        imagesOnly={imagesOnly}
      />
    </div>
  )
}
