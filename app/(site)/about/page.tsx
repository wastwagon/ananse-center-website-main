import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import PageCtaBand from '../../../components/PageCtaBand'
import HeroSplit from '../../../components/HeroSplit'
import CmsRichText from '../../../components/CmsRichText'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { cmsIconForKey } from '../../../lib/cms-icons'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import {
  DEFAULT_ABOUT_APPROACH,
  DEFAULT_ABOUT_HERO_CTA_PRIMARY,
  DEFAULT_ABOUT_HERO_CTA_SECONDARY,
  DEFAULT_ABOUT_HERO_STATS,
  DEFAULT_ABOUT_HERO_TITLE,
  DEFAULT_ABOUT_IMPACT_METRICS,
  DEFAULT_ABOUT_PHILOSOPHY,
  getCmsTexts,
  parseCmsJson,
  type CmsApproachStep,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsLabeledValue,
  type CmsPhilosophyCard,
} from '../../../lib/cms/content'
import { cardImageSizes, images, resolveCmsImage } from '../../../lib/images'
import { DEFAULT_ABOUT_SECTIONS, isSectionVisible, parseSectionVisibility } from '../../../lib/cms/sections'

type AboutTimelineItem = { year: string; title: string; description: string }
type AboutTeamMember = {
  name: string
  role: string
  bio: string
  initials?: string
  photoUrl?: string
}

export async function generateMetadata() {
  return buildCmsMetadata('about', { ogImage: images.hero.about })
}

