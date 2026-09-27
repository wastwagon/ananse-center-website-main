'use client'

import { useMemo, useState } from 'react'
import type { ApiArchiveRecord } from '../lib/api'
import CmsRichText from './CmsRichText'
import PremiumFilterBar from './PremiumFilterBar'
import { stripHtmlToPlain } from '../lib/cms/richtext'

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
}

function tagList(items: ApiArchiveRecord[]) {
  const tags: string[] = []
  for (const item of items) {
    for (const tag of item.tags ?? []) {
      if (typeof tag === 'string' && tag.trim()) tags.push(tag.trim())
    }
  }
  return uniqueSorted(tags)
}

export default function ArchivesExplorer({ items }: { items: ApiArchiveRecord[] }) {
  const [query, setQuery] = useState('')
  const [culture, setCulture] = useState('')
  const [era, setEra] = useState('')
  const [tag, setTag] = useState('')

  const cultures = useMemo(() => uniqueSorted(items.map((i) => i.culture)), [items])
  const eras = useMemo(() => uniqueSorted(items.map((i) => i.era)), [items])
  const tags = useMemo(() => tagList(items), [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (culture && item.culture !== culture) return false
      if (era && item.era !== era) return false
      if (tag && !(item.tags ?? []).includes(tag)) return false
      if (!q) return true
      const haystack = [
        item.title,
        stripHtmlToPlain(item.description),
        item.culture,
        item.era,
        stripHtmlToPlain(item.rightsNote),
        ...(item.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, query, culture, era, tag])

  const hasFilters = Boolean(query || culture || era || tag)

  return (
    <div>
      <div
        className="newsletter-inline-form"
        style={{ marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}
        role="search"
      >
        <label htmlFor="archive-search" className="sr-only">
          Search archives
        </label>
        <input
          id="archive-search"
          type="search"
          className="form-input newsletter-form-input"
          placeholder="Search title, description, tags…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: '12rem', flex: '1 1 200px' }}
        />
        {hasFilters ? (
          <button
            type="button"
            className="btn-secondary newsletter-form-btn"
            onClick={() => {
              setQuery('')
              setCulture('')
              setEra('')
              setTag('')
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <PremiumFilterBar
        groups={[
          ...(cultures.length > 0
            ? [
                {
                  label: 'Culture',
                  ariaLabel: 'Filter by culture',
                  value: culture,
                  onChange: setCulture,
                  options: [
                    { value: '', label: 'All cultures' },
                    ...cultures.map((value) => ({ value, label: value })),
                  ],
                },
              ]
            : []),
          ...(eras.length > 0
            ? [
                {
                  label: 'Era',
                  ariaLabel: 'Filter by era',
                  value: era,
                  onChange: setEra,
                  options: [
                    { value: '', label: 'All eras' },
                    ...eras.map((value) => ({ value, label: value })),
                  ],
                },
              ]
            : []),
          ...(tags.length > 0
            ? [
                {
                  label: 'Tags',
                  ariaLabel: 'Filter by tag',
                  value: tag,
                  variant: 'tabs' as const,
                  onChange: setTag,
                  options: [
                    { value: '', label: 'All tags' },
                    ...tags.map((value) => ({ value, label: value })),
                  ],
                },
              ]
            : []),
        ]}
      />

      <p className="page-body-text text-body-sm" style={{ marginBottom: '1rem' }}>
        {filtered.length} of {items.length} records
        {hasFilters ? ' (filtered)' : ''}
      </p>

      {filtered.length === 0 ? (
        <p className="page-body-text">No archive records match your filters.</p>
      ) : (
        <div className="grid-cards grid-cards--stack-narrow">
          {filtered.map((item) => (
            <article key={item.id ?? item.title} className="premium-card">
              <span className="insight-card-tag">
                {item.culture}
                {item.culture && item.era ? ' · ' : ''}
                {item.era}
              </span>
              {(item.tags ?? []).length > 0 ? (
                <p className="page-body-text text-body-sm" style={{ marginTop: '0.35rem' }}>
                  {(item.tags ?? []).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="insight-card-tag"
                      style={{
                        marginRight: '0.35rem',
                        marginBottom: '0.25rem',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'inherit',
                      }}
                      onClick={() => setTag(t)}
                    >
                      {t}
                    </button>
                  ))}
                </p>
              ) : null}
              <h3 className="premium-card-title">{item.title}</h3>
              <CmsRichText body={item.description} className="premium-card-description" />
              <div className="page-body-text text-body-sm">
                <strong>Rights:</strong>{' '}
                <CmsRichText body={item.rightsNote} className="cms-richtext" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
