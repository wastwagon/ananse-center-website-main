'use client'

import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import LocalizedLink from './LocalizedLink'
import AnimatedHeroStats from './AnimatedHeroStats'
import { site } from '../lib/site'
import { images } from '../lib/images'
import { renderHomeHeroTitle } from '../lib/cms/hero'
import type { CmsHeroCta, CmsHeroStat, CmsHomeHeroTitle } from '../lib/cms/registry'

type HeroPremiumProps = {
  lead: string
  title: CmsHomeHeroTitle
  stats: readonly CmsHeroStat[]
  primaryCta: CmsHeroCta
  secondaryCta: CmsHeroCta
  trustLine?: string
  imageSrc?: string
  imageAlt?: string
}

export default function HeroPremium({
  lead,
  title,
  stats,
  primaryCta,
  secondaryCta,
  trustLine,
  imageSrc = images.hero.home,
  imageAlt = 'Community gathering at The Ananse Center for Arts and Culture',
}: HeroPremiumProps) {
  return (
    <section className="hero-premium" aria-labelledby="hero-heading">
      <div className="hero-premium-media">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          quality={92}
          className="hero-premium-photo"
          sizes="100vw"
        />
        <div className="hero-premium-shade" aria-hidden="true" />
        <div className="hero-premium-glow" aria-hidden="true" />
        <div className="hero-premium-grain" aria-hidden="true" />
      </div>

      <div className="hero-premium-inner">
        <div className="hero-premium-copy">
          <p className="hero-premium-eyebrow">
            <span className="hero-premium-eyebrow-mark" aria-hidden />
            {site.shortName} · {site.location}
          </p>

          <h1 id="hero-heading" className="hero-premium-title">
            {renderHomeHeroTitle(title)}
          </h1>

          <p className="hero-premium-lead">{lead}</p>

          <div className="hero-premium-actions">
            <LocalizedLink href={primaryCta.href} className="hero-premium-btn hero-premium-btn--primary">
              {primaryCta.label}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </LocalizedLink>
            <LocalizedLink href={secondaryCta.href} className="hero-premium-btn hero-premium-btn--ghost">
              {secondaryCta.label}
            </LocalizedLink>
          </div>

          {trustLine ? <p className="hero-premium-trust">{trustLine}</p> : null}
        </div>

        <AnimatedHeroStats stats={stats} />
      </div>

      <a href="#our-story" className="hero-premium-scroll">
        <span className="sr-only">Scroll to our story</span>
        <ChevronDown size={22} strokeWidth={1.75} aria-hidden />
      </a>
    </section>
  )
}
