'use client'

import { useEffect, useState } from 'react'
import { searchSite, type SearchResults } from '../lib/api'
import LocalizedLink from './LocalizedLink'

type SiteSearchProps = {
  initialQuery?: string
}

const SEARCH_KINDS = [
  { id: 'all', label: 'All' },
  { id: 'programs', label: 'Programs' },
  { id: 'events', label: 'Events' },
  { id: 'insights', label: 'Insights' },
  { id: 'library', label: 'Library' },
  { id: 'people', label: 'People' },
  { id: 'photos', label: 'Photographs' },
  { id: 'pages', label: 'Pages' },
] as const

type SearchKind = (typeof SEARCH_KINDS)[number]['id']

export default function SiteSearch({ initialQuery = '' }: SiteSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [kind, setKind] = useState<SearchKind>('all')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function runSearch(q: string) {
    const trimmed = q.trim()
    if (trimmed.length < 2) return
    setStatus('loading')
    try {
      const data = await searchSite(trimmed)
      setResults(data)
      setStatus('idle')
    } catch {
      setStatus('error')
      setResults(null)
    }
  }

  useEffect(() => {
    if (initialQuery.trim().length >= 2) {
      void runSearch(initialQuery)
    }
    // Intentionally once on mount for deep-linked navbar searches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await runSearch(query)
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="newsletter-inline-form" role="search">
        <label htmlFor="site-search" className="sr-only">
          Search
        </label>
        <input
          id="site-search"
          type="search"
          className="form-input newsletter-form-input"
          placeholder="Search programs, events, library, people…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn-primary newsletter-form-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results ? (
        <div className="search-kind-row" role="tablist" aria-label="Result type">
          {SEARCH_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={kind === item.id}
              className={`search-kind-chip${kind === item.id ? ' search-kind-chip--active' : ''}`}
              onClick={() => setKind(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {status === 'error' ? (
        <p className="page-body-text text-body-md mt-note">Search is temporarily unavailable.</p>
      ) : null}

      {results ? (
        <div className="search-results mt-section">
          {results.programs.length > 0 && (kind === 'all' || kind === 'programs') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Programs</h2>
              <ul className="content-highlight-list">
                {results.programs.map((item) => (
                  <li key={item.title} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.events.length > 0 && (kind === 'all' || kind === 'events') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Events</h2>
              <ul className="content-highlight-list">
                {results.events.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.insights && results.insights.length > 0 && (kind === 'all' || kind === 'insights') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Insights</h2>
              <ul className="content-highlight-list">
                {results.insights.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    {item.path.startsWith('http') ? (
                      <a href={item.path} className="content-cta-link" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    ) : (
                      <LocalizedLink href={item.path} className="content-cta-link">
                        {item.title}
                      </LocalizedLink>
                    )}
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.library && results.library.length > 0 && (kind === 'all' || kind === 'library') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Library</h2>
              <ul className="content-highlight-list">
                {results.library.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.people && results.people.length > 0 && (kind === 'all' || kind === 'people') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">People</h2>
              <ul className="content-highlight-list">
                {results.people.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.photoAlbums && results.photoAlbums.length > 0 && (kind === 'all' || kind === 'photos') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Photo galleries</h2>
              <ul className="content-highlight-list">
                {results.photoAlbums.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {results.pages.length > 0 && (kind === 'all' || kind === 'pages') ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Pages</h2>
              <ul className="content-highlight-list">
                {results.pages.map((item) => (
                  <li key={item.path} className="content-highlight-item">
                    <LocalizedLink href={item.path} className="content-cta-link">
                      {item.title}
                    </LocalizedLink>
                    <span className="text-body-sm">{item.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {(() => {
            const counts: Record<SearchKind, number> = {
              all:
                results.programs.length +
                results.events.length +
                (results.insights?.length ?? 0) +
                (results.library?.length ?? 0) +
                (results.people?.length ?? 0) +
                (results.photoAlbums?.length ?? 0) +
                results.pages.length,
              programs: results.programs.length,
              events: results.events.length,
              insights: results.insights?.length ?? 0,
              library: results.library?.length ?? 0,
              people: results.people?.length ?? 0,
              photos: results.photoAlbums?.length ?? 0,
              pages: results.pages.length,
            }
            if (counts.all === 0) return <p className="page-body-text">No results found.</p>
            if (counts[kind] === 0) {
              return <p className="page-body-text">No results in this group. Choose All to see the rest.</p>
            }
            return null
          })()}
        </div>
      ) : null}
    </div>
  )
}
