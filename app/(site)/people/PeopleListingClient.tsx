'use client'

import { useEffect, useMemo, useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { PEOPLE_GROUPS } from '../../../lib/leadership/taxonomy'

export type PeopleListItem = {
  key: string
  name: string
  roleTitle: string
  bio: string
  groups: string[]
  href: string
  websiteUrl: string | null
  image: string | null
  isOrganization: boolean
  featured: boolean
}

type PeopleListingClientProps = {
  viewProfile: string
  empty: string
  items: PeopleListItem[]
  initialGroup?: string
}

const ALL_GROUPS = 'All People'

const GROUP_SECTION_LEAD: Record<string, string> = {
  Leadership: 'People who help guide ANANSE’s direction, programs, and public voice.',
  Mentors: 'Experienced guides who walk with emerging leaders — interest is not a guaranteed match.',
  'Speakers & Faculty': 'Voices who teach, facilitate, and open conversations across ANANSE gatherings.',
  'Fellows and Participants': 'People formed through ANANSE programs, published only with permission.',
  Partners: 'Organisations that walk with ANANSE — logos and websites, not personal directories.',
}

const GROUP_EMPTY_COPY: Record<string, string> = {
  Leadership: 'No leadership profiles are listed yet.',
  Mentors: 'No mentor profiles are listed yet.',
  'Speakers & Faculty': 'No speakers or faculty are listed yet.',
  'Fellows and Participants': 'No fellows or participants are listed yet.',
  Partners: 'No partner organisations are listed yet.',
}

const GROUP_HREFS: Record<string, string> = {
  [ALL_GROUPS]: '/people',
  Leadership: '/people?group=Leadership',
  Mentors: '/people?group=Mentors',
  'Speakers & Faculty': '/people?group=Speakers%20%26%20Faculty',
  'Fellows and Participants': '/people?group=Fellows%20and%20Participants',
  Partners: '/people?group=Partners',
}

function PortraitCard({
  item,
  viewProfile,
}: {
  item: PeopleListItem
  viewProfile: string
}) {
  const cta = item.isOrganization ? 'View partner' : viewProfile
  return (
    <article className={`portrait-card${item.featured ? ' portrait-card--featured' : ''}`}>
      <div className={`portrait-card-media${item.isOrganization ? ' portrait-card-media--org' : ''}`}>
        {item.image ? (
          <CardCover
            src={item.image}
            alt={item.name}
            sizes="(max-width: 640px) 50vw, 220px"
            fit={item.isOrganization ? 'contain' : 'cover'}
            className={item.isOrganization ? 'portrait-card-logo-wrap' : undefined}
          />
        ) : (
          <span className="portrait-card-initials" aria-hidden>
            {item.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? '')
              .join('')}
          </span>
        )}
      </div>
      <div className="portrait-card-body">
        {item.groups[0] ? <p className="portrait-card-group">{item.groups[0]}</p> : null}
        <h3 className="portrait-card-name">
          <LocalizedLink href={item.href}>{item.name}</LocalizedLink>
        </h3>
        {item.roleTitle ? <p className="portrait-card-role">{item.roleTitle}</p> : null}
        <LocalizedLink href={item.href} className="content-cta-link">
          {cta}
        </LocalizedLink>
      </div>
    </article>
  )
}

