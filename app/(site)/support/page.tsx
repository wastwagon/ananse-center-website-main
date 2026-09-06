import { Suspense } from 'react'
import Image from 'next/image'
import LocalizedLink from '../../../components/LocalizedLink'
import PageCtaBand from '../../../components/PageCtaBand'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import HeroSplit from '../../../components/HeroSplit'
import { cmsIconForKey } from '../../../lib/cms-icons'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import {
  DEFAULT_SUPPORT_DONATE_PRESETS,
  DEFAULT_SUPPORT_HERO_CTA_PRIMARY,
  DEFAULT_SUPPORT_HERO_CTA_SECONDARY,
  DEFAULT_SUPPORT_HERO_STATS,
  DEFAULT_SUPPORT_HERO_TITLE,
  DEFAULT_SUPPORT_DONATION_TIERS,
  DEFAULT_SUPPORT_OTHER_WAYS,
  DEFAULT_SUPPORT_STANDARDS_ITEMS,
  DEFAULT_SUPPORT_TRANSPARENCY_ALLOCATION,
  getCmsTexts,
  parseCmsJson,
  type CmsDonatePreset,
  type CmsDonationTier,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsLabeledValue,
  type CmsSupportWay,
} from '../../../lib/cms/content'
import FeatureIcon from '../../../components/FeatureIcon'
import DonateSection from '../../../components/DonateSection'
import DonationStatusBanner from '../../../components/DonationStatusBanner'
import { cardImageSizes, images, resolveCmsImage } from '../../../lib/images'
import {
  DEFAULT_SUPPORT_SECTIONS,
  isSectionVisible,
  parseSectionVisibility,
} from '../../../lib/cms/sections'

export async function generateMetadata() {
  return buildCmsMetadata('support', { ogImage: images.hero.support })
}

