'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import { cardImageSizes } from '../../../lib/images'
import { INSIGHT_CONTENT_TYPES, INSIGHT_TOPICS } from '../../../lib/leadership/taxonomy'

export type InsightListItem = {
  key: string
  date: string
  title: string
  excerpt: string
  author: string
  contentType: string
  topics: string[]
  featured: boolean
  href: string
  external: boolean
  cover: string
}

type InsightsListingClientProps = {
  readMore: string
  empty: string
  items: InsightListItem[]
}

const ALL_TOPICS = 'All topics'
const ALL_TYPES = 'All types'

export default function InsightsListingClient({
  readMore,
  empty,
  items,
}: InsightsListingClientProps) {
  const [topicFilter, setTopicFilter] = useState<string>(ALL_TOPICS)
  const [typeFilter, setTypeFilter] = useState<string>(ALL_TYPES)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesTopic =
        topicFilter === ALL_TOPICS || item.topics.some((t) => t === topicFilter)
      const matchesType =
        typeFilter === ALL_TYPES || item.contentType === typeFilter
      return matchesTopic && matchesType
    })
  }, [items, topicFilter, typeFilter])

  const featured = useMemo(
    () => filtered.filter((item) => item.featured),
    [filtered],
  )
  const catalog = useMemo(() => {
    const featuredKeys = new Set(featured.map((item) => item.key))
    return filtered.filter((item) => !featuredKeys.has(item.key))
  }, [filtered, featured])

  return (
    <>
      <div className="filter-scroll" style={{ marginBottom: '1rem' }}>
        <div className="segmented-control" role="tablist" aria-label="Insight content type">
          {[ALL_TYPES, ...INSIGHT_CONTENT_TYPES].map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={typeFilter === option}
              onClick={() => setTypeFilter(option)}
              className={`filter-btn ${typeFilter === option ? 'filter-btn-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-scroll" style={{ marginBottom: '1.5rem' }}>
        <div className="segmented-control" role="tablist" aria-label="Insight topic">
          {[ALL_TOPICS, ...INSIGHT_TOPICS].map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={topicFilter === option}
              onClick={() => setTopicFilter(option)}
              className={`filter-btn ${topicFilter === option ? 'filter-btn-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="page-body-text">{empty}</p>
      ) : (
        <>
          {featured.length > 0 ? (
            <div className="grid-cards grid-cards--stack-narrow" style={{ marginBottom: '2rem' }}>
              {featured.map((item) => (
                <InsightCard key={item.key} item={item} readMore={readMore} featured />
              ))}
            </div>
          ) : null}
          {catalog.length > 0 ? (
            <div className="grid-cards grid-cards--stack-narrow">
              {catalog.map((item) => (
                <InsightCard key={item.key} item={item} readMore={readMore} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

function InsightCard({
  item,
  readMore,
  featured = false,
}: {
  item: InsightListItem
  readMore: string
  featured?: boolean
}) {
  return (
    <article className={`premium-card${featured ? ' premium-card--featured' : ''}`}>
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
        <span className="premium-card-featured-label">{item.contentType}</span>
        {featured ? <span className="insight-card-tag">Featured</span> : null}
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
          <a href={item.href} className="btn-primary premium-card-cta" rel="noopener noreferrer">
            {readMore}
          </a>
        ) : (
          <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
            {readMore}
          </LocalizedLink>
        )
      ) : null}
    </article>
  )
}
