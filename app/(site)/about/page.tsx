import type { Metadata } from 'next'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import PageCtaBand from '../../../components/PageCtaBand'
import HeroSplit from '../../../components/HeroSplit'
import { buildPageMetadata } from '../../../lib/page-meta'
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
  splitParagraphs,
  type CmsApproachStep,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsLabeledValue,
  type CmsPhilosophyCard,
} from '../../../lib/cms/content'
import { cardImageSizes, images } from '../../../lib/images'

export const metadata: Metadata = buildPageMetadata({
  title: 'About',
  description:
    'Our mission, Sankofa philosophy, and approach to Pan-African arts education and leadership development in Ghana.',
  path: '/about',
  ogImage: images.hero.about,
})

export default async function AboutPage() {
  const cms = await getCmsTexts([
    'about.hero.lead',
    'about.hero.title',
    'about.hero.stats',
    'about.hero.cta.primary',
    'about.hero.cta.secondary',
    'about.mission.heading',
    'about.vision.heading',
    'about.mission',
    'about.mission.continuation',
    'about.vision',
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
  ] as const)

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['about.hero.title'], DEFAULT_ABOUT_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['about.hero.stats'], DEFAULT_ABOUT_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['about.hero.cta.primary'], DEFAULT_ABOUT_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(cms['about.hero.cta.secondary'], DEFAULT_ABOUT_HERO_CTA_SECONDARY)
  const aboutCtaPrimary = parseCmsJson<CmsHeroCta>(
    cms['about.cta.primary'],
    { label: 'Get Involved', href: '/contact#form' },
  )
  const aboutCtaSecondary = parseCmsJson<CmsHeroCta>(
    cms['about.cta.secondary'],
    { label: 'Support Our Work', href: '/support' },
  )
  const visionParagraphs = splitParagraphs(cms['about.vision'])
  const philosophies = parseCmsJson<CmsPhilosophyCard[]>(
    cms['about.philosophy'],
    DEFAULT_ABOUT_PHILOSOPHY,
  )
  const approaches = parseCmsJson<CmsApproachStep[]>(cms['about.approach'], DEFAULT_ABOUT_APPROACH)
  const impactMetrics = parseCmsJson<CmsLabeledValue[]>(
    cms['about.impact.metrics'],
    DEFAULT_ABOUT_IMPACT_METRICS,
  )

  return (
    <div className="about-page">
      <HeroSplit
        compact
        imageSrc={images.hero.about}
        imageAlt="Our story at The Ananse Center"
        title={renderSplitHeroTitle(heroTitle)}
        description={cms['about.hero.lead']}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="two-col-section gap-xl">
            <div>
              <h2 className="page-section-heading">{cms['about.mission.heading']}</h2>
              <div className="page-body-stack">
                <p className="page-body-text text-body-lg">
                  {cms['about.mission']}
                </p>
                <p className="page-body-text text-body-lg">
                  {cms['about.mission.continuation']}
                </p>
              </div>
            </div>

            <div>
              <h2 className="page-section-heading">{cms['about.vision.heading']}</h2>
              <div className="page-body-stack">
                {visionParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="page-body-text text-body-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                      src={`/images/image (${idx + 7}).jpeg`}
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

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="two-col-section">
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
          </div>
        </div>
      </section>

      <PageCtaBand
        heading={cms['about.cta.heading']}
        body={cms['about.cta.body']}
        primary={{ label: aboutCtaPrimary.label, href: aboutCtaPrimary.href }}
        secondary={{ label: aboutCtaSecondary.label, href: aboutCtaSecondary.href, variant: 'outline-white' }}
      />
    </div>
  )
}
