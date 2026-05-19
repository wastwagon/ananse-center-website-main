import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
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
}

export default function HeroPremium({ lead, title, stats, primaryCta, secondaryCta }: HeroPremiumProps) {
  return (
    <section className="hero-premium" aria-labelledby="hero-heading">
      <div className="hero-premium-media" aria-hidden>
        <Image
          src={images.hero.home}
          alt="Community gathering at The Ananse Center for Arts and Culture"
          fill
          priority
          quality={92}
          className="hero-premium-photo"
          sizes="100vw"
        />
        <div className="hero-premium-shade" />
        <div className="hero-premium-glow" />
        <div className="hero-premium-grain" />
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
            <Link href={primaryCta.href} className="hero-premium-btn hero-premium-btn--primary">
              {primaryCta.label}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </Link>
            <Link href={secondaryCta.href} className="hero-premium-btn hero-premium-btn--ghost">
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="hero-premium-stats" role="list">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-premium-stat" role="listitem">
              <span className="hero-premium-stat-value">{stat.value}</span>
              <span className="hero-premium-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#our-story" className="hero-premium-scroll">
        <span className="sr-only">Scroll to our story</span>
        <ChevronDown size={22} strokeWidth={1.75} aria-hidden />
      </a>
    </section>
  )
}