export default async function AboutPage() {
  const cms = await getCmsTexts([
    'about.hero.lead',
    'about.hero.image',
    'about.hero.imageAlt',
    'about.hero.title',
    'about.hero.stats',
    'about.hero.cta.primary',
    'about.hero.cta.secondary',
    'about.whoWeAre.badge',
    'about.whoWeAre.heading',
    'about.whoWeAre.body',
    'about.whoWeAre.focusHeading',
    'about.whoWeAre.focusAreas',
    'about.whoWeAre.teamCta',
    'about.story.image',
    'about.mission.heading',
    'about.vision.heading',
    'about.mission',
    'about.mission.continuation',
    'about.vision',
    'about.timeline.badge',
    'about.timeline.heading',
    'about.timeline.lead',
    'about.timeline',
    'about.team.badge',
    'about.team.heading',
    'about.team.lead',
    'about.team',
    'about.philosophy.badge',
    'about.philosophy.heading',
    'about.philosophy.cardLabel',
    'about.philosophy.cardCta',
    'about.philosophy.lead',
    'about.philosophy',
    'about.approach.badge',
    'about.approach.heading',
    'about.approach.lead',
    'about.approach',
    'about.impact.cardBadge',
    'about.impact.cardHeading',
    'about.impact.cardCta',
    'about.impact.metrics',
    'about.cta.heading',
    'about.cta.body',
    'about.cta.primary',
    'about.cta.secondary',
    'about.sections.visible',
  ] as const)

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['about.hero.title'], DEFAULT_ABOUT_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['about.hero.stats'], DEFAULT_ABOUT_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['about.hero.cta.primary'], DEFAULT_ABOUT_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(cms['about.hero.cta.secondary'], DEFAULT_ABOUT_HERO_CTA_SECONDARY)
  const aboutCtaPrimary = parseCmsJson<CmsHeroCta>(
    cms['about.cta.primary'],
    { label: 'Donate', href: '/support#donate' },
  )
  const aboutCtaSecondary = parseCmsJson<CmsHeroCta>(
    cms['about.cta.secondary'],
    { label: 'Explore Programs', href: '/programs' },
  )
  const teamCta = parseCmsJson<CmsHeroCta>(
    cms['about.whoWeAre.teamCta'],
    { label: 'Meet Our Trustees', href: '/trustees' },
  )
  const focusAreas = parseCmsJson<string[]>(
    cms['about.whoWeAre.focusAreas'],
    ['Education', 'Culture', 'Leadership', 'Community Development'],
  )
  const philosophies = parseCmsJson<CmsPhilosophyCard[]>(
    cms['about.philosophy'],
    DEFAULT_ABOUT_PHILOSOPHY,
  )
  const approaches = parseCmsJson<CmsApproachStep[]>(cms['about.approach'], DEFAULT_ABOUT_APPROACH)
  const impactMetrics = parseCmsJson<CmsLabeledValue[]>(
    cms['about.impact.metrics'],
    DEFAULT_ABOUT_IMPACT_METRICS,
  )
  const timeline = parseCmsJson<AboutTimelineItem[]>(cms['about.timeline'], [])
  const team = parseCmsJson<AboutTeamMember[]>(cms['about.team'], [])
  const sectionVisibility = parseSectionVisibility(cms['about.sections.visible'], DEFAULT_ABOUT_SECTIONS)
  const showSection = (key: string) => isSectionVisible(sectionVisibility, key)

  return (
    <div className="about-page">
      <HeroSplit
        compact
        imageSrc={resolveCmsImage(cms['about.hero.image'], images.hero.about)}
        imageAlt={cms['about.hero.imageAlt']}
        title={renderSplitHeroTitle(heroTitle)}
        description={cms['about.hero.lead']}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      {showSection('whoWeAre') ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="two-col-section gap-xl">
              <div>
                <span className="section-badge">{cms['about.whoWeAre.badge']}</span>
                <h2 className="page-section-heading">{cms['about.whoWeAre.heading']}</h2>
                <CmsRichText body={cms['about.whoWeAre.body']} className="cms-richtext cms-richtext--lg" />
                <p className="page-body-text" style={{ marginTop: '1.5rem', fontWeight: 600 }}>
                  {cms['about.whoWeAre.focusHeading']}
                </p>
                <ul className="about-focus-list">
                  {focusAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
                <LocalizedLink href={teamCta.href} className="btn-primary" style={{ marginTop: '1.75rem' }}>
                  {teamCta.label}
                </LocalizedLink>
              </div>

              <div className="premium-card-image-wrapper" style={{ height: 'min(420px, 70vw)', marginBottom: 0 }}>
                <Image
                  src={resolveCmsImage(cms['about.story.image'], images.story)}
                  alt="Ananse Center community gathering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 899px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showSection('missionVision') ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="two-col-section gap-xl">
              <div>
                <h2 className="page-section-heading">{cms['about.mission.heading']}</h2>
                <CmsRichText body={cms['about.mission']} className="cms-richtext cms-richtext--lg" />
                <div style={{ marginTop: '1rem' }}>
                  <CmsRichText
                    body={cms['about.mission.continuation']}
                    className="cms-richtext cms-richtext--lg"
                  />
                </div>
              </div>

              <div>
                <h2 className="page-section-heading">{cms['about.vision.heading']}</h2>
                <CmsRichText body={cms['about.vision']} className="cms-richtext cms-richtext--lg" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showSection('timeline') && timeline.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="page-section-center-header">
              <span className="section-badge">{cms['about.timeline.badge']}</span>
              <h2 className="page-section-heading">{cms['about.timeline.heading']}</h2>
              <p className="page-body-text">{cms['about.timeline.lead']}</p>
            </div>
            <ol className="about-timeline">
              {timeline.map((item) => (
                <li key={`${item.year}-${item.title}`} className="about-timeline-item">
                  <span className="about-timeline-year">{item.year}</span>
                  <div>
                    <h3 className="about-timeline-title">{item.title}</h3>
                    <p className="page-body-text text-body-md">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {showSection('team') && team.length > 0 ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="page-section-center-header">
              <span className="section-badge">{cms['about.team.badge']}</span>
              <h2 className="page-section-heading">{cms['about.team.heading']}</h2>
              <p className="page-body-text">{cms['about.team.lead']}</p>
            </div>
            <div className="grid-cards">
              {team.map((member) => (
                <article key={member.name} className="premium-card">
                  {member.photoUrl ? (
                    <div
                      className="premium-card-image-wrapper premium-card-image-wrapper--short"
                      style={{ borderRadius: '50%', width: 88, height: 88, marginBottom: '1rem' }}
                    >
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="88px"
                      />
                    </div>
                  ) : (
                    <div className="testimonial-avatar" style={{ width: 48, height: 48, fontSize: 14 }}>
                      {member.initials || member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 className="premium-card-title">{member.name}</h3>
                  <span className="premium-card-featured-label">{member.role}</span>
                  <p className="premium-card-description">{member.bio}</p>
                </article>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <LocalizedLink href={teamCta.href} className="btn-outline-dark">
                {teamCta.label}
              </LocalizedLink>
            </div>
          </div>
        </section>
      ) : null}

      {showSection('philosophy') ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="page-section-center-header">
              <span className="section-badge">{cms['about.philosophy.badge']}</span>
              <h2 className="page-section-heading">{cms['about.philosophy.heading']}</h2>
              <p className="page-body-text">{cms['about.philosophy.lead']}</p>
            </div>

            <div className="grid-cards">
              {philosophies.map((item, idx) => {
                const Icon = cmsIconForKey(item.iconKey)
                return (
                  <article key={item.title} className="premium-card">
                    <div className="premium-card-image-wrapper premium-card-image-wrapper--short">
                      <Image
                        src={resolveCmsImage(item.imageUrl, `/images/image (${idx + 7}).jpeg`)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes={cardImageSizes}
                      />
                    </div>
                    <div className="premium-card-header">
                      <div className="premium-card-icon-box">
                        <Icon size={22} strokeWidth={1.75} />
                      </div>
                      <span className="premium-card-featured-label">{cms['about.philosophy.cardLabel']}</span>
                    </div>
                    <h3 className="premium-card-title">{item.title}</h3>
                    <p className="premium-card-description">{item.description}</p>
                    <LocalizedLink href="/programs" className="btn-primary premium-card-cta">
                      {cms['about.philosophy.cardCta']}
                    </LocalizedLink>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('approach') || showSection('impact') ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="two-col-section">
              {showSection('approach') ? (
                <div className="max-w-md">
                  <span className="section-badge">{cms['about.approach.badge']}</span>
                  <h2 className="page-section-heading">{cms['about.approach.heading']}</h2>
                  <p className="page-body-text mb-section">
                    {cms['about.approach.lead']}
                  </p>

                  <div className="flex-column gap-medium">
                    {approaches.map((step) => (
                      <div key={step.title} className="approach-step">
                        <div
                          className="approach-step-num"
                          style={{ backgroundColor: step.backgroundColor, color: step.textColor }}
                        >
                          {step.num}
                        </div>
                        <div>
                          <h4 className="approach-step-title">{step.title}</h4>
                          <p className="page-body-text text-body-md">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {showSection('impact') ? (
                <article className="premium-card">
                  <div className="premium-card-header">
                    <span className="premium-card-featured-label">{cms['about.impact.cardBadge']}</span>
                  </div>

                  <h3 className="premium-card-title premium-card-title--lg">
                    {cms['about.impact.cardHeading']}
                  </h3>

                  <div className="flex-column flex-column--snug" style={{ marginTop: '1rem' }}>
                    {impactMetrics.map((row) => (
                      <div key={row.label} className="impact-metric-row">
                        <span className="text-body-md">{row.label}</span>
                        <span className="text-body-lg" style={{ fontWeight: 700 }}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <LocalizedLink href="/support" className="btn-primary premium-card-cta card-cta-spaced">
                    {cms['about.impact.cardCta']}
                  </LocalizedLink>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {showSection('cta') ? (
        <PageCtaBand
          heading={cms['about.cta.heading']}
          body={cms['about.cta.body']}
          primary={{ label: aboutCtaPrimary.label, href: aboutCtaPrimary.href }}
          secondary={{ label: aboutCtaSecondary.label, href: aboutCtaSecondary.href, variant: 'outline-white' }}
        />
      ) : null}
    </div>
  )
}
