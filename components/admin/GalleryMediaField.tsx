'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { AdminMedia } from '../../lib/admin-api'
import { mediaFileUrl } from '../../lib/media'
import MediaPicker from './MediaPicker'

type GalleryMediaFieldProps = {
  label?: string
  value: string[]
  onChange: (mediaIds: string[]) => void
  max?: number
}

export default function GalleryMediaField({
  label = 'Gallery images',
  value,
  onChange,
  max = 48,
}: GalleryMediaFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  function onSelect(asset: AdminMedia) {
    if (value.includes(asset.id)) return
    if (value.length >= max) return
    onChange([...value, asset.id])
  }

  function remove(id: string) {
    onChange(value.filter((item) => item !== id))
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      {value.length > 0 ? (
        <div className="admin-actions" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {value.map((id) => (
            <div key={id} style={{ position: 'relative' }}>
              <Image
                src={mediaFileUrl(id)}
                alt=""
                width={80}
                height={80}
                className="admin-cover-preview-image"
                unoptimized
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                style={{ fontSize: '0.7rem', padding: '2px 6px', marginTop: 4 }}
                onClick={() => remove(id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        disabled={value.length >= max}
        onClick={() => setPickerOpen(true)}
      >
        Add image ({value.length}/{max})
      </button>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onSelect}
        imagesOnly
      />
    </div>
  )
}
