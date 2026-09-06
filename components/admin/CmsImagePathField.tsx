'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { AdminMedia } from '../../lib/admin-api'
import { mediaFileUrl } from '../../lib/media'
import MediaPicker from './MediaPicker'

type CmsImagePathFieldProps = {
  label?: string
  value: string
  onChange: (path: string) => void
}

/** Pick a media library file and store its public URL/path in a CMS text field. */
export default function CmsImagePathField({
  label = 'Image path',
  value,
  onChange,
}: CmsImagePathFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const preview = value.trim() || null

  function onSelect(asset: AdminMedia) {
    onChange(mediaFileUrl(asset.id))
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/... or /api/media/file/..."
      />
      {preview ? (
        <div className="admin-cover-preview" style={{ marginTop: '0.75rem' }}>
          <Image
            src={preview}
            alt=""
            width={240}
            height={135}
            className="admin-cover-preview-image"
            unoptimized
          />
        </div>
      ) : null}
      <div className="admin-actions" style={{ marginTop: '0.5rem' }}>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPickerOpen(true)}>
          Choose from Media Library
        </button>
        {value ? (
          <button type="button" className="admin-btn admin-btn--danger" onClick={() => onChange('')}>
            Clear
          </button>
        ) : null}
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onSelect}
        imagesOnly
      />
    </div>
  )
}
