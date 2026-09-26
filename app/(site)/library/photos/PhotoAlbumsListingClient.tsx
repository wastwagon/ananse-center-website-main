'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../../components/LocalizedLink'
import { cardImageSizes } from '../../../../lib/images'
import { PHOTO_COLLECTIONS } from '../../../../lib/leadership/taxonomy'

export type PhotoAlbumListItem = {
  key: string
  title: string
  description: string
  collection: string
  dateLabel: string
  place: string
  href: string
  cover: string
  imageCount: number
  featured: boolean
}

type PhotoAlbumsListingClientProps = {
  viewAlbum: string
  empty: string
  items: PhotoAlbumListItem[]
}

const ALL_COLLECTIONS = 'All collections'

export default function PhotoAlbumsListingClient({
  viewAlbum,
  empty,
  items,
}: PhotoAlbumsListingClientProps) {
  const [collectionFilter, setCollectionFilter] = useState<string>(ALL_COLLECTIONS)

  const filtered = useMemo(() => {
    if (collectionFilter === ALL_COLLECTIONS) return items
    return items.filter((item) => item.collection === collectionFilter)
  }, [collectionFilter, items])

  return (
    <>
      <div className="filter-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="segmented-control" role="tablist" aria-label="Photo collection">
          {[ALL_COLLECTIONS, ...PHOTO_COLLECTIONS].map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={collectionFilter === option}
              onClick={() => setCollectionFilter(option)}
              className={`filter-btn ${collectionFilter === option ? 'filter-btn-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="page-body-text">{empty}</p>
      ) : (
        <div className="grid-cards grid-cards--stack-narrow">
          {filtered.map((item) => (
            <article
              key={item.key}
              className={`premium-card${item.featured ? ' premium-card--featured' : ''}`}
            >
              <div className="premium-card-image-wrapper">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes={cardImageSizes}
                  unoptimized={item.cover.startsWith('/api/')}
                />
              </div>
              <div className="premium-card-header">
                <span className="premium-card-featured-label">{item.collection}</span>
                {item.imageCount > 0 ? (
                  <span className="insight-card-tag">{item.imageCount} photos</span>
                ) : null}
              </div>
              {item.dateLabel ? <p className="premium-card-date">{item.dateLabel}</p> : null}
              <h3 className="premium-card-title">{item.title}</h3>
              {item.place ? (
                <p className="page-body-text text-body-sm" style={{ marginBottom: '0.5rem' }}>
                  {item.place}
                </p>
              ) : null}
              <p className="premium-card-description">{item.description}</p>
              <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
                {viewAlbum}
              </LocalizedLink>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
