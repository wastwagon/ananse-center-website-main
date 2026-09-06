'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import { cardImageSizes } from '../../../lib/images'

export type NewsListItem = {
  key: string
  date: string
  title: string
  excerpt: string
  author: string
  category: string
  featured: boolean
  href: string
  external: boolean
  cover: string
}

type NewsListingClientProps = {
  readMore: string
  empty: string
  items: NewsListItem[]
}

const FILTERS = ['All', 'News', 'Blog'] as const

export default function NewsListingClient({ readMore, empty, items }: NewsListingClientProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const filtered = useMemo(() => {
    if (filter === 'All') return items
    return items.filter((item) => item.category.toLowerCase() === filter.toLowerCase())
  }, [filter, items])

  return (
    <>
      <div className="filter-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="segmented-control" role="tablist" aria-label="News and blog filter">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={filter === option}
              onClick={() => setFilter(option)}
              className={`filter-btn ${filter === option ? 'filter-btn-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="page-body-text">{empty}</p>
      ) : (
        <div className="grid-cards">
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
                <span className="premium-card-featured-label">{item.category}</span>
                {item.featured ? <span className="insight-card-tag">Featured</span> : null}
              </div>
              {item.date ? <p className="premium-card-date">{item.date}</p> : null}
              <h3 className="premium-card-title">{item.title}</h3>
              {item.author ? (
                <p className="page-body-text text-body-sm" style={{ marginBottom: '0.5rem' }}>
                  {item.author}
                </p>
              ) : null}
              <p className="premium-card-description">{item.excerpt}</p>
              {item.href ? (
                item.external ? (
                  <a
                    href={item.href}
                    className="btn-primary premium-card-cta"
                    rel="noopener noreferrer"
                  >
                    {readMore}
                  </a>
                ) : (
                  <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
                    {readMore}
                  </LocalizedLink>
                )
              ) : null}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
