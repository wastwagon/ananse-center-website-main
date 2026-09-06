import Image from 'next/image'
import LocalizedLink from '../../components/LocalizedLink'
import HeroPremium from '../../components/HeroPremium'
import CmsRichText from '../../components/CmsRichText'
import { buildCmsMetadata } from '../../lib/cms/seo'
import { formatEventDateDisplay } from '../../lib/format'
import GlobalAudienceBand from '../../components/GlobalAudienceBand'
import StudyHealGiveBand from '../../components/StudyHealGiveBand'
import FeatureIcon from '../../components/FeatureIcon'
import EventTypeIcon from '../../components/EventTypeIcon'
import { cmsIconForKey } from '../../lib/cms-icons'
import { cardImageSizes, images, resolveCmsImage } from '../../lib/images'
import { getFeaturedEventsForHome } from '../../lib/featured-events'
import { getSankofaProgramsForHome } from '../../lib/sankofa-programs'
import { DEFAULT_HOME_SECTIONS, isSectionVisible, parseSectionVisibility } from '../../lib/cms/sections'
import {
  DEFAULT_HOME_PILLARS,
  DEFAULT_HOME_SECTORS,
  DEFAULT_HOME_HERO_CTA_PRIMARY,
  DEFAULT_HOME_HERO_CTA_SECONDARY,
  DEFAULT_HOME_HERO_STATS,
  DEFAULT_HOME_CTA_BUTTONS,
  DEFAULT_HOME_HERO_TITLE,
  DEFAULT_HOME_STORY_HIGHLIGHTS,
  DEFAULT_HOME_TESTIMONIALS,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHomeHeroTitle,
  type CmsPillar,
  type CmsSector,
  type CmsStoryHighlight,
  type CmsTestimonial,
} from '../../lib/cms/content'

export async function generateMetadata() {
  return buildCmsMetadata('home', { ogImage: images.hero.home })
}

export default async function Home() {
  const [cms, featuredEvents, sankofaPrograms] = await Promise.all([
    getCmsTexts([
      'home.hero.lead',
      'home.hero.trust',
      'home.hero.image',
      'home.hero.imageAlt',
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
      'home.cta.buttons',
      'home.story.cta',
      'home.pillars.cardCta',
      'home.programs.link',
      'home.programs.cardLabel',
      'home.programs.cardCta',
      'home.events.cardCta',
      'home.events.calendarLink',
      'home.sections.visible',
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
  const homeCtaButtons = parseCmsJson<CmsHeroCta[]>(cms['home.cta.buttons'], DEFAULT_HOME_CTA_BUTTONS)
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
  const sectionVisibility = parseSectionVisibility(cms['home.sections.visible'], DEFAULT_HOME_SECTIONS)
  const showSection = (key: string) => isSectionVisible(sectionVisibility, key)

  return (
    <div>
      <HeroPremium
        lead={cms['home.hero.lead']}
        trustLine={cms['home.hero.trust']}
        imageSrc={resolveCmsImage(cms['home.hero.image'], images.hero.home)}
        imageAlt={cms['home.hero.imageAlt']}
        title={homeHeroTitle}
        stats={homeHeroStats}
        primaryCta={homeHeroPrimaryCta}
        secondaryCta={homeHeroSecondaryCta}
      />

      {showSection('globalBand') ? <GlobalAudienceBand /> : null}

      {showSection('journey') ? <StudyHealGiveBand /> : null}

      {showSection('story') ? (
        <section id="our-story" className="page-section bg-white section-reveal">
          <div className="page-section-container">
            <div className="two-col-section">
              <div>
                <span className="section-badge">{cms['home.story.badge']}</span>
                <h2 className="page-section-heading">{cms['home.story.heading']}</h2>
                <CmsRichText body={cms['home.story']} className="cms-richtext" />
                <LocalizedLink href="/about" className="btn-primary page-inline-cta">
                  {cms['home.story.cta']}
                </LocalizedLink>
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
      ) : null}

      {showSection('pillars') ? (
        <section className="page-section page-section--muted section-reveal">
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
                        src={resolveCmsImage(goal.imageUrl, images.goals[idx % images.goals.length])}
                        alt={`${goal.title} — Ananse Center program pillar`}
                        fill
                        loading="lazy"
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
                    <LocalizedLink href="/about" className="btn-secondary premium-card-cta">
                      {cms['home.pillars.cardCta']}
                    </LocalizedLink>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('programs') ? (
        <section className="page-section bg-white section-reveal">
          <div className="page-section-container">
            <div className="section-header-split">
              <div>
                <span className="section-badge">{cms['home.programs.badge']}</span>
                <h2 className="page-section-heading">{cms['home.programs.heading']}</h2>
                <p className="page-body-text">{cms['home.programs.lead']}</p>
              </div>
              <LocalizedLink href="/programs" className="btn-outline page-section-cta-link">
                {cms['home.programs.link']}
              </LocalizedLink>
            </div>
            <div className="grid-cards">
              {sankofaPrograms.map((prog, idx) => (
                <article key={prog.title} className="premium-card">
                  <div className="premium-card-image-wrapper">
                    <Image
                      src={images.programs[idx % images.programs.length]}
                      alt={`${prog.title} — Sankofa program at Ananse Center`}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes={cardImageSizes}
                    />
                  </div>
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <prog.icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="premium-card-featured-label">{cms['home.programs.cardLabel']}</span>
                  </div>
                  <h3 className="premium-card-title">{prog.title}</h3>
                  <p className="premium-card-description">{prog.description}</p>
                  <LocalizedLink href={prog.href} className="btn-primary premium-card-cta">
                    {cms['home.programs.cardCta']}
                  </LocalizedLink>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('events') ? (
        <section className="page-section page-section--muted section-reveal">
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
                    <span className="premium-card-date">{formatEventDateDisplay(event.date)}</span>
                    <span className="text-slate-300">·</span>
                    <span className="premium-card-location">{event.location}</span>
                  </div>
                  <p className="premium-card-description">{event.description}</p>
                  <LocalizedLink href={`/events/${event.slug}`} className="btn-primary premium-card-cta">
                    {cms['home.events.cardCta']}
                  </LocalizedLink>
                </article>
              ))}
            </div>
            <p className="text-center mt-section">
              <LocalizedLink href="/events" className="btn-outline">
                {cms['home.events.calendarLink']}
              </LocalizedLink>
            </p>
          </div>
        </section>
      ) : null}

      {showSection('testimonials') ? (
        <section className="page-section bg-white section-reveal">
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
                    {story.photoUrl ? (
                      <div className="testimonial-avatar testimonial-avatar--photo" aria-hidden>
                        <Image
                          src={story.photoUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="testimonial-avatar" aria-hidden>
                        {story.name.charAt(0)}
                      </div>
                    )}
                    <p className="testimonial-name">{story.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('sectors') ? (
        <section className="page-section page-section--muted section-reveal">
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
      ) : null}

      {showSection('cta') ? (
        <section className="page-cta-section section-reveal">
          <div className="page-section-container page-cta-inner">
            <h2 className="page-cta-heading">{cms['home.cta.heading']}</h2>
            <p className="page-cta-body">{cms['home.cta.body']}</p>
            <div className="page-cta-buttons">
              {homeCtaButtons.map((btn, index) => (
                <LocalizedLink
                  key={btn.label}
                  href={btn.href}
                  className={index === 0 ? 'btn-primary page-cta-btn' : 'btn-outline-white page-cta-btn'}
                >
                  {btn.label}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
