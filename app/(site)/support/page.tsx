'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSplit from '../../../components/HeroSplit'
import FeatureIcon from '../../../components/FeatureIcon'
import DonateSection from '../../../components/DonateSection'
import DonationStatusBanner from '../../../components/DonationStatusBanner'
import { images } from '../../../lib/images'
import type { LucideIcon } from 'lucide-react'
import { Palette, Users, GraduationCap, Package, HandHeart, Building2, Scroll } from 'lucide-react'

const impactStats: { number: string; label: string; icon: LucideIcon }[] = [
  {
    number: 'GH₵50',
    label: 'Provides art supplies for one student for a semester',
    icon: Palette,
  },
  {
    number: 'GH₵100',
    label: 'Funds a community workshop for 20 participants',
    icon: Users,
  },
  {
    number: 'GH₵250',
    label: "Supports a master artisan's teaching for one month",
    icon: GraduationCap,
  },
  {
    number: 'GH₵500',
    label: 'Covers program materials for an entire class',
    icon: Package,
  },
]

const otherWays: { title: string; description: string; icon: LucideIcon; linkText: string }[] = [
  {
    title: 'Volunteer',
    description:
      "Share your skills and time with our programs. Whether you're an artist, educator, or organizer, we'd love to have you on our team.",
    icon: HandHeart,
    linkText: 'Join Our Team',
  },
  {
    title: 'Corporate Partnerships',
    description:
      'Partner with us to support cultural preservation and community development through corporate social responsibility initiatives.',
    icon: Building2,
    linkText: 'Partner With Us',
  },
  {
    title: 'Legacy Giving',
    description:
      'Include The Ananse Center in your estate planning to create a lasting impact on cultural preservation for generations to come.',
    icon: Scroll,
    linkText: 'Plan Your Legacy',
  },
]

export default function SupportPage() {
  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.support}
        imageAlt="Support The Ananse Center"
        title={
          <>
            Support Our <span className="text-accent">Mission</span>
          </>
        }
        description="Your gift preserves African heritage and funds arts education, mentorship, and community programs across Ghana and the diaspora."
        primaryCta={{ label: 'Donate Now', href: '/support#donate' }}
        secondaryCta={{ label: 'Partner With Us', href: '/contact#form' }}
        stats={[
          { value: '100%', label: 'Program Focus' },
          { value: 'GH₵10K+', label: 'Monthly Reach' },
          { value: '25+', label: 'Artisans Supported' },
          { value: 'You', label: 'Make It Possible' },
        ]}
      />

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Where Your Gift Goes</span>
            <h2 className="page-section-heading">Your Impact</h2>
            <p className="page-body-text">
              Every contribution, no matter the size, helps us create meaningful change in the lives of
              students, artists, and communities across the continent.
            </p>
          </div>

          <div className="grid-1col grid-md-2col grid-lg-4col">
            {impactStats.map((stat) => (
              <div
                key={stat.number}
                className="feature-card text-center flex flex-col items-center justify-center gap-3"
              >
                <FeatureIcon icon={stat.icon} size={22} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>{stat.number}</div>
                <p className="page-body-text" style={{ fontSize: '14px', color: '#1A1A1A', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <DonationStatusBanner />
      </Suspense>
      <DonateSection />

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">Beyond Financial Support</h2>
            <p className="page-body-text">
              There are many ways to contribute to our mission beyond financial donations. We value every form
              of support.
            </p>
          </div>

          <div className="grid-1col grid-md-3col">
            {otherWays.map((way, idx) => (
              <div key={way.title} className="insight-card p-0">
                <div
                  className="premium-card-image-wrapper"
                  style={{ height: '160px', marginBottom: 0, borderRadius: '12px 12px 0 0' }}
                >
                  <Image
                    src={`/images/image (${idx + 12}).jpeg`}
                    alt={way.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="insight-card-bar" />
                <div className="insight-card-body">
                  <FeatureIcon icon={way.icon} size={22} />
                  <h3 className="insight-card-title">{way.title}</h3>
                  <p className="page-body-text" style={{ fontSize: '13px', marginBottom: '1.5rem', flex: 1 }}>
                    {way.description}
                  </p>
                  <Link href="/contact#form" className="program-card-link">
                    {way.linkText} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-slate-50">
        <div className="page-section-container">
          <div className="two-col-section">
            <div className="insight-card p-0">
              <div
                className="premium-card-image-wrapper"
                style={{ height: '180px', marginBottom: 0, borderRadius: '12px 12px 0 0' }}
              >
                <Image src="/images/image (15).jpeg" alt="Transparency" fill className="object-cover" />
              </div>
              <div className="insight-card-bar" />
              <div className="insight-card-body p-20">
                <h2 className="page-section-heading" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                  Transparency Matters
                </h2>
                <p className="page-body-text" style={{ fontSize: '14px', marginBottom: '2rem' }}>
                  We are committed to being open and accountable about how your donations are used to fuel our
                  cultural programs.
                </p>
                <div className="flex-column" style={{ gap: '1rem' }}>
                  {[
                    { lab: 'Programs & Services', val: '75%' },
                    { lab: 'Community Outreach', val: '15%' },
                    { lab: 'Operations', val: '10%' },
                  ].map((r) => (
                    <div
                      key={r.lab}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#1A1A1A' }}>{r.lab}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="section-badge">Trust & Accountability</span>
              <h2 className="page-section-heading">Our Standards</h2>
              <p className="page-body-text" style={{ marginBottom: '2rem' }}>
                We maintain high standards of financial reporting and ethical stewardship to ensure your support
                creates the maximum impact.
              </p>
              <ul className="flex-column" style={{ gap: '0.75rem', padding: 0 }}>
                {[
                  'Registered cultural NGO operating in Ghana',
                  'Annual financial reporting to partners and donors',
                  'Transparent reporting on program outcomes',
                  'Board of directors with diverse representation',
                ].map((li) => (
                  <li
                    key={li}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1A1A1A' }}
                  >
                    <div
                      style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }}
                    />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">Join the Legacy</h2>
          <p className="page-cta-body">
            Your support doesn&apos;t just fund programs—it preserves cultural heritage and creates a future where
            African culture continues to thrive and inspire.
          </p>
          <div className="page-cta-buttons">
            <Link href="/support#donate" className="btn-primary page-cta-btn">
              Make a Donation
            </Link>
            <Link href="/contact#form" className="btn-outline-white page-cta-btn">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
