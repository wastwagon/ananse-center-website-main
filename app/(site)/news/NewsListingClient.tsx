'use client'

import { useMemo, useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { cmsPlainExcerpt } from '../../../lib/cms/richtext'

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
      <PremiumFilterBar
        groups={[
          {
            label: 'Kind',
            ariaLabel: 'News and blog filter',
            value: filter,
            onChange: (value) => setFilter(value as (typeof FILTERS)[number]),
            options: FILTERS.map((option) => ({
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
              className={`premium-card${item.featured ? ' premium-card--featured' : ''}`}
            >
              <div className="premium-card-image-wrapper">
                <CardCover src={item.cover} alt={item.title} />
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
              <p className="premium-card-description">{cmsPlainExcerpt(item.excerpt)}</p>
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
