import type { Metadata } from 'next'
import LocalizedLink from '../../../../components/LocalizedLink'
import EventRegistrationForm from '../../../../components/EventRegistrationForm'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, MapPin } from 'lucide-react'
import JsonLd from '../../../../components/JsonLd'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchEventBySlug } from '../../../../lib/api'
import { formatEventDateDisplay } from '../../../../lib/format'
import { resolveEventCoverImage } from '../../../../lib/images'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { eventJsonLd } from '../../../../lib/structured-data'
import {
  DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
} from '../../../../lib/cms/content'
import { LEGACY_ARTS_EVENT_SLUGS } from '../../../../lib/leadership/legacy-events'
import { deliveryModeLabel, eventStatusLabel } from '../../../../lib/leadership/taxonomy'
import { resolveEventRegistrationStatus } from '../../../../lib/format'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (LEGACY_ARTS_EVENT_SLUGS.has(slug)) {
    return buildPageMetadata({ title: 'Event', path: `/events/${slug}` })
  }
  const event = await fetchEventBySlug(slug)
  if (!event) {
    return buildPageMetadata({ title: 'Event', path: `/events/${slug}` })
  }
  return buildPageMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${slug}`,
    ogImage: resolveEventCoverImage(event),
  })
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (LEGACY_ARTS_EVENT_SLUGS.has(slug)) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const [event, cms] = await Promise.all([
    fetchEventBySlug(slug),
    getCmsTexts([
      'events.detail.storyTitleDefault',
      'events.detail.highlightsHeading',
      'events.detail.highlightsFallback',
      'events.detail.whenLabel',
      'events.detail.whereLabel',
      'events.detail.registerHeading',
      'events.detail.registerLead',
      'events.detail.reserveCta',
      'events.detail.questionsPrefix',
      'events.detail.contactLinkText',
    ] as const),
  ])

  if (!event) {
    notFound()
  }

  const storyTitle = event.storyTitle?.trim() || cms['events.detail.storyTitleDefault']
  const storyBody = event.storyBody?.trim() || event.description
  const highlightsFallback = parseCmsJson<string[]>(
    cms['events.detail.highlightsFallback'],
    DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK,
  )
  const highlights = event.highlights.length > 0 ? event.highlights : highlightsFallback
  const reserveCta = parseCmsJson<CmsHeroCta>(cms['events.detail.reserveCta'], {
    label: 'Reserve Your Place',
    href: '/contact#form',
  })

  const displayDate = formatEventDateDisplay(event.date)
  const lifecycle = event.eventStatus || 'scheduled'
  const delivery = event.deliveryMode || 'in_person'
  const registrationState = resolveEventRegistrationStatus({
    registrationStatus: event.registrationStatus,
    dateLabel: event.date,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  })
  const registrationOpen =
    lifecycle !== 'cancelled' &&
    registrationState !== 'closed' &&
    registrationState !== 'completed'
  const gallery = event.galleryImageUrls ?? []

  return (
    <article className="content-page">
      {siteUrl ? (
        <JsonLd
          data={eventJsonLd(
            {
              title: event.title,
              description: event.description,
              slug: event.slug,
              date: event.date,
              location: event.location,
              image: resolveEventCoverImage(event),
            },
            siteUrl,
          )}
        />
      ) : null}

      <section className="event-detail-hero">
        <Image
          src={resolveEventCoverImage(event)}
          alt={`${event.title} — event at ANANSE Center for Leadership Development`}
          fill
          priority
          className="event-detail-hero-image"
          sizes="100vw"
        />
        <div className="event-detail-hero-scrim" aria-hidden />
        <div className="event-detail-hero-content page-section-container">
          <div className="event-detail-hero-inner">
            <span className="section-badge">{event.type}</span>
            {lifecycle !== 'scheduled' ? (
              <span className="section-badge" style={{ marginLeft: '0.5rem' }}>
                {eventStatusLabel(lifecycle)}
              </span>
            ) : null}
            <h1 className="hero-page-title">{event.title}</h1>
            <div className="event-detail-meta">
              <span className="event-detail-meta-item">
                <Calendar size={16} className="text-accent" aria-hidden />
                {displayDate}
                {event.timeLabel ? ` · ${event.timeLabel}` : ''}
              </span>
              <span className="event-detail-meta-item">
                <MapPin size={16} className="text-accent" aria-hidden />
                {deliveryModeLabel(delivery)}
                {delivery !== 'online' && event.location ? ` · ${event.location}` : ''}
                {event.capacity ? ` · ${event.capacity} seats` : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-white section-reveal">
        <div className="page-section-container content-prose">
          <div className="content-block">
            <h2 className="content-block-title">{storyTitle}</h2>
            <CmsRichText body={storyBody} className="content-prose-body" />
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-card">
              <h3 className="detail-info-label">{cms['events.detail.whenLabel']}</h3>
              <p className="detail-info-value">{displayDate}</p>
              {lifecycle !== 'scheduled' ? (
                <p className="detail-info-sub">{eventStatusLabel(lifecycle)}</p>
              ) : null}
            </div>
            <div className="detail-info-card">
              <h3 className="detail-info-label">{cms['events.detail.whereLabel']}</h3>
              <p className="detail-info-value">{deliveryModeLabel(delivery)}</p>
              {delivery !== 'online' ? <p className="detail-info-sub">{event.location}</p> : null}
              {event.venue ? <p className="detail-info-sub">{event.venue}</p> : null}
              {delivery !== 'in_person' && event.meetingUrl ? (
                <p className="detail-info-sub">
                  <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer">
                    Join online
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          {event.program ? (
            <p className="page-body-text">
              Part of{' '}
              <LocalizedLink href={`/programs/${event.program.slug}`}>{event.program.title}</LocalizedLink>
            </p>
          ) : null}

          <div className="content-block">
            <h2 className="content-block-title content-block-title--plain">
              {cms['events.detail.highlightsHeading']}
            </h2>
            <ul className="content-highlight-list">
              {highlights.map((highlight) => (
                <li key={highlight} className="content-highlight-item">
                  <span className="content-highlight-mark" aria-hidden>
                    ✦
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {gallery.length > 0 || event.recordingUrl ? (
            <div className="content-block">
              <h2 className="content-block-title content-block-title--plain">Media from this gathering</h2>
              {event.recordingUrl ? (
                <p className="page-body-text">
                  <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer">
                    Watch or listen to the recording
                  </a>
                </p>
              ) : null}
              {gallery.length > 0 ? (
                <div className="grid-cards">
                  {gallery.map((src) => (
                    <div key={src} className="card-image-wrapper" style={{ position: 'relative', minHeight: 180 }}>
                      <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {registrationOpen ? (
            <div id="register" className="content-block">
              <h2 className="content-block-title content-block-title--plain">
                {cms['events.detail.registerHeading']}
              </h2>
              <CmsRichText
                body={cms['events.detail.registerLead']}
                className="page-body-text text-body-md mb-section"
              />
              <EventRegistrationForm eventSlug={slug} eventTitle={event.title} />
            </div>
          ) : (
            <div id="register" className="content-block">
              <h2 className="content-block-title content-block-title--plain">Registration</h2>
              <p className="page-body-text">
                {lifecycle === 'cancelled'
                  ? 'This gathering has been cancelled. Registration is closed.'
                  : lifecycle === 'postponed'
                    ? 'This gathering has been postponed. Registration will reopen when a new date is set.'
                    : 'Registration is closed for this gathering. The page remains as the record.'}
              </p>
            </div>
          )}

          <div className="content-cta-bar">
            <LocalizedLink href="/get-involved#contact" className="btn-primary">
              {reserveCta.label}
            </LocalizedLink>
            <p className="content-cta-note">
              {cms['events.detail.questionsPrefix']}{' '}
              <LocalizedLink href="/get-involved#contact" className="content-cta-link">
                {cms['events.detail.contactLinkText']}
              </LocalizedLink>
            </p>
          </div>
        </div>
      </section>
    </article>
  )
}
