'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import HeroSplit from '../../../components/HeroSplit'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import type { CmsHeroCta, CmsHeroStat, CmsHeroTitle } from '../../../lib/cms/registry'
import FeatureIcon from '../../../components/FeatureIcon'
import { submitContactMessage } from '../../../lib/api'
import { images } from '../../../lib/images'
import type { PublicSiteProfile } from '../../../lib/site-profile'
import type { LucideIcon } from 'lucide-react'

type ContactPageClientProps = {
  heroLead: string
  heroTitle: CmsHeroTitle
  heroStats: CmsHeroStat[]
  heroPrimaryCta: CmsHeroCta
  heroSecondaryCta: CmsHeroCta
  visitBlurb: string
  ctaBody: string
  profile: PublicSiteProfile
}

export default function ContactPageClient({
  heroLead,
  heroTitle,
  heroStats,
  heroPrimaryCta,
  heroSecondaryCta,
  visitBlurb,
  ctaBody,
  profile,
}: ContactPageClientProps) {
  const { contact, social } = profile

  const contactInfo: { title: string; desc: string; icon: LucideIcon }[] = [
    { title: 'Our Location', desc: contact.address, icon: MapPin },
    {
      title: 'Email Us',
      desc: `${contact.email}\n${contact.programsEmail}`,
      icon: Mail,
    },
    { title: 'Call Us', desc: contact.phone, icon: Phone },
    { title: 'Office Hours', desc: contact.hours, icon: Clock },
  ]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Inquiry')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setFeedback('')

    try {
      const result = await submitContactMessage({ name, email, subject, message })
      setStatus('success')
      setFeedback(result.message)
      setName('')
      setEmail('')
      setSubject('General Inquiry')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to send message')
    }
  }

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.contact}
        imageAlt="Connect with The Ananse Center"
        title={renderSplitHeroTitle(heroTitle)}
        description={heroLead}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="grid-cards">
            {contactInfo.map((item) => (
              <div key={item.title} className="feature-card text-center">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <FeatureIcon icon={item.icon} variant="gold" />
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="page-body-text" style={{ fontSize: '13px', whiteSpace: 'pre-line' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="form" className="page-section bg-slate-50">
        <div className="page-section-container">
          <div className="two-col-section">
            <div className="insight-card p-0">
              <div className="insight-card-bar" />
              <div className="insight-card-body p-20">
                <h2 className="page-section-heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="contact-form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-input form-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option>General Inquiry</option>
                      <option>Programs & Classes</option>
                      <option>Partnerships</option>
                      <option>Volunteering</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Tell us how we can help..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                    style={{ padding: '14px', justifyContent: 'center' }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {feedback ? (
                    <p className="page-body-text" style={{ marginTop: '1rem', fontSize: '14px' }}>
                      {feedback}
                    </p>
                  ) : null}
                </form>
              </div>
            </div>

            <div className="flex-column" style={{ gap: '2rem' }}>
              <div
                className="about-visual-card p-0"
                style={{
                  height: '350px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '4rem', marginBottom: '1rem', display: 'block' }}>🗺️</span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                    Find Us In Accra
                  </h4>
                  <p style={{ fontSize: '13px', color: '#1A1A1A' }}>Interactive Map Coming Soon</p>
                </div>
              </div>

              <div className="about-mini-card">
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
                  Planning a Visit?
                </h4>
                <p className="page-body-text" style={{ fontSize: '13px' }}>
                  {visitBlurb}
                </p>
                <Link
                  href="/about"
                  className="program-card-link"
                  style={{ fontSize: '12px', display: 'inline-block', marginTop: '1rem' }}
                >
                  Learn more about our center →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">Stay Connected</h2>
          <p className="page-cta-body">{ctaBody}</p>
          <div className="page-cta-buttons">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white page-cta-btn"
            >
              Instagram
            </a>
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white page-cta-btn"
            >
              Facebook
            </a>
            <a
              href={social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white page-cta-btn"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
