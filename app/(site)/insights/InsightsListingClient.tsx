'use client'

import { useEffect, useMemo, useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { INSIGHT_CONTENT_TYPES, INSIGHT_TOPICS } from '../../../lib/leadership/taxonomy'
import { cmsPlainExcerpt } from '../../../lib/cms/richtext'

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
  initialType?: string
  initialTopic?: string
}

const ALL_TOPICS = 'All topics'
const ALL_TYPES = 'All Insights'

const TYPE_HREFS: Record<string, string> = {
  [ALL_TYPES]: '/insights',
  Articles: '/insights?type=Articles',
  Essays: '/insights?type=Essays',
  'Leadership Reflections': '/insights?type=Leadership%20Reflections',
  Perspectives: '/insights?type=Perspectives',
  Conversations: '/insights?type=Conversations',
  'Special Reflections': '/insights?type=Special%20Reflections',
}

const TYPE_EMPTY_COPY: Record<string, string> = {
  Articles: 'No articles are listed yet. When ANANSE publishes articles, they will appear here.',
  Essays: 'No essays are listed yet. When ANANSE publishes essays, they will appear here.',
  'Leadership Reflections':
    'No leadership reflections are listed yet. When ANANSE publishes them, they will appear here.',
  Perspectives: 'No perspectives are listed yet. When ANANSE publishes them, they will appear here.',
  Conversations:
    'No conversation pieces are listed yet. When ANANSE publishes conversations for reading, they will appear here.',
  'Special Reflections':
    'No special reflections are listed yet. When ANANSE publishes them, they will appear here.',
}

const TYPE_SECTION_LEAD: Record<string, string> = {
  Articles: 'Clear writing on leadership, character, and practice.',
  Essays: 'Longer explorations of the questions that shape us.',
  'Leadership Reflections': 'Notes on influence, judgment, and responsible leadership.',
  Perspectives: 'Viewpoints that invite dialogue and careful thought.',
  Conversations: 'Dialogue captured for reading and shared reflection.',
  'Special Reflections': 'Distinctive reflections kept with the Insights collection.',
}

function resolveTopicFilter(preferred: string | undefined) {
  const value = preferred?.trim()
  if (!value || value === ALL_TOPICS) return ALL_TOPICS
  if (INSIGHT_TOPICS.includes(value as (typeof INSIGHT_TOPICS)[number])) return value
  return ALL_TOPICS
}

function resolveTypeFilter(preferred: string | undefined) {
  const value = preferred?.trim()
  if (!value) return ALL_TYPES
  if (value === 'All types' || value === ALL_TYPES) return ALL_TYPES
  if (INSIGHT_CONTENT_TYPES.includes(value as (typeof INSIGHT_CONTENT_TYPES)[number])) {
    return value
  }
  return ALL_TYPES
}

function looksLikeDateLabel(value: string) {
  return /\d/.test(value) && /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i.test(value)
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
  const cta = item.external ? (
    <a href={item.href} className="btn-primary insights-card-cta" rel="noopener noreferrer">
      {readMore}
    </a>
  ) : (
    <LocalizedLink href={item.href} className="btn-primary insights-card-cta">
      {readMore}
    </LocalizedLink>
  )

  return (
    <article
      className={`insights-card${featured || item.featured ? ' insights-card--featured' : ''}`}
      aria-label={item.title}
    >
      <div className="insights-card-media">
        <CardCover src={item.cover} alt={item.title} />
      </div>
      <div className="insights-card-body">
        <div className="insights-card-topline">
          <span className="insights-card-type">{item.contentType}</span>
          {item.featured ? <span className="insights-card-featured">Featured</span> : null}
        </div>
        {item.date ? (
          <p className={looksLikeDateLabel(item.date) ? 'insights-card-date' : 'insights-card-kicker'}>
            {item.date}
          </p>
        ) : null}
        <h3 className="insights-card-title">
          {item.external ? (
            <a href={item.href} rel="noopener noreferrer">
              {item.title}
            </a>
          ) : (
            <LocalizedLink href={item.href}>{item.title}</LocalizedLink>
          )}
        </h3>
        {item.author ? <p className="insights-card-author">{item.author}</p> : null}
        <p className="insights-card-copy">{cmsPlainExcerpt(item.excerpt)}</p>
        {item.topics.length > 0 ? (
          <p className="insights-card-topics">{item.topics.slice(0, 3).join(' · ')}</p>
        ) : null}
        {cta}
      </div>
    </article>
  )
}

