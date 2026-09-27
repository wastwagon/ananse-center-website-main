'use client'

import { useMemo, useState } from 'react'
import LocalizedLink from '../../../../components/LocalizedLink'
import CardCover from '../../../../components/CardCover'
import PremiumFilterBar from '../../../../components/PremiumFilterBar'
import { cmsPlainExcerpt } from '../../../../lib/cms/richtext'
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
      <PremiumFilterBar
        groups={[
          {
            label: 'Collection',
            ariaLabel: 'Photo collection',
            value: collectionFilter,
            variant: 'tabs',
            onChange: setCollectionFilter,
            options: [ALL_COLLECTIONS, ...PHOTO_COLLECTIONS].map((option) => ({
              value: option,
              label: option,
            })),
          },
        ]}
      />

      {filtered.length === 0 ? (
        <p className="page-body-text">{empty}</p>
      ) : (
        <div className="grid-cards grid-cards--stack-narrow">
          {filtered.map((item) => (
            <article
              key={item.key}
              className={`premium-card library-listing-card${item.featured ? ' premium-card--featured' : ''}`}
            >
              <div className="premium-card-image-wrapper">
                <CardCover src={item.cover} alt={item.title} />
              </div>
              <div className="premium-card-header">
                <span className="premium-card-featured-label">{item.collection}</span>
                {item.imageCount > 0 ? (
                  <span className="insight-card-tag">{item.imageCount} photos</span>
                ) : null}
              </div>
              {item.dateLabel ? <p className="premium-card-date">{item.dateLabel}</p> : null}
              <h3 className="premium-card-title">{item.title}</h3>
              {item.place ? <p className="library-photo-place">{item.place}</p> : null}
              <p className="premium-card-description">{cmsPlainExcerpt(item.description)}</p>
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
