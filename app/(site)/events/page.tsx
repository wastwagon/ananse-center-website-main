'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import PageCtaBand from '../../../components/PageCtaBand'
import { fetchEvents, subscribeNewsletter, type ApiEvent } from '../../../lib/api'
import { fallbackEvents } from './events-data'
import HeroSplit from '../../../components/HeroSplit'
import { useCmsTexts } from '../../../lib/cms/client'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import { parseCmsJson } from '../../../lib/cms/parse'
import {
  DEFAULT_EVENTS_FILTER_CATEGORIES,
  DEFAULT_EVENTS_HERO_CTA_PRIMARY,
  DEFAULT_EVENTS_HERO_CTA_SECONDARY,
  DEFAULT_PROGRAMS_HERO_CTA_PRIMARY,
  DEFAULT_EVENTS_HERO_STATS,
  DEFAULT_EVENTS_HERO_TITLE,
  DEFAULT_EVENTS_HIGHLIGHTS_METRICS,
  DEFAULT_EVENTS_HIGHLIGHTS_TESTIMONIAL,
  type CmsEventTestimonial,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsLabeledValue,
} from '../../../lib/cms/registry'
import EventTypeIcon from '../../../components/EventTypeIcon'
import { Calendar, MapPin } from 'lucide-react'
import { cardImageSizes, images, resolveEventCoverImage } from '../../../lib/images'
import { formatEventDateDisplay } from '../../../lib/format'

const EVENTS_CMS_KEYS = [
  'events.hero.lead',
  'events.hero.title',
  'events.hero.stats',
  'events.hero.cta.primary',
  'events.hero.cta.secondary',
  'events.featured.badge',
  'events.featured.heading',
  'events.catalog.heading',
  'events.filter.categories',
  'events.highlights.badge',
  'events.highlights.heading',
  'events.highlights.lead',
  'events.highlights.metrics',
  'events.highlights.testimonial',
  'events.newsletter.heading',
  'events.newsletter.lead',
  'events.cta.heading',
  'events.cta.body',
  'home.events.cardCta',
] as const


/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */

