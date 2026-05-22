'use client'

import { useState } from 'react'
import LocalizedLink from '../../../components/LocalizedLink'
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
  formHeading: string
  formSubjects: string[]
  mapHeading: string
  mapSubtitle: string
  visitHeading: string
  visitLinkText: string
  infoTitles: string[]
  visitBlurb: string
  ctaHeading: string
  ctaBody: string
  profile: PublicSiteProfile
}

export default function ContactPageClient({
  heroLead,
  heroTitle,
  heroStats,
  heroPrimaryCta,
  heroSecondaryCta,
  formHeading,
  formSubjects,
  mapHeading,
  mapSubtitle,
  visitHeading,
  visitLinkText,
  infoTitles,
  visitBlurb,
  ctaHeading,
  ctaBody,
  profile,
}: ContactPageClientProps) {
  const { contact, social } = profile

  const infoIcons: LucideIcon[] = [MapPin, Mail, Phone, Clock]
  const infoDescriptions = [contact.address, `${contact.email}\n${contact.programsEmail}`, contact.phone, contact.hours]
  const contactInfo: { title: string; desc: string; icon: LucideIcon }[] = infoTitles.map((title, index) => ({
    title,
    desc: infoDescriptions[index] ?? '',
    icon: infoIcons[index] ?? MapPin,
  }))

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(formSubjects[0] ?? 'General Inquiry')
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
      setSubject(formSubjects[0] ?? 'General Inquiry')
      setMessage('')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to send message')
    }
  }

  return (
    <div className="contact-page">
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

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="grid-cards grid-cards--keep-cols">
            {contactInfo.map((item) => (
              <div key={item.title} className="feature-card text-center">
                <div className="feature-card-icon-wrap">
                  <FeatureIcon icon={item.icon} variant="gold" />
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="page-body-text feature-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="form" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="two-col-section">
            <div className="insight-card p-0">
              <div className="insight-card-bar" />
              <div className="insight-card-body p-20">
                <h2 className="page-section-heading contact-form-heading">{formHeading}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="contact-form-grid">
                    <div className="form-group">
                      <label htmlFor="contact-name" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        className="form-input"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className="form-input form-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      {formSubjects.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-input form-textarea"
                      placeholder="Tell us how we can help..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full contact-form-submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                  {feedback ? (
                    <p className="page-body-text text-body-md mt-note">
                      {feedback}
                    </p>
                  ) : null}
                </form>
              </div>
            </div>

            <div className="flex-column contact-sidebar">
              <div className="about-visual-card contact-map-card p-0">
                <div className="text-center contact-map-overlay">
                  <span className="contact-map-emoji" aria-hidden>🗺️</span>
                  <h4 className="contact-visit-title">{mapHeading}</h4>
                  <p className="contact-visit-sub">{mapSubtitle}</p>
                </div>
              </div>

              <div className="about-mini-card">
                <h4 className="contact-visit-card-title">{visitHeading}</h4>
                <p className="page-body-text contact-visit-card-body">{visitBlurb}</p>
                <LocalizedLink href="/about" className="program-card-link visit-card-link">
                  {visitLinkText}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-cta-section section-reveal">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">{ctaHeading}</h2>
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
