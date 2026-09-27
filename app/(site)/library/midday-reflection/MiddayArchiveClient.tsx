'use client'

import { useMemo, useState } from 'react'
import LocalizedLink from '../../../../components/LocalizedLink'
import CardCover from '../../../../components/CardCover'

export type MiddayArchiveEpisode = {
  id: string
  slug: string
  title: string
  excerpt: string
  meta: string
  cover: string
  searchText: string
}

export default function MiddayArchiveClient({
  episodes,
  empty,
}: {
  episodes: MiddayArchiveEpisode[]
  empty: string
}) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!needle) return episodes
    return episodes.filter((episode) => episode.searchText.toLowerCase().includes(needle))
  }, [episodes, needle])
  const latest = needle ? null : episodes[0]
  const rest = needle ? filtered : episodes.slice(1)

  if (episodes.length === 0) {
    return (
      <div className="library-empty-card">
        <p className="page-body-text">{empty}</p>
        <LocalizedLink href="/programs/midday-reflection" className="btn-primary">
          Midday Reflection program
        </LocalizedLink>
      </div>
    )
  }

  return (
    <div>
      <form className="midday-archive-find" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="midday-find" className="sr-only">
          Find an episode
        </label>
        <input
          id="midday-find"
          type="search"
          className="form-input"
          placeholder="Find by title, Scripture, topic, or date"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      {latest ? (
        <article className="library-episode-card" style={{ marginBottom: '1.5rem' }}>
          <div className="library-episode-body">
            <p className="library-episode-meta">Latest episode</p>
            <h3 className="library-episode-title">{latest.title}</h3>
            <p className="library-episode-copy">{latest.excerpt}</p>
            <LocalizedLink href={`/library/${latest.slug}`} className="btn-primary">
              Open latest episode
            </LocalizedLink>
          </div>
        </article>
      ) : null}

      {rest.length === 0 ? (
        <p className="page-body-text">No episodes match that search.</p>
      ) : (
        <div className="library-episode-grid">
          {rest.map((episode) => (
            <article key={episode.id} className="library-episode-card">
              <div className="library-episode-media">
                <CardCover src={episode.cover} alt={episode.title} />
              </div>
              <div className="library-episode-body">
                {episode.meta ? <p className="library-episode-meta">{episode.meta}</p> : null}
                <h3 className="library-episode-title">{episode.title}</h3>
                <p className="library-episode-copy">{episode.excerpt}</p>
                <LocalizedLink href={`/library/${episode.slug}`} className="btn-primary library-episode-cta">
                  Open episode
                </LocalizedLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