export default function EventsPage() {
  const cms = useCmsTexts(EVENTS_CMS_KEYS)
  const heroTitle = useMemo(
    () => parseCmsJson<CmsHeroTitle>(cms['events.hero.title'], DEFAULT_EVENTS_HERO_TITLE),
    [cms['events.hero.title']],
  )
  const heroStats = useMemo(
    () => parseCmsJson<CmsHeroStat[]>(cms['events.hero.stats'], DEFAULT_EVENTS_HERO_STATS),
    [cms['events.hero.stats']],
  )
  const heroPrimaryCta = useMemo(
    () => parseCmsJson<CmsHeroCta>(cms['events.hero.cta.primary'], DEFAULT_EVENTS_HERO_CTA_PRIMARY),
    [cms['events.hero.cta.primary']],
  )
  const heroSecondaryCta = useMemo(
    () => parseCmsJson<CmsHeroCta>(cms['events.hero.cta.secondary'], DEFAULT_EVENTS_HERO_CTA_SECONDARY),
    [cms['events.hero.cta.secondary']],
  )
  const categories = useMemo(
    () => parseCmsJson<string[]>(cms['events.filter.categories'], DEFAULT_EVENTS_FILTER_CATEGORIES),
    [cms['events.filter.categories']],
  )
  const highlightMetrics = useMemo(
    () => parseCmsJson<CmsLabeledValue[]>(cms['events.highlights.metrics'], DEFAULT_EVENTS_HIGHLIGHTS_METRICS),
    [cms['events.highlights.metrics']],
  )
  const highlightTestimonial = useMemo(
    () =>
      parseCmsJson<CmsEventTestimonial>(
        cms['events.highlights.testimonial'],
        DEFAULT_EVENTS_HIGHLIGHTS_TESTIMONIAL,
      ),
    [cms['events.highlights.testimonial']],
  )
  const [activeTab, setActiveTab] = useState('All Events')
  const [events, setEvents] = useState<ApiEvent[]>(fallbackEvents)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) {
      setActiveTab(categories[0])
    }
  }, [categories, activeTab])

  useEffect(() => {
    let cancelled = false

    fetchEvents()
      .then((data) => {
        if (!cancelled && data.length > 0) setEvents(data)
      })
      .catch(() => {
        if (!cancelled) setEvents(fallbackEvents)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredEvents = activeTab === "All Events"
    ? events
    : events.filter(e => e.type === activeTab)

  async function handleNewsletterSubmit() {
    if (!newsletterEmail.trim()) return
    setNewsletterStatus('loading')
    setNewsletterMessage('')
    try {
      const result = await subscribeNewsletter(newsletterEmail.trim())
      setNewsletterStatus('success')
      setNewsletterMessage(result.message)
      setNewsletterEmail('')
    } catch (error) {
      setNewsletterStatus('error')
      setNewsletterMessage(error instanceof Error ? error.message : 'Subscription failed')
    }
  }

  return (
    <div className="events-page">
      <HeroSplit
        compact
        imageSrc={images.hero.events}
        imageAlt="Cultural festivals at Ananse Center"
        title={renderSplitHeroTitle(heroTitle)}
        description={cms['events.hero.lead']}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      {/* ─── Featured Section ─── */}
      <section id="calendar" className="page-section section-reveal bg-white py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['events.featured.badge']}</span>
            <h2 className="page-section-heading">{cms['events.featured.heading']}</h2>
          </div>

          <div className="grid-cards grid-cards--stack-narrow">
            {events.filter(e => e.featured).map((event) => (
              <article
                key={event.id}
                className="program-card program-card--featured"
                aria-label={event.title}
              >
                <div className="card-image-wrapper">
                  <Image
                    src={resolveEventCoverImage(event)}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>

                <div className="program-card-header-row">
                  <EventTypeIcon type={event.type} />
                  <span className="program-card-featured-label">Featured</span>
                </div>

                <h3 className="program-card-title-lg">{event.title}</h3>

                <div className="event-card-meta">
                  <div className="text-[12px] font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <Calendar size={14} className="text-accent shrink-0" aria-hidden />
                    {formatEventDateDisplay(event.date)}
                  </div>
                  <div className="text-[12px] text-[#475569] flex items-center gap-1.5">
                    <MapPin size={14} className="shrink-0" aria-hidden />
                    {event.location}
                  </div>
                </div>

                {/* ── Description grows to fill remaining space ── */}
                <p className="program-card-description">{event.description}</p>

                {/* ── CTA pinned to bottom ── */}
                <LocalizedLink
                  href={`/events/${event.slug}`}
                  className="btn-primary program-card-cta-bottom"
                >
                  {cms['home.events.cardCta'] ?? 'Event details'}
                </LocalizedLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Full Catalog ─── */}
      <section className="page-section section-reveal bg-slate-50 py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{cms['events.catalog.heading']}</h2>
          </div>

          <div className="filter-scroll">
            <div className="segmented-control" role="tablist" aria-label="Event category filter">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeTab === cat}
                  onClick={() => setActiveTab(cat)}
                  className={`filter-btn ${activeTab === cat ? 'filter-btn-active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-cards grid-cards--stack-narrow">
            {filteredEvents.map((event) => (
              <article key={event.id} className="insight-card" aria-label={event.title}>
                <div className="insight-card-bar" />
                <div className="insight-card-body">

                  {/* ── Type tag + icon ── */}
                  <div className="insight-card-header-row">
                    <span className="insight-card-tag">{event.type}</span>
                    <EventTypeIcon type={event.type} className="program-card-icon" />
                  </div>

                  <h3 className="insight-card-title">{event.title}</h3>

                  <p className="insight-card-date">{formatEventDateDisplay(event.date)}</p>

                  {/* ── Description grows ── */}
                  <p className="insight-card-description">{event.description}</p>

                  {/* ── Footer always at bottom ── */}
                  <div className="insight-card-footer">
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" aria-hidden />
                      {event.location}
                    </div>
                    <LocalizedLink href={`/events/${event.slug}`} className="program-card-link">
                      {cms['home.events.cardCta'] ?? 'Event details'} →
                    </LocalizedLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Impact & Stories ─── */}
      <section className="page-section section-reveal bg-white py-16">
        <div className="page-section-container">
          <div className="two-col-section">
            <div>
              <span className="section-badge">{cms['events.highlights.badge']}</span>
              <h2 className="page-section-heading">{cms['events.highlights.heading']}</h2>
              <p className="page-body-text mb-section">
                {cms['events.highlights.lead']}
              </p>

              <div className="grid-cards events-metrics-grid">
                {highlightMetrics.map((s) => (
                  <div key={s.label}>
                    <div className="metric-stat-value">{s.value}</div>
                    <div className="metric-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-visual-card">
              <div className="testimonial-emoji" aria-hidden>🌟</div>
              <blockquote className="testimonial-quote-block">
                &quot;{highlightTestimonial.quote}&quot;
              </blockquote>
              <div className="testimonial-attribution">
                <div className="testimonial-avatar">{highlightTestimonial.initials}</div>
                <div>
                  <p className="testimonial-name">{highlightTestimonial.name}</p>
                  <p className="testimonial-role-sm">{highlightTestimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section id="newsletter" className="page-section bg-slate-50 section-reveal">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{cms['events.newsletter.heading']}</h2>
            <p className="page-body-text">{cms['events.newsletter.lead']}</p>
          </div>
          <div className="newsletter-inline-form">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="form-input newsletter-form-input"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary newsletter-form-btn"
              onClick={handleNewsletterSubmit}
              disabled={newsletterStatus === 'loading'}
            >
              {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {newsletterMessage ? (
            <p className="page-body-text text-body-md mt-note">
              {newsletterMessage}
            </p>
          ) : null}
        </div>
      </section>

      <PageCtaBand
        heading={cms['events.cta.heading']}
        body={cms['events.cta.body']}
        primary={{
          label: DEFAULT_PROGRAMS_HERO_CTA_PRIMARY.label,
          href: '/programs',
        }}
        secondary={{
          label: heroSecondaryCta.label,
          href: heroSecondaryCta.href,
          variant: 'outline-white',
        }}
      />
    </div>
  )
}