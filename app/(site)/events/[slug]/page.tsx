import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import EventRegistrationForm from '../../../../components/EventRegistrationForm'
import CardCover from '../../../../components/CardCover'
import { Calendar, MapPin } from 'lucide-react'
import JsonLd from '../../../../components/JsonLd'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchEventBySlug, fetchInsights, fetchLibraryItems, fetchPhotoAlbums } from '../../../../lib/api'
import ShareBar from '../../../../components/ShareBar'
import { formatEventDateDisplay } from '../../../../lib/format'
import { resolveEventCoverImage } from '../../../../lib/images'
import { cmsPlainExcerpt, looksLikeHtml } from '../../../../lib/cms/richtext'
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
    description: cmsPlainExcerpt(event.description, 160),
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

  const [relatedLibrary, relatedAlbums, relatedInsights] = await Promise.all([
    event.program?.slug
      ? fetchLibraryItems({ program: event.program.slug }).catch(() => [])
      : Promise.resolve([]),
    fetchPhotoAlbums({ event: event.slug }).catch(() => []),
    event.program?.title
      ? fetchInsights().catch(() => [])
      : Promise.resolve([]),
  ])
  const programInsights = event.program
    ? relatedInsights.filter((item) => item.program?.slug === event.program?.slug).slice(0, 6)
    : []

  const storyTitle = event.storyTitle?.trim() || cms['events.detail.storyTitleDefault']
  const storyBody = event.storyBody?.trim() || event.description
  const highlightsFallback = parseCmsJson<string[]>(
    cms['events.detail.highlightsFallback'],
    DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK,
  )
  const highlights = event.highlights.length > 0 ? event.highlights : highlightsFallback
  const reserveCta = parseCmsJson<CmsHeroCta>(cms['events.detail.reserveCta'], {
    label: 'Reserve Your Place',
    href: '/get-involved#contact',
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
  const typeBrowseHref = `/events?type=${encodeURIComponent(event.type)}`
  const whenLine = [displayDate, event.timeLabel].filter(Boolean).join(' · ')
  const whereLine = [
    deliveryModeLabel(delivery),
    delivery !== 'online' ? event.location : null,
    event.venue,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="events-detail">
      {siteUrl ? (
        <JsonLd
          data={eventJsonLd(
            {
              title: event.title,
              description: cmsPlainExcerpt(event.description, 160),
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
            <div className="events-detail-hero-badges">
              <span className="section-badge">{event.type}</span>
              {lifecycle !== 'scheduled' ? (
                <span className="section-badge">{eventStatusLabel(lifecycle)}</span>
              ) : null}
            </div>
            <h1 className="hero-page-title">{event.title}</h1>
            {event.subtitle ? <p className="page-body-text">{event.subtitle}</p> : null}
            <div className="event-detail-meta">
              <span className="event-detail-meta-item">
                <Calendar size={16} className="text-accent" aria-hidden />
                {whenLine}
              </span>
              <span className="event-detail-meta-item">
                <MapPin size={16} className="text-accent" aria-hidden />
                {whereLine}
                {event.capacity ? ` · ${event.capacity} seats` : ''}
              </span>
            </div>
            <div className="events-detail-hero-actions">
              {registrationOpen ? (
                <a href="#register" className="hero-page-btn hero-page-btn--primary">
                  Register
                </a>
              ) : null}
              <LocalizedLink href="/events" className="hero-page-btn hero-page-btn--ghost">
                All Events
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="events-detail-overview">
            <div className="events-detail-story">
              <span className="section-badge">{event.type}</span>
              <h2 className="page-section-heading">{storyTitle}</h2>
              <CmsRichText body={storyBody} className="content-prose-body" />

              {highlights.length > 0 ? (
                <div className="events-detail-panel">
                  <h3 className="events-detail-panel-title">{cms['events.detail.highlightsHeading']}</h3>
                  <div className="events-detail-highlight-grid">
                    {highlights.map((highlight) => (
                      <article key={highlight} className="events-detail-highlight-card">
                        {looksLikeHtml(highlight) ? (
                          <CmsRichText body={highlight} className="events-detail-highlight-text" />
                        ) : (
                          <p className="events-detail-highlight-text">{highlight}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {gallery.length > 0 || event.recordingUrl ? (
                <div className="events-detail-panel">
                  <h3 className="events-detail-panel-title">Media from this gathering</h3>
                  {event.recordingUrl ? (
                    <p className="page-body-text">
                      <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer">
                        Watch the recording
                      </a>
                    </p>
                  ) : null}
                  {event.audioUrl ? (
                    <p className="page-body-text">
                      <a href={event.audioUrl} target="_blank" rel="noopener noreferrer">
                        Listen to the audio
                      </a>
                    </p>
                  ) : null}
                  {gallery.length > 0 ? (
                    <div className="events-detail-gallery">
                      {gallery.map((src) => (
                        <div key={src} className="events-detail-gallery-item">
                          <CardCover src={src} alt="" sizes="(max-width:768px) 100vw, 33vw" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div id="register" className="events-detail-panel events-detail-panel--accent">
                <h3 className="events-detail-panel-title">
                  {registrationOpen
                    ? cms['events.detail.registerHeading']
                    : 'Registration'}
                </h3>
                {registrationOpen ? (
                  <>
                    <CmsRichText
                      body={cms['events.detail.registerLead']}
                      className="page-body-text text-body-md mb-section"
                    />
                    <EventRegistrationForm eventSlug={slug} eventTitle={event.title} />
                  </>
                ) : (
                  <p className="page-body-text">
                    {lifecycle === 'cancelled'
                      ? 'This gathering has been cancelled. Registration is closed.'
                      : lifecycle === 'postponed'
                        ? 'This gathering has been postponed. Registration will reopen when a new date is set.'
                        : 'Registration is closed for this gathering. The page remains as the record.'}
                  </p>
                )}
              </div>
            </div>

            <aside className="events-detail-aside">
              <div className="events-detail-aside-card">
                <p className="events-detail-aside-label">Next steps</p>
                <p className="events-detail-aside-title">{event.title}</p>
                <ul className="events-detail-glance-list">
                  <li>
                    <strong>What</strong>
                    <span>
                      {[event.type, event.program?.title].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                  <li>
                    <strong>{cms['events.detail.whenLabel']}</strong>
                    <span>{whenLine}</span>
                  </li>
                  <li>
                    <strong>{cms['events.detail.whereLabel']}</strong>
                    <span>{whereLine || deliveryModeLabel(delivery)}</span>
                  </li>
                  <li>
                    <strong>How</strong>
                    <span>
                      {`${
                        delivery === 'online'
                          ? 'Join online'
                          : delivery === 'hybrid'
                            ? 'Attend in person or online'
                            : 'Attend in person'
                      }. ${
                        registrationOpen
                          ? 'Registration is open on this page.'
                          : 'This page remains the record of the gathering.'
                      }`}
                    </span>
                  </li>
                  {event.capacity ? (
                    <li>
                      <strong>Capacity</strong>
                      <span>{event.capacity} seats</span>
                    </li>
                  ) : null}
                </ul>
                {registrationOpen ? (
                  <a href="#register" className="btn-primary events-detail-aside-cta">
                    Register
                  </a>
                ) : (
                  <LocalizedLink href="/events" className="btn-primary events-detail-aside-cta">
                    All Events
                  </LocalizedLink>
                )}
                <LocalizedLink href={typeBrowseHref} className="btn-outline events-detail-aside-secondary">
                  Browse {event.type}
                </LocalizedLink>
                <LocalizedLink href="/events" className="btn-outline events-detail-aside-secondary">
                  All Events
                </LocalizedLink>
              </div>

              {event.speakers && event.speakers.length > 0 ? (
                <div className="events-detail-aside-card events-detail-aside-card--muted">
                  <p className="events-detail-aside-label">People</p>
                  <ul className="events-detail-link-list">
                    {event.speakers.map((speaker) => (
                      <li key={speaker.id}>
                        <LocalizedLink href={`/people/${speaker.slug}`}>
                          {speaker.name}
                        </LocalizedLink>
                        {speaker.role ? ` · ${speaker.role}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {(event.program || delivery !== 'in_person' && event.meetingUrl) && (
                <div className="events-detail-aside-card events-detail-aside-card--muted">
                  <p className="events-detail-aside-label">Connected to</p>
                  <ul className="events-detail-link-list">
                    {event.program ? (
                      <li>
                        <LocalizedLink href={`/programs/${event.program.slug}`}>
                          {event.program.title}
                        </LocalizedLink>
                      </li>
                    ) : null}
                    {delivery !== 'in_person' && event.meetingUrl ? (
                      <li>
                        <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer">
                          Join online
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {relatedAlbums.length > 0 || relatedLibrary.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            {relatedAlbums.length > 0 ? (
              <div className="events-detail-related-block">
                <div className="events-section-intro">
                  <span className="section-badge">Photos</span>
                  <h2 className="page-section-heading">Photo albums</h2>
                </div>
                <div className="events-detail-link-grid">
                  {relatedAlbums.map((album) => (
                    <LocalizedLink
                      key={album.id}
                      href={`/library/photos/${album.slug}`}
                      className="events-detail-link-card"
                    >
                      <span className="events-detail-link-title">{album.title}</span>
                      {album.collection ? (
                        <span className="events-detail-link-meta">{album.collection}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}

            {event.transcript ? (
              <div className="events-detail-related-block">
                <div className="events-section-intro">
                  <span className="section-badge">Read</span>
                  <h2 className="page-section-heading">Transcript</h2>
                </div>
                <CmsRichText body={event.transcript} className="content-prose-body" />
              </div>
            ) : null}
            {programInsights.length > 0 ? (
              <div className="events-detail-related-block">
                <div className="events-section-intro">
                  <span className="section-badge">Insights</span>
                  <h2 className="page-section-heading">Related insights</h2>
                </div>
                <div className="events-detail-link-grid">
                  {programInsights.map((item) => (
                    <LocalizedLink key={item.slug} href={`/insights/${item.slug}`} className="events-detail-link-card">
                      <span className="events-detail-link-title">{item.title}</span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            <ShareBar title={event.title} path={`/events/${event.slug}`} />
            {relatedLibrary.length > 0 ? (
              <div className="events-detail-related-block">
                <div className="events-section-intro">
                  <span className="section-badge">Library</span>
                  <h2 className="page-section-heading">Related from the Library</h2>
                  <p className="page-body-text">
                    Resources linked to the same program as this gathering.
                  </p>
                </div>
                <div className="events-detail-link-grid">
                  {relatedLibrary.slice(0, 6).map((item) => (
                    <LocalizedLink
                      key={item.id}
                      href={item.href || `/library/${item.slug}`}
                      className="events-detail-link-card"
                    >
                      <span className="events-detail-link-title">{item.title}</span>
                      {item.collection ? (
                        <span className="events-detail-link-meta">{item.collection}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="events-detail-footer-actions">
              <LocalizedLink href={reserveCta.href || '/get-involved#contact'} className="btn-primary">
                {reserveCta.label}
              </LocalizedLink>
              <p className="events-detail-footer-note">
                {cms['events.detail.questionsPrefix']}{' '}
                <LocalizedLink href="/get-involved#contact" className="content-cta-link">
                  {cms['events.detail.contactLinkText']}
                </LocalizedLink>
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="events-detail-footer-actions">
              <LocalizedLink href={reserveCta.href || '/get-involved#contact'} className="btn-primary">
                {reserveCta.label}
              </LocalizedLink>
              <p className="events-detail-footer-note">
                {cms['events.detail.questionsPrefix']}{' '}
                <LocalizedLink href="/get-involved#contact" className="content-cta-link">
                  {cms['events.detail.contactLinkText']}
                </LocalizedLink>
              </p>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
