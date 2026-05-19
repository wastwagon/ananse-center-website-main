import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { site } from '../lib/site'

export type HeroStat = { value: string; label: string }

type HeroSplitProps = {
  imageSrc: string
  imageAlt: string
  title: ReactNode
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  stats?: readonly HeroStat[]
  compact?: boolean
  priority?: boolean
}

export default function HeroSplit({
  imageSrc,
  imageAlt,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  compact = false,
  priority = false,
}: HeroSplitProps) {
  return (
    <section
      className={`hero-page${compact ? ' hero-page--compact' : ''}`}
      aria-labelledby="page-hero-heading"
    >
      <div className="hero-page-media">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          quality={90}
          className="hero-page-photo"
          sizes="100vw"
        />
        <div className="hero-page-overlay" aria-hidden />
        <div className="hero-page-vignette" aria-hidden />
      </div>

      <div className="hero-page-shell">
        <div className="hero-page-card">
          <p className="hero-page-eyebrow">
            <span className="hero-page-eyebrow-mark" aria-hidden />
            {site.shortName}
          </p>

          <h1 id="page-hero-heading" className="hero-page-title">
            {title}
          </h1>

          <p className="hero-page-lead">{description}</p>

          <div className="hero-page-actions">
            <Link href={primaryCta.href} className="hero-page-btn hero-page-btn--primary">
              {primaryCta.label}
              <ArrowRight size={17} strokeWidth={2} aria-hidden />
            </Link>
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="hero-page-btn hero-page-btn--ghost">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>

        {stats && stats.length > 0 ? (
          <div className="hero-page-stats">
            {stats.map((s) => (
              <div key={s.label} className="hero-page-stat">
                <span className="hero-page-stat-value">{s.value}</span>
                <span className="hero-page-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
