'use client'

import { useEffect, useMemo, useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
import PageCtaBand from '../../../components/PageCtaBand'
import NewsletterSignup from '../../../components/NewsletterSignup'
import { fetchEvents, type ApiEvent } from '../../../lib/api'
import { EVENTS_EMPTY, EVENTS_HERO } from '../../../lib/leadership/copy'
import { withoutLegacyArtsEvents } from '../../../lib/leadership/legacy-events'
import { deliveryModeLabel, eventStatusLabel } from '../../../lib/leadership/taxonomy'
import { cmsPlainExcerpt } from '../../../lib/cms/richtext'
import HeroSplit from '../../../components/HeroSplit'
import { useCmsTexts } from '../../../lib/cms/client'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import { parseCmsJson } from '../../../lib/cms/parse'
import {
  DEFAULT_EVENTS_FILTER_CATEGORIES,
  DEFAULT_PROGRAMS_HERO_CTA_PRIMARY,
  type CmsHeroCta,
} from '../../../lib/cms/registry'
import EventTypeIcon from '../../../components/EventTypeIcon'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { Calendar, MapPin } from 'lucide-react'
import { images, resolveCmsImage, resolveEventCoverImage } from '../../../lib/images'
import { formatEventDateDisplay, resolveEventRegistrationStatus } from '../../../lib/format'
import { DEFAULT_EVENTS_SECTIONS, isSectionVisible, parseSectionVisibility } from '../../../lib/cms/sections'

const EVENTS_CMS_KEYS = [
  'events.hero.image',
  'events.featured.badge',
  'events.featured.heading',
  'events.catalog.heading',
  'events.past.heading',
  'events.card.register',
  'events.filter.categories',
  'events.status.openLabel',
  'events.status.completedLabel',
  'events.status.closedLabel',
  'events.status.waitlistLabel',
  'events.cta.heading',
  'events.cta.body',
  'events.cta.primary',
  'events.newsletter.heading',
  'events.newsletter.lead',
  'events.newsletter.subscribeLabel',
  'events.newsletter.placeholder',
  'events.sections.visible',
  'home.events.cardCta',
] as const

const EVENT_GATEWAYS = [
  {
    title: 'All Events',
    type: 'All Events',
    href: '/events',
    body: 'Every gathering in one place — upcoming and past.',
  },
  {
    title: 'Lectures',
    type: 'Lecture',
    href: '/events?type=Lecture',
    body: 'Ideas, excellence, and public addresses.',
  },
  {
    title: 'Seminars',
    type: 'Seminar',
    href: '/events?type=Seminar',
    body: 'Focused learning and guided discussion.',
  },
  {
    title: 'Workshops',
    type: 'Workshop',
    href: '/events?type=Workshop',
    body: 'Hands-on practice and skill development.',
  },
  {
    title: 'Conferences',
    type: 'Conference',
    href: '/events?type=Conference',
    body: 'Larger gatherings and multi-session programs.',
  },
  {
    title: 'Conversations',
    type: 'Conversation',
    href: '/events?type=Conversation',
    body: 'Dialogue, panels, and thoughtful exchange.',
  },
  {
    title: 'Mentorship',
    type: 'Mentorship',
    href: '/events?type=Mentorship',
    body: 'Orientations and mentoring gatherings.',
  },
  {
    title: 'Special Programs',
    type: 'Special Program',
    href: '/events?type=Special%20Program',
    body: 'Distinctive initiatives and one-off gatherings.',
  },
] as const

type TimingFilter = 'Upcoming' | 'Past' | 'All'
type StatusKey = 'open' | 'closed' | 'waitlist' | 'completed'

function formatMonthHeading(key: string) {
  if (/^\d{4}-\d{2}$/.test(key)) {
    const [year, month] = key.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  return key
}

function EventActions({
  event,
  detailsLabel,
  registerLabel,
  upcoming,
}: {
  event: ApiEvent
  detailsLabel: string
  registerLabel: string
  upcoming: boolean
}) {
  return (
    <div className="event-card-actions">
      <LocalizedLink href={`/events/${event.slug}`} className="btn-outline-dark">
        {detailsLabel}
      </LocalizedLink>
      {upcoming ? (
        <LocalizedLink href={`/events/${event.slug}#register`} className="btn-primary">
          {registerLabel}
        </LocalizedLink>
      ) : null}
    </div>
  )
}

function EventCard({
  event,
  detailsLabel,
  registerLabel,
  statusLabels,
  featured = false,
  getEventStatus,
  isEventOpen,
}: {
  event: ApiEvent
  detailsLabel: string
  registerLabel: string
  statusLabels: Record<StatusKey, string>
  featured?: boolean
  getEventStatus: (event: ApiEvent) => StatusKey
  isEventOpen: (event: ApiEvent) => boolean
}) {
  const open = isEventOpen(event) && event.eventStatus !== 'cancelled'
  const status = getEventStatus(event)
  const statusText =
    event.eventStatus && event.eventStatus !== 'scheduled'
      ? eventStatusLabel(event.eventStatus)
      : statusLabels[status]

  return (
    <article
      className={`events-card${featured ? ' events-card--featured' : ''}`}
      aria-label={event.title}
    >
      <div className="events-card-media">
        <CardCover src={resolveEventCoverImage(event)} alt={event.title} />
      </div>
      <div className="events-card-body">
        <div className="events-card-topline">
          <div className="events-card-type">
            <EventTypeIcon type={event.type} className="events-card-type-icon" size={16} />
            <span>{event.type}</span>
          </div>
          <span
            className={`event-status-badge ${
              status === 'open' || status === 'waitlist'
                ? 'event-status-badge--open'
                : 'event-status-badge--past'
            }`}
          >
            {statusText}
          </span>
        </div>
        <h3 className="events-card-title">{event.title}</h3>
        {event.program ? (
          <p className="events-card-program">
            <LocalizedLink href={`/programs/${event.program.slug}`}>{event.program.title}</LocalizedLink>
          </p>
        ) : null}
        <div className="events-card-meta">
          <span>
            <Calendar size={14} className="text-accent shrink-0" aria-hidden />
            {formatEventDateDisplay(event.date)}
            {event.timeLabel ? ` · ${event.timeLabel}` : ''}
          </span>
          <span>
            <MapPin size={14} className="shrink-0" aria-hidden />
            {deliveryModeLabel(event.deliveryMode || 'in_person')}
            {event.deliveryMode !== 'online' && event.location ? ` · ${event.location}` : ''}
            {event.capacity ? ` · ${event.capacity} seats` : ''}
          </span>
        </div>
        <p className="events-card-copy">{cmsPlainExcerpt(event.description)}</p>
        <EventActions
          event={event}
          detailsLabel={detailsLabel}
          registerLabel={registerLabel}
          upcoming={open}
        />
      </div>
    </article>
  )
}

export default function EventsPageClient({
  initialEvents = [],
  initialType,
}: {
  initialEvents?: ApiEvent[]
  initialType?: string
}) {
  const cms = useCmsTexts(EVENTS_CMS_KEYS)
  const categories = useMemo(() => {
    const parsed = parseCmsJson<string[]>(cms['events.filter.categories'], DEFAULT_EVENTS_FILTER_CATEGORIES)
    const looksLikeArts = parsed.some((category) => /festival|exhibition|retreat|symposium/i.test(category))
    return looksLikeArts ? DEFAULT_EVENTS_FILTER_CATEGORIES : parsed
  }, [cms['events.filter.categories']])
  const [activeTab, setActiveTab] = useState(() => initialType?.trim() || 'All Events')
  const [timingFilter, setTimingFilter] = useState<TimingFilter>('Upcoming')
  const [deliveryFilter, setDeliveryFilter] = useState<'All' | 'in_person' | 'online' | 'hybrid'>('All')
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list')
  const [programFilter, setProgramFilter] = useState('All')
  const [events, setEvents] = useState<ApiEvent[]>(() => withoutLegacyArtsEvents(initialEvents))

  const detailsLabel = cms['home.events.cardCta'] ?? 'Event Details'
  const registerLabel = cms['events.card.register'] || 'Register Now'
  const bottomCtaPrimary = useMemo(
    () => parseCmsJson<CmsHeroCta>(cms['events.cta.primary'], DEFAULT_PROGRAMS_HERO_CTA_PRIMARY),
    [cms['events.cta.primary']],
  )
  const statusLabels: Record<StatusKey, string> = {
    open: cms['events.status.openLabel'] || 'Registration Open',
    closed: cms['events.status.closedLabel'] || 'Registration Closed',
    waitlist: cms['events.status.waitlistLabel'] || 'Waitlist',
    completed: cms['events.status.completedLabel'] || 'Completed',
  }

  const sectionVisibility = useMemo(
    () => parseSectionVisibility(cms['events.sections.visible'], DEFAULT_EVENTS_SECTIONS),
    [cms['events.sections.visible']],
  )
  const showSection = (key: string) => isSectionVisible(sectionVisibility, key)

  const getEventStatus = (event: ApiEvent): StatusKey => {
    const status = resolveEventRegistrationStatus({
      registrationStatus: event.registrationStatus,
      dateLabel: event.date,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
    })
    return status === 'auto' ? 'open' : status
  }
  const isEventOpen = (event: ApiEvent) => {
    const status = getEventStatus(event)
    return status === 'open' || status === 'waitlist'
  }

  useEffect(() => {
    setActiveTab(initialType?.trim() || 'All Events')
  }, [initialType])

  useEffect(() => {
    const gatewayMatch = EVENT_GATEWAYS.some((gateway) => gateway.type === activeTab)
    if (categories.length > 0 && !categories.includes(activeTab) && !gatewayMatch) {
      setActiveTab(categories[0])
    }
  }, [categories, activeTab])

  useEffect(() => {
    let cancelled = false

    fetchEvents()
      .then((data) => {
        if (!cancelled) setEvents(withoutLegacyArtsEvents(data))
      })
      .catch(() => {
        if (!cancelled && initialEvents.length === 0) setEvents([])
      })

    return () => {
      cancelled = true
    }
  }, [initialEvents.length])

  const featuredEvents = useMemo(() => {
    if (activeTab !== 'All Events' || programFilter !== 'All') return []
    return events.filter((event) => event.featured)
  }, [events, activeTab, programFilter])

  const showFeatured = showSection('featured') && featuredEvents.length > 0

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.eventStatus === 'cancelled' && timingFilter === 'Upcoming') return false
      const matchesType = activeTab === 'All Events' || event.type === activeTab
      if (!matchesType) return false
      if (programFilter !== 'All' && event.program?.title !== programFilter) return false
      const mode = event.deliveryMode || 'in_person'
      if (deliveryFilter !== 'All' && mode !== deliveryFilter) return false
      if (timingFilter === 'All') return true
      const upcoming = isEventOpen(event) && event.eventStatus !== 'cancelled'
      return timingFilter === 'Upcoming' ? upcoming : !upcoming
    })
  }, [events, activeTab, timingFilter, deliveryFilter, programFilter])

  const catalogEvents = useMemo(() => {
    if (!showFeatured || timingFilter !== 'Upcoming') return filteredEvents
    const featuredIds = new Set(featuredEvents.map((event) => event.id))
    return filteredEvents.filter((event) => !featuredIds.has(event.id))
  }, [filteredEvents, featuredEvents, showFeatured, timingFilter])

  const eventsByMonth = useMemo(() => {
    const groups = new Map<string, ApiEvent[]>()
    for (const event of catalogEvents) {
      const key = event.startsAt ? event.startsAt.slice(0, 7) : event.date || 'Undated'
      const list = groups.get(key) ?? []
      list.push(event)
      groups.set(key, list)
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [catalogEvents])

  const programOptions = useMemo(() => {
    const titles = [
      ...new Set(events.map((event) => event.program?.title).filter((title): title is string => Boolean(title))),
    ]
    return ['All', ...titles.sort((a, b) => a.localeCompare(b))]
  }, [events])

  const cardProps = {
    detailsLabel,
    registerLabel,
    statusLabels,
    getEventStatus,
    isEventOpen,
  }

  return (
    <div className="events-page">
      <HeroSplit
        compact
        imageSrc={resolveCmsImage(cms['events.hero.image'], images.hero.events)}
        imageAlt="Gatherings at ANANSE Center for Leadership Development"
        title={renderSplitHeroTitle(EVENTS_HERO.title)}
        description={EVENTS_HERO.lead}
        primaryCta={EVENTS_HERO.primary}
        secondaryCta={EVENTS_HERO.secondary}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="events-intro">
            <article className="events-intro-card">
              <span className="section-badge">Gatherings</span>
              <h2 className="page-section-heading">A calendar of learning and fellowship</h2>
              <p className="events-intro-tagline">Come. Listen. Grow. Serve.</p>
              <p className="page-body-text">
                Open gatherings across ANANSE programs — lectures, seminars, workshops, mentoring,
                and special programs. Choose a type below, or browse the full calendar.
              </p>
              <p className="page-body-text events-intro-note">
                Each gathering keeps its page after the date. Registration stays open on the event
                page while it is available.
              </p>
            </article>
            <div className="events-gateway-grid">
              {EVENT_GATEWAYS.map((gateway) => (
                <LocalizedLink
                  key={gateway.type}
                  href={gateway.href}
                  className={`events-gateway-card${activeTab === gateway.type ? ' events-gateway-card--active' : ''}`}
                >
                  <span className="events-gateway-kicker">Explore</span>
                  <span className="events-gateway-title">{gateway.title}</span>
                  <span className="events-gateway-body">{gateway.body}</span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showFeatured ? (
        <section id="calendar" className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="events-section-intro events-section-intro--center">
              <span className="section-badge">{cms['events.featured.badge']}</span>
              <h2 className="page-section-heading">{cms['events.featured.heading']}</h2>
            </div>
            <div className="events-card-grid">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured {...cardProps} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('calendar') ? (
        <section
          id={showFeatured ? undefined : 'calendar'}
          className={`page-section section-reveal ${showFeatured ? 'bg-white' : 'bg-slate-50'}`}
        >
          <div className="page-section-container">
            <div className="events-section-intro events-section-intro--split">
              <div>
                <span className="section-badge">Calendar</span>
                <h2 className="page-section-heading">
                  {events.length === 0
                    ? 'Gatherings'
                    : timingFilter === 'Past'
                      ? cms['events.past.heading'] || 'Past Events'
                      : activeTab === 'All Events'
                        ? cms['events.catalog.heading']
                        : activeTab}
                </h2>
              </div>
              {events.length > 0 ? (
                <LocalizedLink href="/programs" className="btn-outline page-section-cta-link">
                  Browse programs
                </LocalizedLink>
              ) : null}
            </div>

            {events.length === 0 ? (
              <div className="empty-room">
                <p className="page-body-text">{EVENTS_EMPTY}</p>
                <div className="page-cta-buttons events-listing-empty-actions">
                  <LocalizedLink href="/programs" className="btn-primary">
                    Browse programs
                  </LocalizedLink>
                  <LocalizedLink href="/get-involved" className="btn-outline">
                    Get involved
                  </LocalizedLink>
                </div>
              </div>
            ) : (
              <>
                <PremiumFilterBar
                  groups={[
                    {
                      label: 'When',
                      ariaLabel: 'Event timing',
                      value: timingFilter,
                      onChange: (value) => setTimingFilter(value as TimingFilter),
                      options: [
                        { value: 'Upcoming', label: 'Upcoming' },
                        { value: 'Past', label: 'Past' },
                        { value: 'All', label: 'All' },
                      ],
                    },
                    {
                      label: 'Format',
                      ariaLabel: 'Delivery format',
                      value: deliveryFilter,
                      onChange: (value) =>
                        setDeliveryFilter(value as 'All' | 'in_person' | 'online' | 'hybrid'),
                      options: [
                        { value: 'All', label: 'Any' },
                        { value: 'in_person', label: 'In person' },
                        { value: 'online', label: 'Online' },
                        { value: 'hybrid', label: 'Hybrid' },
                      ],
                    },
                    {
                      label: 'View',
                      ariaLabel: 'Events view',
                      value: viewMode,
                      onChange: (value) => setViewMode(value as 'list' | 'month'),
                      options: [
                        { value: 'list', label: 'List' },
                        { value: 'month', label: 'Month' },
                      ],
                    },
                    {
                      label: 'Program',
                      ariaLabel: 'Event program',
                      value: programOptions.includes(programFilter) ? programFilter : 'All',
                      onChange: setProgramFilter,
                      options: programOptions.map((title) => ({ value: title, label: title })),
                    },
                    {
                      label: 'Type',
                      ariaLabel: 'Event category',
                      value: activeTab,
                      variant: 'tabs',
                      options: categories.map((cat) => {
                        const gateway = EVENT_GATEWAYS.find((item) => item.type === cat)
                        return {
                          value: cat,
                          label: cat,
                          href:
                            gateway?.href ??
                            (cat === 'All Events' ? '/events' : `/events?type=${encodeURIComponent(cat)}`),
                        }
                      }),
                    },
                  ]}
                />

                {catalogEvents.length === 0 ? (
                  <p className="page-body-text">
                    {showFeatured && timingFilter === 'Upcoming'
                      ? 'Featured gatherings are above. Adjust timing or type to see more of the calendar.'
                      : 'No gatherings match these filters. Try All, or browse programs while the calendar fills.'}
                  </p>
                ) : viewMode === 'month' ? (
                  <div className="events-month-groups">
                    {eventsByMonth.map(([month, monthEvents]) => (
                      <div key={month} className="events-month-group">
                        <h3 className="events-month-heading">{formatMonthHeading(month)}</h3>
                        <div className="events-card-grid">
                          {monthEvents.map((event) => (
                            <EventCard key={event.id} event={event} {...cardProps} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="events-card-grid">
                    {catalogEvents.map((event) => (
                      <EventCard key={event.id} event={event} {...cardProps} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      ) : null}

      {showSection('newsletter') ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container page-section-center-header">
            <NewsletterSignup
              heading={cms['events.newsletter.heading'] || 'Stay in the loop'}
              lead={cmsPlainExcerpt(cms['events.newsletter.lead'] || '', 280)}
              placeholder={cms['events.newsletter.placeholder'] || 'Email address'}
              buttonLabel={cms['events.newsletter.subscribeLabel'] || 'Subscribe'}
            />
          </div>
        </section>
      ) : null}

      {showSection('cta') ? (
        <PageCtaBand
          heading={cms['events.cta.heading']}
          body={cms['events.cta.body']}
          primary={{
            label: bottomCtaPrimary.label,
            href: bottomCtaPrimary.href,
          }}
          secondary={{
            label: 'Get involved',
            href: '/get-involved',
            variant: 'outline-white',
          }}
        />
      ) : null}
    </div>
  )
}
