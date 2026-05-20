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
}

export default function CoverMediaField({
  label = 'Cover image',
  value,
  onChange,
}: CoverMediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const previewUrl = value ? mediaFileUrl(value) : null

  function onSelect(asset: AdminMedia) {
    onChange(asset.id)
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      {previewUrl ? (
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
              Replace
            </button>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => onChange(null)}>
              Remove
            </button>
          </div>
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
        imagesOnly
      />
    </div>
  )
}