export default function PeopleListingClient({
  viewProfile,
  empty,
  items,
  initialGroup,
}: PeopleListingClientProps) {
  const [groupFilter, setGroupFilter] = useState<string>(() => {
    const preferred = initialGroup?.trim()
    if (preferred && PEOPLE_GROUPS.includes(preferred as (typeof PEOPLE_GROUPS)[number])) {
      return preferred
    }
    return ALL_GROUPS
  })

  useEffect(() => {
    const preferred = initialGroup?.trim()
    if (preferred && PEOPLE_GROUPS.includes(preferred as (typeof PEOPLE_GROUPS)[number])) {
      setGroupFilter(preferred)
      return
    }
    setGroupFilter(ALL_GROUPS)
  }, [initialGroup])

  const availableGroups = useMemo(() => {
    const present = new Set(items.flatMap((item) => item.groups))
    return PEOPLE_GROUPS.filter((group) => present.has(group))
  }, [items])

  const featuredItems = useMemo(() => {
    if (groupFilter !== ALL_GROUPS) return []
    const marked = items.filter((item) => item.featured)
    if (marked.length > 0) return marked.slice(0, 4)
    return items.slice(0, 3)
  }, [items, groupFilter])

  const showFeatured = featuredItems.length > 0 && groupFilter === ALL_GROUPS

  const filtered = useMemo(() => {
    if (groupFilter === ALL_GROUPS) return items
    return items.filter((item) => item.groups.includes(groupFilter))
  }, [groupFilter, items])

  const catalogItems = useMemo(() => {
    if (!showFeatured) return filtered
    const featuredKeys = new Set(featuredItems.map((item) => item.key))
    return filtered.filter((item) => !featuredKeys.has(item.key))
  }, [filtered, featuredItems, showFeatured])

  if (items.length === 0) {
    return (
      <div className="empty-room">
        <p className="page-body-text">{empty}</p>
        <div className="page-cta-buttons people-listing-empty-actions">
          <LocalizedLink href="/get-involved" className="btn-primary">
            Get involved
          </LocalizedLink>
          <LocalizedLink href="/about" className="btn-outline">
            About ANANSE
          </LocalizedLink>
        </div>
      </div>
    )
  }

  const emptyCopy =
    groupFilter !== ALL_GROUPS
      ? GROUP_EMPTY_COPY[groupFilter] || `No profiles in ${groupFilter} yet.`
      : empty

  return (
    <>
      {showFeatured ? (
        <div className="people-featured-block">
          <div className="people-section-intro people-section-intro--center">
            <span className="section-badge">Featured</span>
            <h2 className="page-section-heading">People to meet first</h2>
            <p className="page-body-text people-section-lead">
              A small set of sample profiles so the layout is visible before real names are published.
            </p>
          </div>
          <div className="portrait-grid portrait-grid--featured">
            {featuredItems.map((item) => (
              <PortraitCard key={item.key} item={item} viewProfile={viewProfile} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="people-section-intro people-section-intro--split">
        <div>
          <span className="section-badge">Browse</span>
          <h2 className="page-section-heading">
            {groupFilter === ALL_GROUPS ? 'All People' : groupFilter}
          </h2>
          {groupFilter !== ALL_GROUPS && GROUP_SECTION_LEAD[groupFilter] ? (
            <p className="page-body-text people-section-lead">{GROUP_SECTION_LEAD[groupFilter]}</p>
          ) : null}
        </div>
        <LocalizedLink href="/get-involved" className="btn-outline page-section-cta-link">
          Get involved
        </LocalizedLink>
      </div>

      {availableGroups.length > 0 ? (
        <PremiumFilterBar
          groups={[
            {
              label: 'Group',
              ariaLabel: 'People group',
              value: groupFilter,
              variant: 'tabs',
              options: [ALL_GROUPS, ...availableGroups].map((option) => ({
                value: option,
                label: option,
                href: GROUP_HREFS[option] ?? `/people?group=${encodeURIComponent(option)}`,
              })),
            },
          ]}
        />
      ) : null}

      {catalogItems.length === 0 ? (
        <div className="empty-room people-group-empty">
          <p className="page-body-text">{emptyCopy}</p>
          <div className="page-cta-buttons">
            <LocalizedLink href="/people" className="btn-outline">
              View all people
            </LocalizedLink>
          </div>
        </div>
      ) : (
        <div className="portrait-grid">
          {catalogItems.map((item) => (
            <PortraitCard key={item.key} item={item} viewProfile={viewProfile} />
          ))}
        </div>
      )}
    </>
  )
}
