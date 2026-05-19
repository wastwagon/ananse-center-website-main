'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import { cardImageSizes, images, eventImageForSlug } from '../../../lib/images'

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
    <div>
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
      <section id="calendar" className="page-section bg-white py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['events.featured.badge']}</span>
            <h2 className="page-section-heading">{cms['events.featured.heading']}</h2>
          </div>

          <div className="grid-cards">
            {events.filter(e => e.featured).map((event) => (
              <article
                key={event.id}
                className="program-card"
                style={{ borderTop: '4px solid #fbbf24' }}
                aria-label={event.title}
              >
                {/* ── Consistent 16:9 image slot ── */}
                <div className="card-image-wrapper">
                  <Image
                    src={eventImageForSlug(event.slug)}
                    alt={event.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes={cardImageSizes}
                  />
                </div>

                {/* ── Badge row — flex-start so badge & "Featured" label don't shift layout ── */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.875rem',
                  }}
                >
                  <EventTypeIcon type={event.type} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#d97706',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      paddingTop: '2px',
                    }}
                  >
                    Featured
                  </span>
                </div>

                {/* ── Title ── */}
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    marginBottom: '0.5rem',
                    lineHeight: 1.35,
                  }}
                >
                  {event.title}
                </h3>

                {/* ── Date + location ── */}
                <div className="flex flex-col gap-1 mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="text-[12px] font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <Calendar size={14} className="text-accent shrink-0" aria-hidden />
                    {event.date}
                  </div>
                  <div className="text-[12px] text-[#475569] flex items-center gap-1.5">
                    <MapPin size={14} className="shrink-0" aria-hidden />
                    {event.location}
                  </div>
                </div>

                {/* ── Description grows to fill remaining space ── */}
                <p className="program-card-description">{event.description}</p>

                {/* ── CTA pinned to bottom ── */}
                <Link
                  href={`/events/${event.slug}`}
                  className="btn-primary"
                  style={{ textAlign: 'center', justifyContent: 'center', marginTop: '1.5rem' }}
                >
                  Event details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Full Catalog ─── */}
      <section className="page-section bg-slate-50 py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{cms['events.catalog.heading']}</h2>
          </div>

          {/* Filter tabs */}
          <div
            role="tablist"
            aria-label="Event category filter"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.625rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
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

          {/* Cards — height:100% on insight-card + align-items:stretch on grid = equal rows */}
          <div className="grid-cards">
            {filteredEvents.map((event) => (
              <article key={event.id} className="insight-card" aria-label={event.title}>
                <div className="insight-card-bar" />
                <div className="insight-card-body">

                  {/* ── Type tag + icon ── */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.875rem',
                    }}
                  >
                    <span className="insight-card-tag">{event.type}</span>
                    <EventTypeIcon type={event.type} className="program-card-icon" />
                  </div>

                  {/* ── Title ── */}
                  <h3 className="insight-card-title" style={{ fontSize: '1.0625rem' }}>
                    {event.title}
                  </h3>

                  {/* ── Date ── */}
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#d97706',
                      marginBottom: '0.625rem',
                    }}
                  >
                    {event.date}
                  </p>

                  {/* ── Description grows ── */}
                  <p className="insight-card-description">{event.description}</p>

                  {/* ── Footer always at bottom ── */}
                  <div className="mt-4 flex flex-col items-start gap-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" aria-hidden />
                      {event.location}
                    </div>
                    <Link
                      href={`/events/${event.slug}`}
                      className="program-card-link"
                      style={{ display: 'block' }}
                    >
                      Event details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Impact & Stories ─── */}
      <section className="page-section bg-white py-16">
        <div className="page-section-container">
          <div className="two-col-section">
            <div>
              <span className="section-badge">{cms['events.highlights.badge']}</span>
              <h2 className="page-section-heading">{cms['events.highlights.heading']}</h2>
              <p className="page-body-text" style={{ marginBottom: '2.5rem' }}>
                {cms['events.highlights.lead']}
              </p>

              <div className="grid-cards">
                {highlightMetrics.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#d97706' }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-visual-card">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
              <blockquote style={{ fontSize: '1.125rem', color: '#1A1A1A', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                &quot;{highlightTestimonial.quote}&quot;
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="testimonial-avatar">{highlightTestimonial.initials}</div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{highlightTestimonial.name}</p>
                  <p style={{ fontSize: '12px', color: '#1A1A1A', margin: 0 }}>{highlightTestimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="page-section bg-slate-50">
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
              className="form-input"
              placeholder="Enter your email"
              style={{ flex: 1, minWidth: '180px' }}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0 24px' }}
              onClick={handleNewsletterSubmit}
              disabled={newsletterStatus === 'loading'}
            >
              {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {newsletterMessage ? (
            <p className="page-body-text" style={{ marginTop: '1rem', fontSize: '14px' }}>
              {newsletterMessage}
            </p>
          ) : null}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">{cms['events.cta.heading']}</h2>
          <p className="page-cta-body">{cms['events.cta.body']}</p>
          <div className="page-cta-buttons">
            <Link href="/programs" className="btn-primary page-cta-btn">
              Explore Programs
            </Link>
            <Link href="/contact#form" className="btn-outline-white page-cta-btn">
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}