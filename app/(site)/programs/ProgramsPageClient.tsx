'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSplit from '../../../components/HeroSplit'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import type { CmsHeroCta, CmsHeroStat, CmsHeroTitle } from '../../../lib/cms/registry'
import FeatureIcon from '../../../components/FeatureIcon'
import { cardImageSizes, images, resolveProgramCoverImage } from '../../../lib/images'
import { programIconForKey } from '../../../lib/program-icons'
import type { ApiProgram } from '../../../lib/api'
export type ProgramBenefit = {
  title: string
  description: string
  iconKey: string
}

export type ProgramTestimonial = {
  name: string
  role: string
  text: string
  initials: string
}

type ProgramsPageClientProps = {
  heroLead: string
  heroTitle: CmsHeroTitle
  heroStats: CmsHeroStat[]
  heroPrimaryCta: CmsHeroCta
  heroSecondaryCta: CmsHeroCta
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
}

export default function ProgramsPageClient({
  heroLead,
  heroTitle,
  heroStats,
  heroPrimaryCta,
  heroSecondaryCta,
  catalogHeading,
  catalogLead,
  benefitsBadge,
  benefitsHeading,
  benefitsCardLabel,
  testimonialsBadge,
  testimonialsHeading,
  cardCtaPrimary,
  cardCtaSecondary,
  ctaPrimary,
  ctaSecondary,
  benefitsLead,
  benefits,
  testimonials,
  ctaHeading,
  ctaBody,
  programs,
}: ProgramsPageClientProps) {
  const categories = useMemo(() => {
    const cats = [...new Set(programs.map((p) => p.category))].sort()
    return ['All Programs', ...cats]
  }, [programs])

  const [activeTab, setActiveTab] = useState('All Programs')

  const filteredPrograms =
    activeTab === 'All Programs' ? programs : programs.filter((p) => p.category === activeTab)

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.programs}
        imageAlt="Ananse Center programs"
        title={renderSplitHeroTitle(heroTitle)}
        description={heroLead}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      <section id="catalog" className="page-section bg-white py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">{catalogHeading}</h2>
            <p className="page-body-text">{catalogLead}</p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`filter-btn ${activeTab === cat ? 'filter-btn-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid-cards">
            {filteredPrograms.map((program) => {
              const Icon = programIconForKey(program.iconKey)
              return (
                <article key={program.id} className="premium-card">
                  <div className="premium-card-image-wrapper">
                    <Image
                      src={resolveProgramCoverImage(program)}
                      alt={program.title}
                      fill
                      className="object-cover"
                      sizes={cardImageSizes}
                    />
                  </div>
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="premium-card-featured-label">{program.category}</span>
                  </div>
                  <h3 className="premium-card-title">{program.title}</h3>
                  {program.duration || program.level ? (
                    <div
                      className="flex justify-between items-center py-4 border-b border-gray-100 mb-6"
                      style={{ width: '100%' }}
                    >
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
                  <p className="premium-card-description">{program.description}</p>
                  {program.features.length > 0 ? (
                    <div className="flex-column" style={{ gap: '0.75rem', marginBottom: '2.5rem', flex: 1 }}>
                      {program.features.map((feature) => (
                        <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: '#f59e0b',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <Link href="/contact#form" className="btn-primary premium-card-cta" style={{ flex: 1 }}>
                      {cardCtaPrimary}
                    </Link>
                    <Link
                      href="/contact#form"
                      className="btn-outline-dark"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        color: '#1A1A1A',
                      }}
                    >
                      {cardCtaSecondary}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-section bg-slate-50 py-16">
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
                <div className="premium-card-image-wrapper" style={{ height: '180px' }}>
                  <Image
                    src={`/images/image (${idx + 7}).jpeg`}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <BenefitIcon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">{benefitsCardLabel}</span>
                </div>
                <h3 className="premium-card-title">{benefit.title}</h3>
                <p className="premium-card-description">{benefit.description}</p>
              </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-section bg-white py-16">
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
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p style={{ fontSize: '11px', color: '#1A1A1A', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta-section">
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
            <Link href={ctaSecondary.href} className="btn-outline-white page-cta-btn">
              {ctaSecondary.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
