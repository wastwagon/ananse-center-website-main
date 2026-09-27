'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import HeroSplit from '../../../components/HeroSplit'
import LocalizedLink from '../../../components/LocalizedLink'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import type { CmsHeroCta, CmsHeroStat, CmsHeroTitle } from '../../../lib/cms/registry'
import FeatureIcon from '../../../components/FeatureIcon'
import CardCover from '../../../components/CardCover'
import PremiumFilterBar from '../../../components/PremiumFilterBar'
import { resolveCmsImage, resolveProgramCoverImage } from '../../../lib/images'
import { programIconForKey } from '../../../lib/program-icons'
import type { ApiProgram } from '../../../lib/api'
import { programNarrative, programSummary } from '../../../lib/leadership/programs'
export type ProgramBenefit = {
  title: string
  description: string
  iconKey: string
  category?: string
  imageUrl?: string
}

export type ProgramTestimonial = {
  name: string
  role: string
  text: string
  initials: string
  photoUrl?: string
}

type ProgramsPageClientProps = {
  heroLead: string
  heroTitle: CmsHeroTitle
  heroStats: CmsHeroStat[]
  heroPrimaryCta: CmsHeroCta
  heroSecondaryCta: CmsHeroCta
  heroImageSrc: string
  heroImageAlt: string
  catalogHeading: string
  catalogLead: string
  benefitsBadge: string
  benefitsHeading: string
  benefitsCardLabel: string
  testimonialsBadge: string
  testimonialsHeading: string
  cardCtaPrimary: string
  cardCtaSecondary: string
  ctaPrimary: CmsHeroCta
  ctaSecondary: CmsHeroCta
  benefitsLead: string
  benefits: ProgramBenefit[]
  testimonials: ProgramTestimonial[]
  ctaHeading: string
  ctaBody: string
  programs: ApiProgram[]
  sectionVisibility?: Record<string, boolean>
}

export default function ProgramsPageClient({
  heroLead,
  heroTitle,
  heroStats,
  heroPrimaryCta,
  heroSecondaryCta,
  heroImageSrc,
  heroImageAlt,
  catalogHeading,
  catalogLead,
  benefitsBadge,
  benefitsHeading,
  benefitsCardLabel,
  testimonialsBadge,
  testimonialsHeading,
  cardCtaPrimary: _cardCtaPrimary,
  cardCtaSecondary,
  ctaPrimary,
  ctaSecondary,
  benefitsLead,
  benefits,
  testimonials,
  ctaHeading,
  ctaBody,
  programs,
  sectionVisibility = {},
}: ProgramsPageClientProps) {
  const categories = useMemo(() => {
    const cats = [...new Set(programs.map((p) => p.category).filter(Boolean))].sort()
    if (cats.length <= 1) return [] as string[]
    return ['All Programs', ...cats]
  }, [programs])

  const [activeTab, setActiveTab] = useState('All Programs')
  const show = (key: string) => sectionVisibility[key] !== false

  const filteredPrograms =
    categories.length === 0 || activeTab === 'All Programs'
      ? programs
      : programs.filter((p) => p.category === activeTab)

  return (
    <div className="programs-page">
      <HeroSplit
        compact
        imageSrc={heroImageSrc}
        imageAlt={heroImageAlt}
        title={renderSplitHeroTitle(heroTitle)}
        description={heroLead}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      {show('catalog') ? (
      <section id="catalog" className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{catalogHeading}</h2>
            <p className="page-body-text">{catalogLead}</p>
          </div>

          {categories.length > 0 ? (
            <PremiumFilterBar
              groups={[
                {
                  label: 'Category',
                  ariaLabel: 'Program category filter',
                  value: activeTab,
                  variant: 'tabs',
                  onChange: setActiveTab,
                  options: categories.map((cat) => ({
                    value: cat,
                    label: cat,
                  })),
                },
              ]}
            />
          ) : null}

          <div className="grid-cards">
            {filteredPrograms.map((program) => {
              const Icon = programIconForKey(program.iconKey)
              return (
                <article key={program.id} className="premium-card">
                  <div className="premium-card-image-wrapper">
                    <CardCover src={resolveProgramCoverImage(program)} alt={program.title} />
                  </div>
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    {program.category ? (
                      <span className="premium-card-featured-label">{program.category}</span>
                    ) : null}
                  </div>
                  <h3 className="premium-card-title">{program.title}</h3>
                  {program.duration || program.level ? (
                    <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6 w-full">
                      {program.duration ? (
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-400 uppercase letter-spacing-wide">
                            Duration
                          </span>
                          <span className="text-[13px] font-semibold text-gray-700">{program.duration}</span>
                        </div>
                      ) : null}
                      {program.level ? (
                        <div className="flex flex-col text-right">
                          <span className="text-[11px] font-bold text-gray-400 uppercase letter-spacing-wide">
                            Level
                          </span>
                          <span className="text-[13px] font-semibold text-gray-700">{program.level}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <p className="premium-card-description">
                    {programNarrative(program.description).tagline || programSummary(program.description)}
                  </p>
                  <LocalizedLink
                    href={`/programs/${program.slug}`}
                    className="btn-primary premium-card-cta"
                  >
                    {cardCtaSecondary || `Explore ${program.title}`}
                  </LocalizedLink>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      ) : null}

      {show('benefits') ? (
      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{benefitsBadge}</span>
            <h2 className="page-section-heading">{benefitsHeading}</h2>
            <p className="page-body-text">{benefitsLead}</p>
          </div>
          <div className="grid-cards">
            {benefits.map((benefit, idx) => {
              const BenefitIcon = programIconForKey(benefit.iconKey)
              return (
              <article key={benefit.title} className="premium-card">
                <div className="premium-card-image-wrapper premium-card-image-wrapper--short">
                  <CardCover
                    src={resolveCmsImage(benefit.imageUrl, `/images/image (${idx + 7}).jpeg`)}
                    alt={benefit.title}
                  />
                </div>
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <BenefitIcon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">
                    {benefit.category || benefitsCardLabel}
                  </span>
                </div>
                <h3 className="premium-card-title">{benefit.title}</h3>
                <p className="premium-card-description">{benefit.description}</p>
              </article>
              )
            })}
          </div>
        </div>
      </section>
      ) : null}

      {show('testimonials') ? (
      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">{testimonialsBadge}</span>
            <h2 className="page-section-heading">{testimonialsHeading}</h2>
          </div>
          <div className="grid-cards">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-quote-mark">“</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-footer">
                  {t.photoUrl ? (
                    <div className="testimonial-avatar testimonial-avatar--photo" aria-hidden>
                      <Image src={t.photoUrl} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="testimonial-avatar">{t.initials}</div>
                  )}
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {show('cta') ? (
      <section className="page-cta-section section-reveal">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">{ctaHeading}</h2>
          <p className="page-cta-body">{ctaBody}</p>
          <div className="page-cta-buttons">
            <button
              type="button"
              className="btn-primary page-cta-btn"
              onClick={() => {
                setActiveTab('All Programs')
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {ctaPrimary.label}
            </button>
            <LocalizedLink href={ctaSecondary.href} className="btn-outline-white page-cta-btn">
              {ctaSecondary.label}
            </LocalizedLink>
          </div>
        </div>
      </section>
      ) : null}
    </div>
  )
}
