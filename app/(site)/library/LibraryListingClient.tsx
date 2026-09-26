'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import { cardImageSizes } from '../../../lib/images'
import { LIBRARY_SHELVES } from '../../../lib/leadership/taxonomy'

export type LibraryListItem = {
  key: string
  title: string
  description: string
  shelf: string
  collection: string
  dateLabel: string
  episodeNumber: number | null
  href: string
  external?: boolean
  cover: string
  featured: boolean
  kind: 'library' | 'linked-article'
}

type LibraryListingClientProps = {
  readMore: string
  empty: string
  items: LibraryListItem[]
}

const ALL_COLLECTIONS = 'All collections'

export default function LibraryListingClient({
  readMore,
  empty,
  items,
}: LibraryListingClientProps) {
  const [shelf, setShelf] = useState<(typeof LIBRARY_SHELVES)[number]['key']>('listen')
  const [collectionFilter, setCollectionFilter] = useState<string>(ALL_COLLECTIONS)

  const shelfDef = LIBRARY_SHELVES.find((s) => s.key === shelf)
  const collectionOptions = shelfDef?.items ?? []

  const shelfItems = useMemo(
    () => items.filter((item) => item.shelf === shelf),
    [items, shelf],
  )

  const filtered = useMemo(() => {
    if (collectionFilter === ALL_COLLECTIONS) return shelfItems
    return shelfItems.filter((item) => item.collection === collectionFilter)
  }, [collectionFilter, shelfItems])

  return (
    <>
      <div className="filter-scroll" style={{ marginBottom: '1rem' }}>
        <div className="segmented-control" role="tablist" aria-label="Library shelf">
          {LIBRARY_SHELVES.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={shelf === option.key}
              onClick={() => {
                setShelf(option.key)
                setCollectionFilter(ALL_COLLECTIONS)
              }}
              className={`filter-btn ${shelf === option.key ? 'filter-btn-active' : ''}`}
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="segmented-control" role="tablist" aria-label="Library collection">
          {[ALL_COLLECTIONS, ...collectionOptions].map((option) => (
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
                {item.episodeNumber != null ? (
                  <span className="insight-card-tag">Episode {item.episodeNumber}</span>
                ) : null}
              </div>
              {item.dateLabel ? <p className="premium-card-date">{item.dateLabel}</p> : null}
              <h3 className="premium-card-title">{item.title}</h3>
              <p className="premium-card-description">{item.description}</p>
              {item.external && item.href ? (
                <a href={item.href} className="btn-primary premium-card-cta" rel="noopener noreferrer">
                  {readMore}
                </a>
              ) : (
                <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
                  {readMore}
                </LocalizedLink>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
