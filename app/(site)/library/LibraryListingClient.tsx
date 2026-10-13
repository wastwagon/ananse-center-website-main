'use client'

import { useEffect, useMemo, useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { cmsPlainExcerpt } from '../../../lib/cms/richtext'
import { LIBRARY_SHELVES } from '../../../lib/leadership/taxonomy'

export type LibraryListItem = {
  key: string
  title: string
  description: string
  shelf: string
  collection: string
  dateLabel: string
  episodeNumber: number | null
  href: string
  external?: boolean
  cover: string
  featured: boolean
  kind: 'library' | 'linked-article'
  programTitle?: string
  personName?: string
  topics?: string[]
}

type LibraryListingClientProps = {
  readMore: string
  empty: string
  items: LibraryListItem[]
  initialShelfKey?: string
}

const ALL_COLLECTIONS = 'All collections'

function resolveShelfKey(
  preferred: string | undefined,
  items: LibraryListItem[],
): (typeof LIBRARY_SHELVES)[number]['key'] {
  if (preferred && LIBRARY_SHELVES.some((option) => option.key === preferred)) {
    return preferred as (typeof LIBRARY_SHELVES)[number]['key']
  }
  const fromData = LIBRARY_SHELVES.find((option) => items.some((item) => item.shelf === option.key))
  return fromData?.key ?? 'listen'
}

export default function LibraryListingClient({
  readMore,
  empty,
  items,
  initialShelfKey,
}: LibraryListingClientProps) {
  const [shelf, setShelf] = useState<(typeof LIBRARY_SHELVES)[number]['key']>(() =>
    resolveShelfKey(initialShelfKey, items),
  )
  const [collectionFilter, setCollectionFilter] = useState<string>(ALL_COLLECTIONS)
  const [programFilter, setProgramFilter] = useState('All programs')
  const [speakerFilter, setSpeakerFilter] = useState('All speakers')
  const [topicFilter, setTopicFilter] = useState('All topics')
  const [yearFilter, setYearFilter] = useState('All dates')

  useEffect(() => {
    const next = resolveShelfKey(initialShelfKey, items)
    setShelf(next)
    setCollectionFilter(ALL_COLLECTIONS)
  }, [initialShelfKey, items])

  const shelfDef = LIBRARY_SHELVES.find((s) => s.key === shelf)
  const collectionOptions = useMemo(() => {
    const fromData = [
      ...new Set(items.filter((item) => item.shelf === shelf).map((item) => item.collection).filter(Boolean)),
    ]
    if (fromData.length > 0) return fromData
    return shelfDef?.items ?? []
  }, [items, shelf, shelfDef])

  const shelfItems = useMemo(
    () => items.filter((item) => item.shelf === shelf),
    [items, shelf],
  )

  const programOptions = useMemo(() => {
    const names = [...new Set(shelfItems.map((item) => item.programTitle).filter(Boolean))] as string[]
    return ['All programs', ...names.sort((a, b) => a.localeCompare(b))]
  }, [shelfItems])

  const speakerOptions = useMemo(() => {
    const names = [...new Set(shelfItems.map((item) => item.personName).filter(Boolean))] as string[]
    return ['All speakers', ...names.sort((a, b) => a.localeCompare(b))]
  }, [shelfItems])

  const topicOptions = useMemo(() => {
    const names = [...new Set(shelfItems.flatMap((item) => item.topics ?? []))]
    return ['All topics', ...names.sort((a, b) => a.localeCompare(b))]
  }, [shelfItems])

  const filtered = useMemo(() => {
    return shelfItems.filter((item) => {
      if (collectionFilter !== ALL_COLLECTIONS && item.collection !== collectionFilter) return false
      if (programFilter !== 'All programs' && item.programTitle !== programFilter) return false
      if (speakerFilter !== 'All speakers' && item.personName !== speakerFilter) return false
      if (topicFilter !== 'All topics' && !(item.topics ?? []).includes(topicFilter)) return false
      if (yearFilter !== 'All dates') {
        const year = item.dateLabel.match(/\b(?:19|20)\d{2}\b/)?.[0]
        if (year !== yearFilter) return false
      }
      return true
    })
  }, [collectionFilter, programFilter, shelfItems, speakerFilter, topicFilter, yearFilter])

  const shelfCta =
    shelf === 'listen' ? 'Listen' : shelf === 'watch' ? 'Watch' : shelf === 'read' ? 'Read' : readMore

  if (items.length === 0) {
    return (
      <div className="empty-room">
        <p className="page-body-text">{empty}</p>
        <div className="page-cta-buttons library-listing-empty-actions">
          <LocalizedLink href="/programs" className="btn-primary">
            Explore programs
          </LocalizedLink>
          <LocalizedLink href="/library/photo-gallery" className="btn-outline">
            Photo galleries
          </LocalizedLink>
        </div>
      </div>
    )
  }

  return (
    <>
      <PremiumFilterBar
        groups={[
          {
            label: 'Shelf',
            ariaLabel: 'Library shelf',
            value: shelf,
            onChange: (value) => {
              setShelf(value as (typeof LIBRARY_SHELVES)[number]['key'])
              setCollectionFilter(ALL_COLLECTIONS)
              setProgramFilter('All programs')
              setSpeakerFilter('All speakers')
              setTopicFilter('All topics')
            },
            options: [
              ...LIBRARY_SHELVES.map((option) => ({
                value: option.key,
                label: option.title,
              })),
              { value: 'photos', label: 'Photo Gallery', href: '/library/photo-gallery' },
            ],
          },
          ...(collectionOptions.length > 0
            ? [
                {
                  label: 'Collection',
                  ariaLabel: 'Library collection',
                  value: collectionFilter,
                  variant: 'tabs' as const,
                  onChange: setCollectionFilter,
                  options: [ALL_COLLECTIONS, ...collectionOptions].map((option) => ({
                    value: option,
                    label: option,
                  })),
                },
              ]
            : []),
          ...(programOptions.length > 1
            ? [
                {
                  label: 'Program',
                  ariaLabel: 'Library program',
                  value: programOptions.includes(programFilter) ? programFilter : 'All programs',
                  onChange: setProgramFilter,
                  options: programOptions.map((option) => ({ value: option, label: option })),
                },
              ]
            : []),
          ...(speakerOptions.length > 1
            ? [
                {
                  label: 'Speaker',
                  ariaLabel: 'Library speaker',
                  value: speakerOptions.includes(speakerFilter) ? speakerFilter : 'All speakers',
                  onChange: setSpeakerFilter,
                  options: speakerOptions.map((option) => ({ value: option, label: option })),
                },
              ]
            : []),
          ...(topicOptions.length > 1
            ? [
                {
                  label: 'Topic',
                  ariaLabel: 'Library topic',
                  value: topicOptions.includes(topicFilter) ? topicFilter : 'All topics',
                  onChange: setTopicFilter,
                  options: topicOptions.map((option) => ({ value: option, label: option })),
                },
              ]
            : []),
          ...((() => {
            const years = [
              ...new Set(
                shelfItems
                  .map((item) => item.dateLabel.match(/\b(?:19|20)\d{2}\b/)?.[0])
                  .filter(Boolean),
              ),
            ] as string[]
            if (years.length === 0) return []
            const options = ['All dates', ...years.sort((a, b) => b.localeCompare(a))]
            return [
              {
                label: 'Date',
                ariaLabel: 'Library year',
                value: options.includes(yearFilter) ? yearFilter : 'All dates',
                onChange: setYearFilter,
                options: options.map((option) => ({ value: option, label: option })),
              },
            ]
          })()),
        ]}
      />

      {filtered.length === 0 ? (
        <p className="page-body-text">{empty}</p>
      ) : (
        <div className="grid-cards grid-cards--stack-narrow">
          {filtered.map((item) => (
            <article
              key={item.key}
              className={`premium-card library-listing-card${item.featured ? ' premium-card--featured' : ''}`}
            >
              <div className="premium-card-image-wrapper">
                <CardCover src={item.cover} alt={item.title} />
              </div>
              <div className="premium-card-header">
                <span className="premium-card-featured-label">{item.collection}</span>
                {item.episodeNumber != null ? (
                  <span className="insight-card-tag">Episode {item.episodeNumber}</span>
                ) : null}
              </div>
              {item.dateLabel ? <p className="premium-card-date">{item.dateLabel}</p> : null}
              <h3 className="premium-card-title">{item.title}</h3>
              <p className="premium-card-description">{cmsPlainExcerpt(item.description)}</p>
              {item.external && item.href ? (
                <a href={item.href} className="btn-primary premium-card-cta" rel="noopener noreferrer">
                  {shelfCta}
                </a>
              ) : (
                <LocalizedLink href={item.href} className="btn-primary premium-card-cta">
                  {shelfCta}
                </LocalizedLink>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
