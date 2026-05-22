import type { Metadata } from 'next'
import LocalizedLink from '../../../../components/LocalizedLink'
import EventRegistrationForm from '../../../../components/EventRegistrationForm'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, MapPin } from 'lucide-react'
import JsonLd from '../../../../components/JsonLd'
import { fetchEventBySlug } from '../../../../lib/api'
import { formatEventDateDisplay } from '../../../../lib/format'
import { resolveEventCoverImage } from '../../../../lib/images'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { eventJsonLd } from '../../../../lib/structured-data'
import {
  DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK,
  getCmsTexts,
  parseCmsJson,
  splitParagraphs,
  type CmsHeroCta,
} from '../../../../lib/cms/content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const [event, cms] = await Promise.all([
    fetchEventBySlug(slug),
    getCmsTexts([
      'events.detail.storyTitleDefault',
      'events.detail.highlightsHeading',
      'events.detail.highlightsFallback',
      'events.detail.whenLabel',
      'events.detail.whereLabel',
      'events.detail.reserveCta',
      'events.detail.questionsPrefix',
      'events.detail.contactLinkText',
    ] as const),
  ])

  if (!event) {
    notFound()
  }

  const storyTitle = event.storyTitle?.trim() || cms['events.detail.storyTitleDefault']
  const storyParagraphs = event.storyBody?.trim()
    ? splitParagraphs(event.storyBody)
    : splitParagraphs(event.description)
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
          alt={`${event.title} — event at The Ananse Center`}
          fill
          priority
          className="event-detail-hero-image"
          sizes="100vw"
        />
        <div className="event-detail-hero-scrim" aria-hidden />
        <div className="event-detail-hero-content page-section-container">
          <div className="event-detail-hero-inner">
            <span className="section-badge">{event.type}</span>
            <h1 className="hero-page-title">{event.title}</h1>
            <div className="event-detail-meta">
              <span className="event-detail-meta-item">
                <Calendar size={16} className="text-accent" aria-hidden />
                {displayDate}
              </span>
              <span className="event-detail-meta-item">
                <MapPin size={16} className="text-accent" aria-hidden />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-white section-reveal">
        <div className="page-section-container content-prose">
          <div className="content-block">
            <h2 className="content-block-title">{storyTitle}</h2>
            <div className="content-prose-body">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="page-body-text content-prose-p">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-card">
              <h3 className="detail-info-label">{cms['events.detail.whenLabel']}</h3>
              <p className="detail-info-value">{displayDate}</p>
            </div>
            <div className="detail-info-card">
              <h3 className="detail-info-label">{cms['events.detail.whereLabel']}</h3>
              <p className="detail-info-value">{event.location}</p>
              {event.venue ? <p className="detail-info-sub">{event.venue}</p> : null}
            </div>
          </div>

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

          <div className="content-block">
            <h2 className="content-block-title content-block-title--plain">Register</h2>
            <p className="page-body-text text-body-md mb-section">
              Reserve your place or register interest — our team will follow up by email.
            </p>
            <EventRegistrationForm eventSlug={slug} eventTitle={event.title} />
          </div>

          <div className="content-cta-bar">
            <LocalizedLink href="/contact#form" className="btn-primary">
              {reserveCta.label}
            </LocalizedLink>
            <p className="content-cta-note">
              {cms['events.detail.questionsPrefix']}{' '}
              <LocalizedLink href="/contact#form" className="content-cta-link">
                {cms['events.detail.contactLinkText']}
              </LocalizedLink>
            </p>
          </div>
        </div>
      </section>
    </article>
  )
}