export default function InsightsListingClient({
  readMore,
  empty,
  items,
  initialType,
  initialTopic,
}: InsightsListingClientProps) {
  const [topicFilter, setTopicFilter] = useState<string>(() => resolveTopicFilter(initialTopic))
  const [typeFilter, setTypeFilter] = useState<string>(() => resolveTypeFilter(initialType))

  useEffect(() => {
    setTypeFilter(resolveTypeFilter(initialType))
  }, [initialType])

  useEffect(() => {
    setTopicFilter(resolveTopicFilter(initialTopic))
  }, [initialTopic])

  const typeOptions = useMemo(() => {
    const present = new Set(items.map((item) => item.contentType).filter(Boolean))
    const navAlways = [
      'Articles',
      'Essays',
      'Leadership Reflections',
      'Perspectives',
      'Conversations',
    ]
    const extras = INSIGHT_CONTENT_TYPES.filter(
      (type) => present.has(type) && !navAlways.includes(type),
    )
    return [...navAlways, ...extras]
  }, [items])

  const typeScopedItems = useMemo(() => {
    if (typeFilter === ALL_TYPES) return items
    return items.filter((item) => item.contentType === typeFilter)
  }, [items, typeFilter])

  const availableTopics = useMemo(() => {
    const present = new Set(typeScopedItems.flatMap((item) => item.topics))
    return INSIGHT_TOPICS.filter((topic) => present.has(topic))
  }, [typeScopedItems])

  useEffect(() => {
    if (topicFilter !== ALL_TOPICS && !availableTopics.includes(topicFilter as (typeof INSIGHT_TOPICS)[number])) {
      setTopicFilter(ALL_TOPICS)
    }
  }, [availableTopics, topicFilter])

  const featuredItems = useMemo(() => {
    if (typeFilter !== ALL_TYPES || topicFilter !== ALL_TOPICS) return []
    return items.filter((item) => item.featured).slice(0, 3)
  }, [items, typeFilter, topicFilter])

  const showFeatured = featuredItems.length > 0 && typeFilter === ALL_TYPES

  const filtered = useMemo(() => {
    return typeScopedItems.filter((item) => {
      return topicFilter === ALL_TOPICS || item.topics.some((topic) => topic === topicFilter)
    })
  }, [typeScopedItems, topicFilter])

  const catalogItems = useMemo(() => {
    if (!showFeatured) return filtered
    const featuredKeys = new Set(featuredItems.map((item) => item.key))
    return filtered.filter((item) => !featuredKeys.has(item.key))
  }, [filtered, featuredItems, showFeatured])

  if (items.length === 0) {
    return (
      <div className="empty-room">
        <p className="page-body-text">{empty}</p>
        <div className="page-cta-buttons insights-listing-empty-actions">
          <LocalizedLink href="/library" className="btn-primary">
            Visit the Library
          </LocalizedLink>
          <LocalizedLink href="/programs" className="btn-outline">
            Explore programs
          </LocalizedLink>
        </div>
      </div>
    )
  }

  const emptyCopy =
    typeFilter !== ALL_TYPES
      ? TYPE_EMPTY_COPY[typeFilter] || `No ${typeFilter.toLowerCase()} are listed yet.`
      : empty

  return (
    <>
      {showFeatured ? (
        <div className="insights-featured-block">
          <div className="insights-section-intro insights-section-intro--center">
            <span className="section-badge">Featured</span>
            <h2 className="page-section-heading">Worth reading next</h2>
          </div>
          <div className="insights-card-grid">
            {featuredItems.map((item) => (
              <InsightCard key={item.key} item={item} readMore={readMore} featured />
            ))}
          </div>
        </div>
      ) : null}

      <div className="insights-section-intro insights-section-intro--split">
        <div>
          <span className="section-badge">Browse</span>
          <h2 className="page-section-heading">
            {topicFilter !== ALL_TOPICS
              ? topicFilter
              : typeFilter === ALL_TYPES
                ? 'All Insights'
                : typeFilter}
          </h2>
          {typeFilter !== ALL_TYPES && TYPE_SECTION_LEAD[typeFilter] ? (
            <p className="page-body-text insights-section-lead">{TYPE_SECTION_LEAD[typeFilter]}</p>
          ) : null}
        </div>
        <LocalizedLink href="/library?shelf=read" className="btn-outline page-section-cta-link">
          Library reading
        </LocalizedLink>
      </div>

      <PremiumFilterBar
        groups={[
          ...(availableTopics.length > 0
            ? [
                {
                  label: 'Topic',
                  ariaLabel: 'Insight topic',
                  value: topicFilter,
                  onChange: setTopicFilter,
                  options: [ALL_TOPICS, ...availableTopics].map((option) => ({
                    value: option,
                    label: option,
                  })),
                },
              ]
            : []),
          {
            label: 'Type',
            ariaLabel: 'Insight content type',
            value: typeFilter,
            variant: 'tabs' as const,
            options: [ALL_TYPES, ...typeOptions].map((option) => ({
              value: option,
              label: option,
              href:
                TYPE_HREFS[option] ??
                (option === ALL_TYPES ? '/insights' : `/insights?type=${encodeURIComponent(option)}`),
            })),
          },
        ]}
      />

      {catalogItems.length === 0 ? (
        <div className="empty-room insights-type-empty">
          <p className="page-body-text">
            {showFeatured
              ? 'Featured pieces are above. Choose another type or topic to see more.'
              : topicFilter !== ALL_TOPICS
                ? `No ${typeFilter === ALL_TYPES ? 'insights' : typeFilter.toLowerCase()} match “${topicFilter}”. Try All topics.`
                : emptyCopy}
          </p>
          <div className="page-cta-buttons insights-listing-empty-actions">
            {typeFilter !== ALL_TYPES ? (
              <LocalizedLink href="/insights" className="btn-primary">
                All Insights
              </LocalizedLink>
            ) : null}
            <LocalizedLink href="/library?shelf=read" className="btn-outline">
              Library reading
            </LocalizedLink>
          </div>
        </div>
      ) : (
        <div className="insights-card-grid">
          {catalogItems.map((item) => (
            <InsightCard key={item.key} item={item} readMore={readMore} />
          ))}
        </div>
      )}
    </>
  )
}
