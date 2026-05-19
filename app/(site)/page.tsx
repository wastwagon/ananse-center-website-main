import Image from 'next/image'
import Link from 'next/link'
import HeroPremium from '../../components/HeroPremium'
import type { CmsHeroCta, CmsHeroStat, CmsHomeHeroTitle } from '../../lib/cms/registry'
import FeatureIcon from '../../components/FeatureIcon'
import EventTypeIcon from '../../components/EventTypeIcon'
import { cmsIconForKey } from '../../lib/cms-icons'
import { cardImageSizes, images } from '../../lib/images'
import { getFeaturedEventsForHome } from '../../lib/featured-events'
import { getSankofaProgramsForHome } from '../../lib/sankofa-programs'
import {
  DEFAULT_HOME_PILLARS,
  DEFAULT_HOME_SECTORS,
  DEFAULT_HOME_HERO_CTA_PRIMARY,
  DEFAULT_HOME_HERO_CTA_SECONDARY,
  DEFAULT_HOME_HERO_STATS,
  DEFAULT_HOME_HERO_TITLE,
  DEFAULT_HOME_STORY_HIGHLIGHTS,
  DEFAULT_HOME_TESTIMONIALS,
  getCmsTexts,
  parseCmsJson,
  splitParagraphs,
  type CmsPillar,
  type CmsSector,
  type CmsStoryHighlight,
  type CmsTestimonial,
} from '../../lib/cms/content'

