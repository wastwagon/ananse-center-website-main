'use client'

import { useEffect, useState } from 'react'
import {
  fetchAdminEvents,
  fetchAdminLibrary,
  fetchAdminNews,
  fetchAdminPeople,
  fetchAdminPhotoAlbums,
} from '../../lib/admin-api'
import type { RelatedOverrides } from '../../lib/related-overrides'

type CatalogItem = { slug: string; label: string }

const LABELS: Record<keyof RelatedOverrides, string> = {
  insights: 'Insights',
  library: 'Library resources',
  events: 'Events',
  albums: 'Photo albums',
  people: 'People',
}

function toggle(list: string[] | undefined, slug: string) {
  const current = list ?? []
  return current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
}

export default function RelatedOverridesFields({
  pinned,
  hidden,
  onPinnedChange,
  onHiddenChange,
  keys = ['insights', 'library', 'events', 'albums', 'people'],
}: {
  pinned: RelatedOverrides
  hidden: RelatedOverrides
  onPinnedChange: (next: RelatedOverrides) => void
  onHiddenChange: (next: RelatedOverrides) => void
  keys?: (keyof RelatedOverrides)[]
}) {
  const [catalogs, setCatalogs] = useState<Partial<Record<keyof RelatedOverrides, CatalogItem[]>>>({})

  const keyList = keys.join(',')

  useEffect(() => {
    let active = true
    const wanted = new Set(keyList.split(','))
    Promise.all([
      wanted.has('events') ? fetchAdminEvents() : Promise.resolve(null),
      wanted.has('insights') ? fetchAdminNews() : Promise.resolve(null),
      wanted.has('library') ? fetchAdminLibrary() : Promise.resolve(null),
      wanted.has('albums') ? fetchAdminPhotoAlbums() : Promise.resolve(null),
      wanted.has('people') ? fetchAdminPeople() : Promise.resolve(null),
    ])
      .then(([events, insights, library, albums, people]) => {
        if (!active) return
        const next: Partial<Record<keyof RelatedOverrides, CatalogItem[]>> = {}
        if (events) next.events = events.data.map((row) => ({ slug: row.slug, label: row.title }))
        if (insights) next.insights = insights.data.map((row) => ({ slug: row.slug, label: row.title }))
        if (library) next.library = library.data.map((row) => ({ slug: row.slug, label: row.title }))
        if (albums) next.albums = albums.data.map((row) => ({ slug: row.slug, label: row.title }))
        if (people) next.people = people.data.map((row) => ({ slug: row.slug, label: row.name }))
        setCatalogs(next)
      })
      .catch(() => {
        if (active) setCatalogs({})
      })
    return () => {
      active = false
    }
  }, [keyList])

  return (
    <div className="admin-field-row admin-field-row--stack">
      {keys.map((key) => {
        const options = catalogs[key] ?? []
        const pinnedSlugs = pinned[key] ?? []
        const hiddenSlugs = hidden[key] ?? []
        return (
          <fieldset key={key} className="admin-field">
            <legend>{LABELS[key]}</legend>
            {options.length === 0 ? (
              <p className="admin-help">No published records to choose yet. Automatic matches still apply.</p>
            ) : (
              <div className="admin-choice-stack">
                {options.map((option) => (
                  <div key={option.slug} className="admin-field-row">
                    <label className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={pinnedSlugs.includes(option.slug)}
                        onChange={() =>
                          onPinnedChange({ ...pinned, [key]: toggle(pinnedSlugs, option.slug) })
                        }
                      />
                      <span>Pin {option.label}</span>
                    </label>
                    <label className="admin-toggle-row">
                      <input
                        type="checkbox"
                        checked={hiddenSlugs.includes(option.slug)}
                        onChange={() =>
                          onHiddenChange({ ...hidden, [key]: toggle(hiddenSlugs, option.slug) })
                        }
                      />
                      <span>Hide</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        )
      })}
      <p className="admin-help">
        Automatic related content stays in place. Pin a record to keep it first. Hide a record to
        leave it off the page.
      </p>
    </div>
  )
}
