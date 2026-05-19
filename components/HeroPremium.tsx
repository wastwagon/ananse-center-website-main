import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { site, heroStatsDefault } from '../lib/site'
import { images } from '../lib/images'

type HeroPremiumProps = {
  lead?: string
}

export default function HeroPremium({ lead }: HeroPremiumProps) {
  const defaultLead =
    'Preserving heritage, restoring identity, and developing the next generation of Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.'
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
            Weaving wisdom into
            <span className="hero-premium-title-accent"> Africa&apos;s future</span>
          </h1>

          <p className="hero-premium-lead">{lead?.trim() || defaultLead}</p>

          <div className="hero-premium-actions">
            <Link href="/programs" className="hero-premium-btn hero-premium-btn--primary">
              Explore programs
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </Link>
            <Link href="/support" className="hero-premium-btn hero-premium-btn--ghost">
              Support our mission
            </Link>
          </div>
        </div>

        <div className="hero-premium-stats" role="list">
          {heroStatsDefault.map((stat) => (
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
