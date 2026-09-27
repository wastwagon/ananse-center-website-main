'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cardImageSizes, images, isUnoptimizedMediaSrc } from '../lib/images'

const FALLBACK = images.events.symposium

type CardCoverProps = {
  src: string | null | undefined
  alt: string
  sizes?: string
  fit?: 'cover' | 'contain'
  className?: string
}

/** Fills the frame without stretching. Cover crops; contain letterboxes. */
export default function CardCover({
  src,
  alt,
  sizes = cardImageSizes,
  fit = 'cover',
  className,
}: CardCoverProps) {
  const initial = src?.trim() || FALLBACK
  const [current, setCurrent] = useState(initial)

  useEffect(() => {
    setCurrent(src?.trim() || FALLBACK)
  }, [src])

  const position = 'center center'

  return (
    <div className={`card-cover${className ? ` ${className}` : ''}`}>
      <Image
        src={current}
        alt={alt}
        fill
        sizes={sizes}
        className={`card-cover-img${fit === 'contain' ? ' card-cover-img--contain' : ''}`}
        style={{ objectFit: fit, objectPosition: position }}
        unoptimized={isUnoptimizedMediaSrc(current)}
        onError={() => {
          if (current !== FALLBACK) setCurrent(FALLBACK)
        }}
      />
    </div>
  )
}