export default async function SupportPage() {
  const cms = await getCmsTexts([
    'support.hero.lead',
    'support.hero.image',
    'support.hero.imageAlt',
    'support.hero.title',
    'support.hero.stats',
    'support.hero.cta.primary',
    'support.hero.cta.secondary',
    'support.impact.badge',
    'support.impact.heading',
    'support.impact.lead',
    'support.beyond.heading',
    'support.donation.tiers',
    'support.other.ways',
    'support.beyond.lead',
    'support.transparency.heading',
    'support.transparency.body',
    'support.transparency.allocation',
    'support.standards.badge',
    'support.standards.heading',
    'support.standards.lead',
    'support.standards.items',
    'support.donate.heading',
    'support.donate.lead.ready',
    'support.donate.lead.offline',
    'support.donate.presets',
    'support.cta.heading',
    'support.cta.body',
    'support.cta.primary',
    'support.cta.secondary',
    'support.transparency.image',
    'support.sections.visible',
  ] as const)

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['support.hero.title'], DEFAULT_SUPPORT_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['support.hero.stats'], DEFAULT_SUPPORT_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['support.hero.cta.primary'], DEFAULT_SUPPORT_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(
    cms['support.hero.cta.secondary'],
    DEFAULT_SUPPORT_HERO_CTA_SECONDARY,
  )
  const donationTiers = parseCmsJson<CmsDonationTier[]>(
    cms['support.donation.tiers'],
    DEFAULT_SUPPORT_DONATION_TIERS,
  )
  const otherWays = parseCmsJson<CmsSupportWay[]>(cms['support.other.ways'], DEFAULT_SUPPORT_OTHER_WAYS)
  const transparencyAllocation = parseCmsJson<CmsLabeledValue[]>(
    cms['support.transparency.allocation'],
    DEFAULT_SUPPORT_TRANSPARENCY_ALLOCATION,
  )
  const standardsItems = parseCmsJson<string[]>(
    cms['support.standards.items'],
    DEFAULT_SUPPORT_STANDARDS_ITEMS,
  )
  const donatePresets = parseCmsJson<CmsDonatePreset[]>(
    cms['support.donate.presets'],
    DEFAULT_SUPPORT_DONATE_PRESETS,
  )
  const bottomPrimary = parseCmsJson<CmsHeroCta>(cms['support.cta.primary'], {
    label: 'Donate Now',
    href: '/support#donate',
  })
  const bottomSecondary = parseCmsJson<CmsHeroCta>(cms['support.cta.secondary'], {
    label: 'Partner With Us',
    href: '/contact#form',
  })
  const sectionVisibility = parseSectionVisibility(
    cms['support.sections.visible'],
    DEFAULT_SUPPORT_SECTIONS,
  )
  const show = (key: string) => isSectionVisible(sectionVisibility, key)

  return (
    <div className="support-page">
      <HeroSplit
        compact
        imageSrc={resolveCmsImage(cms['support.hero.image'], images.hero.support)}
        imageAlt={cms['support.hero.imageAlt']}
        title={renderSplitHeroTitle(heroTitle)}
        description={cms['support.hero.lead']}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      {show('donation') ? (
      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{cms['support.impact.badge']}</span>
            <h2 className="page-section-heading">{cms['support.impact.heading']}</h2>
            <p className="page-body-text">{cms['support.impact.lead']}</p>
          </div>

          <div className="grid-cards grid-cards--keep-cols">
            {donationTiers.map((stat) => {
              const Icon = cmsIconForKey(stat.iconKey)
              return (
                <div
                  key={stat.amount}
                  className="feature-card text-center flex flex-col items-center justify-center gap-3"
                >
                  {stat.imageUrl ? (
                    <div className="support-tier-image" aria-hidden>
                      <Image src={stat.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <FeatureIcon icon={Icon} size={22} />
                  )}
                  <div className="support-stat-amount">{stat.amount}</div>
                  <p className="page-body-text text-body-md">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      ) : null}

      <Suspense fallback={null}>
        <DonationStatusBanner />
      </Suspense>
      {show('donate') ? (
      <DonateSection
        heading={cms['support.donate.heading']}
        leadReady={cms['support.donate.lead.ready']}
        leadOffline={cms['support.donate.lead.offline']}
        presets={donatePresets}
      />
      ) : null}

      {show('otherWays') ? (
      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{cms['support.beyond.heading']}</h2>
            <p className="page-body-text">{cms['support.beyond.lead']}</p>
          </div>

          <div className="grid-cards">
            {otherWays.map((way, idx) => {
              const Icon = cmsIconForKey(way.iconKey)
              return (
                <div key={way.title} className="insight-card p-0">
                  <div className="premium-card-image-wrapper premium-card-image-wrapper--card-top">
                    <Image
                      src={resolveCmsImage(way.imageUrl, `/images/image (${idx + 12}).jpeg`)}
                      alt={way.title}
                      fill
                      className="object-cover"
                      sizes={cardImageSizes}
                    />
                  </div>
                  <div className="insight-card-bar" />
                  <div className="insight-card-body">
                    <FeatureIcon icon={Icon} size={22} />
                    <h3 className="insight-card-title">{way.title}</h3>
                    <p className="page-body-text text-body-sm" style={{ marginBottom: '1.5rem', flex: 1 }}>
                      {way.description}
                    </p>
                    <LocalizedLink href={way.href || '/contact#form'} className="program-card-link">
                      {way.linkText} →
                    </LocalizedLink>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      ) : null}

      {show('transparency') || show('standards') ? (
      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="two-col-section">
            {show('transparency') ? (
            <div className="insight-card p-0">
              <div className="premium-card-image-wrapper premium-card-image-wrapper--insight-top">
                <Image
                  src={resolveCmsImage(cms['support.transparency.image'], images.hero.support)}
                  alt="Transparency"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="insight-card-bar" />
              <div className="insight-card-body p-20">
                <h2 className="page-section-heading section-heading-sm">
                  {cms['support.transparency.heading']}
                </h2>
                <p className="page-body-text text-body-md mb-section">
                  {cms['support.transparency.body']}
                </p>
                <div className="flex-column flex-column--snug">
                  {transparencyAllocation.map((r) => (
                    <div key={r.label} className="transparency-row">
                      <span className="text-body-sm">{r.label}</span>
                      <span className="text-body-md" style={{ fontWeight: 700 }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : <div />}

            {show('standards') ? (
            <div className="flex flex-col justify-center">
              <span className="section-badge">{cms['support.standards.badge']}</span>
              <h2 className="page-section-heading">{cms['support.standards.heading']}</h2>
              <p className="page-body-text mb-section">
                {cms['support.standards.lead']}
              </p>
              <ul className="flex-column standards-list flex-column--tight">
                {standardsItems.map((li) => (
                  <li key={li} className="standards-list-item">
                    <div className="standards-list-dot" aria-hidden />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      {show('cta') ? (
      <PageCtaBand
        heading={cms['support.cta.heading']}
        body={cms['support.cta.body']}
        primary={{ label: bottomPrimary.label, href: bottomPrimary.href }}
        secondary={{ label: bottomSecondary.label, href: bottomSecondary.href, variant: 'outline-white' }}
      />
      ) : null}
    </div>
  )
}
