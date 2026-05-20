import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, MapPin } from 'lucide-react'
import { fetchEventBySlug } from '../../../../lib/api'
import { eventImageForSlug } from '../../../../lib/images'
import {
  DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK,
  getCmsTexts,
  parseCmsJson,
  splitParagraphs,
  type CmsHeroCta,
} from '../../../../lib/cms/content'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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

  return (
    <div className="min-h-screen bg-white pb-20 font-body">
      <section className="event-detail-hero">
        <Image
          src={eventImageForSlug(slug)}
          alt=""
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
                {event.date}
              </span>
              <span className="event-detail-meta-item">
                <MapPin size={16} className="text-accent" aria-hidden />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section bg-white py-16">
        <div className="page-section-container">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6 border-l-4 border-accent pl-4 font-heading">
              {storyTitle}
            </h2>
            <div className="space-y-6">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid-cards mb-12">
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {cms['events.detail.whenLabel']}
              </h3>
              <p className="text-[#1A1A1A] text-lg font-medium">{event.date}</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {cms['events.detail.whereLabel']}
              </h3>
              <p className="text-[#1A1A1A] text-lg font-medium">{event.location}</p>
              {event.venue ? (
                <p className="text-slate-500 mt-1 text-sm">{event.venue}</p>
              ) : null}
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 font-heading">
              {cms['events.detail.highlightsHeading']}
            </h3>
            <ul className="space-y-4">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-4 group">
                  <span className="text-accent mt-1 flex-shrink-0 text-xl leading-none" aria-hidden>
                    ✦
                  </span>
                  <span className="text-slate-600 text-base leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-10 border-t border-slate-100 mt-10">
            <Link href={reserveCta.href} className="btn-primary hero-cta-primary">
              {reserveCta.label}
            </Link>
            <p className="mt-6 text-sm text-slate-500">
              {cms['events.detail.questionsPrefix']}{' '}
              <Link href="/contact#form" className="text-accent font-medium hover:underline">
                {cms['events.detail.contactLinkText']}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