export default async function Home() {
  const [cms, featuredEvents, sankofaPrograms] = await Promise.all([
    getCmsTexts([
      'home.hero.lead',
      'home.hero.title',
      'home.hero.stats',
      'home.hero.cta.primary',
      'home.hero.cta.secondary',
      'home.story',
      'home.story.badge',
      'home.story.heading',
      'home.story.highlights',
      'home.pillars.badge',
      'home.pillars.heading',
      'home.pillars.lead',
      'home.pillars',
      'home.programs.badge',
      'home.programs.heading',
      'home.programs.lead',
      'home.events.badge',
      'home.events.heading',
      'home.events.lead',
      'home.testimonials.badge',
      'home.testimonials.heading',
      'home.testimonials.lead',
      'home.testimonials',
      'home.sectors.badge',
      'home.sectors.heading',
      'home.sectors.lead',
      'home.sectors',
      'home.cta.heading',
      'home.cta.body',
    ] as const),
    getFeaturedEventsForHome(),
    getSankofaProgramsForHome(),
  ])
  const homeHeroTitle = parseCmsJson<CmsHomeHeroTitle>(cms['home.hero.title'], DEFAULT_HOME_HERO_TITLE)
  const homeHeroStats = parseCmsJson<CmsHeroStat[]>(cms['home.hero.stats'], DEFAULT_HOME_HERO_STATS)
  const homeHeroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['home.hero.cta.primary'], DEFAULT_HOME_HERO_CTA_PRIMARY)
  const homeHeroSecondaryCta = parseCmsJson<CmsHeroCta>(
    cms['home.hero.cta.secondary'],
    DEFAULT_HOME_HERO_CTA_SECONDARY,
  )
  const storyParagraphs = splitParagraphs(cms['home.story'])
  const storyHighlights = parseCmsJson<CmsStoryHighlight[]>(
    cms['home.story.highlights'],
    DEFAULT_HOME_STORY_HIGHLIGHTS,
  )
  const pillars = parseCmsJson<CmsPillar[]>(cms['home.pillars'], DEFAULT_HOME_PILLARS)
  const sectors = parseCmsJson<CmsSector[]>(cms['home.sectors'], DEFAULT_HOME_SECTORS)
  const impactStories = parseCmsJson<CmsTestimonial[]>(
    cms['home.testimonials'],
    DEFAULT_HOME_TESTIMONIALS,
  )

  return (
    <div>
      <HeroPremium
        lead={cms['home.hero.lead']}
        title={homeHeroTitle}
        stats={homeHeroStats}
        primaryCta={homeHeroPrimaryCta}
        secondaryCta={homeHeroSecondaryCta}
      />

      <section id="our-story" className="page-section bg-white">
        <div className="page-section-container">
          <div className="two-col-section">
            <div>
              <span className="section-badge">{cms['home.story.badge']}</span>
              <h2 className="page-section-heading">{cms['home.story.heading']}</h2>
              <div className="page-body-stack">
                {storyParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="page-body-text">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Link href="/about" className="btn-primary page-inline-cta">
                Read Our Mission
              </Link>
            </div>
            <div className="about-visual-card">
              <div className="about-visual-grid">
                {storyHighlights.map((item) => {
                  const Icon = cmsIconForKey(item.iconKey)
                  return (
                    <div key={item.label} className="about-mini-card">
                      <FeatureIcon icon={Icon} variant="gold" />
                      <p className="about-mini-label">{item.label}</p>
                      <p className="about-mini-sub">{item.sub}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['home.pillars.badge']}</span>
            <h2 className="page-section-heading">{cms['home.pillars.heading']}</h2>
            <p className="page-body-text">{cms['home.pillars.lead']}</p>
          </div>
          <div className="grid-cards">
            {pillars.map((goal, idx) => {
              const Icon = cmsIconForKey(goal.iconKey)
              return (
                <article key={goal.title} className="premium-card">
                  <div className="premium-card-image-wrapper">
                    <Image
                      src={images.goals[idx % images.goals.length]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes={cardImageSizes}
                    />
                  </div>
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="premium-card-title">{goal.title}</h3>
                  <p className="premium-card-description">{goal.description}</p>
                  <Link href="/about" className="btn-secondary premium-card-cta">
                    Our approach
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">{cms['home.programs.badge']}</span>
              <h2 className="page-section-heading">{cms['home.programs.heading']}</h2>
              <p className="page-body-text">{cms['home.programs.lead']}</p>
            </div>
            <Link href="/programs" className="btn-outline page-section-cta-link">
              View all programs →
            </Link>
          </div>
          <div className="grid-cards">
            {sankofaPrograms.map((prog, idx) => (
              <article key={prog.title} className="premium-card">
                <div className="premium-card-image-wrapper">
                  <Image
                    src={images.programs[idx % images.programs.length]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <prog.icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">Sankofa</span>
                </div>
                <h3 className="premium-card-title">{prog.title}</h3>
                <p className="premium-card-description">{prog.description}</p>
                <Link href={prog.href} className="btn-primary premium-card-cta">
                  Program details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['home.events.badge']}</span>
            <h2 className="page-section-heading">{cms['home.events.heading']}</h2>
            <p className="page-body-text">{cms['home.events.lead']}</p>
          </div>
          <div className="grid-cards">
            {featuredEvents.map((event) => (
              <article key={event.slug} className="premium-card">
                <div className="premium-card-image-wrapper">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>
                <div className="premium-card-header">
                  <EventTypeIcon type={event.type} />
                  <span className="premium-card-featured-label">{event.type}</span>
                </div>
                <h3 className="premium-card-title">{event.title}</h3>
                <div className="premium-card-meta">
                  <span className="premium-card-date">{event.date}</span>
                  <span className="text-slate-300">·</span>
                  <span className="premium-card-location">{event.location}</span>
                </div>
                <p className="premium-card-description">{event.description}</p>
                <Link href={`/events/${event.slug}`} className="btn-primary premium-card-cta">
                  Event details
                </Link>
              </article>
            ))}
          </div>
          <p className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/events" className="btn-outline">
              View full calendar
            </Link>
          </p>
        </div>
      </section>

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['home.testimonials.badge']}</span>
            <h2 className="page-section-heading">{cms['home.testimonials.heading']}</h2>
            <p className="page-body-text">{cms['home.testimonials.lead']}</p>
          </div>
          <div className="grid-cards">
            {impactStories.map((story) => (
              <div key={story.name} className="testimonial-card">
                <span className="insight-card-tag">{story.tag}</span>
                <div className="testimonial-quote-mark">&ldquo;</div>
                <p className="testimonial-text">{story.quote}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar" aria-hidden>
                    {story.name.charAt(0)}
                  </div>
                  <p className="testimonial-name">{story.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['home.sectors.badge']}</span>
            <h2 className="page-section-heading">{cms['home.sectors.heading']}</h2>
            <p className="page-body-text">{cms['home.sectors.lead']}</p>
          </div>
          <div className="grid-sectors sectors-grid">
            {sectors.map((sector) => {
              const Icon = cmsIconForKey(sector.iconKey)
              return (
                <div key={sector.name} className="sector-card">
                  <FeatureIcon icon={Icon} variant="gold" size={22} />
                  <p className="sector-name">{sector.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">{cms['home.cta.heading']}</h2>
          <p className="page-cta-body">{cms['home.cta.body']}</p>
          <div className="page-cta-buttons">
            <Link href="/programs" className="btn-primary page-cta-btn">
              Explore Programs
            </Link>
            <Link href="/contact#form" className="btn-outline-white page-cta-btn">
              Get in Touch
            </Link>
            <Link href="/support" className="btn-outline-white page-cta-btn">
              Donate Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
