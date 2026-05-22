'use client'

import { useState } from 'react'
import { searchSite, type SearchResults } from '../lib/api'
import LocalizedLink from './LocalizedLink'

export default function SiteSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function runSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    setStatus('loading')
    try {
      const data = await searchSite(q)
      setResults(data)
      setStatus('idle')
    } catch {
      setStatus('error')
      setResults(null)
    }
  }

  return (
    <div>
      <form onSubmit={runSearch} className="newsletter-inline-form" role="search">
        <label htmlFor="site-search" className="sr-only">
          Search
        </label>
        <input
          id="site-search"
          type="search"
          className="form-input newsletter-form-input"
          placeholder="Search programs, events, pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn-primary newsletter-form-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'error' ? (
        <p className="page-body-text text-body-md mt-note">Search is temporarily unavailable.</p>
      ) : null}

      {results ? (
        <div className="search-results mt-section">
          {results.programs.length > 0 ? (
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
          {results.events.length > 0 ? (
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
          {results.archives?.length > 0 ? (
            <section>
              <h2 className="content-block-title content-block-title--plain">Archives</h2>
              <ul className="content-highlight-list">
                {results.archives.map((item) => (
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
          {results.pages.length > 0 ? (
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
          {results.programs.length === 0 &&
          results.events.length === 0 &&
          (results.archives?.length ?? 0) === 0 &&
          results.pages.length === 0 ? (
            <p className="page-body-text">No results found.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
