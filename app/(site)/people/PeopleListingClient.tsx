'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import { cardImageSizes } from '../../../lib/images'
import { PEOPLE_GROUPS } from '../../../lib/leadership/taxonomy'

export type PeopleListItem = {
  key: string
  name: string
  roleTitle: string
  bio: string
  groups: string[]
  href: string
  websiteUrl: string | null
  image: string | null
  isOrganization: boolean
  featured: boolean
}

type PeopleListingClientProps = {
  viewProfile: string
  empty: string
  items: PeopleListItem[]
}

const ALL_GROUPS = 'All groups'

export default function PeopleListingClient({
  viewProfile,
  empty,
  items,
}: PeopleListingClientProps) {
  const [groupFilter, setGroupFilter] = useState<string>(ALL_GROUPS)

  const filtered = useMemo(() => {
    if (groupFilter === ALL_GROUPS) return items
    return items.filter((item) => item.groups.includes(groupFilter))
  }, [groupFilter, items])

  return (
    <>
      <div className="filter-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="segmented-control" role="tablist" aria-label="People group">
          {[ALL_GROUPS, ...PEOPLE_GROUPS].map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={groupFilter === option}
              onClick={() => setGroupFilter(option)}
              className={`filter-btn ${groupFilter === option ? 'filter-btn-active' : ''}`}
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
              {item.image ? (
                <div className="premium-card-image-wrapper">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                    unoptimized={item.image.startsWith('/api/')}
                  />
                </div>
              ) : null}
              <div className="premium-card-header">
                {item.groups[0] ? (
                  <span className="premium-card-featured-label">{item.groups[0]}</span>
                ) : null}
                {item.featured ? <span className="insight-card-tag">Featured</span> : null}
              </div>
              <h3 className="premium-card-title">{item.name}</h3>
              {item.roleTitle ? (
                <p className="page-body-text text-body-sm" style={{ marginBottom: '0.5rem' }}>
                  {item.roleTitle}
                </p>
              ) : null}
              <p className="premium-card-description">{item.bio}</p>
              <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
                {viewProfile}
              </LocalizedLink>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
