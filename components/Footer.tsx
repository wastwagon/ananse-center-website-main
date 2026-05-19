import Link from 'next/link'
import Image from 'next/image'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { contact, site, social, impactStats } from '../lib/site'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Events', href: '/events' },
  { name: 'Videos', href: '/videos' },
  { name: 'Support', href: '/support' },
  { name: 'Contact', href: '/contact#form' },
]

const programLinks = [
  { name: 'Sankofa Mentorship', href: '/programs' },
  { name: 'Arts & Crafts', href: '/programs' },
  { name: 'Music & Rhythm', href: '/programs' },
  { name: 'Storytelling', href: '/programs' },
]

const socialLinks = [
  { label: 'Facebook', href: social.facebook, Icon: Facebook },
  { label: 'Instagram', href: social.instagram, Icon: Instagram },
  { label: 'YouTube', href: social.youtube, Icon: Youtube },
] as const

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-root">
      <div className="footer-pattern" aria-hidden />
      <div className="footer-accent" aria-hidden />

      <div className="footer-inner">
        <div className="footer-impact-strip">
          {impactStats.map((stat) => (
            <div key={stat.label} className="footer-impact-item">
              <span className="footer-impact-value">{stat.value}</span>
              <span className="footer-impact-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Image
                src="/ananse-logo.png"
                alt=""
                width={52}
                height={52}
                className="footer-logo-img"
              />
              <div>
                <p className="footer-brand-name">{site.shortName}</p>
                <p className="footer-brand-sub">Arts &amp; Culture</p>
              </div>
            </div>

            <p className="footer-tagline">{site.tagline}</p>
            <p className="footer-desc">{site.footerMission}</p>

            <div className="footer-cta-group">
              <Link href="/support" className="footer-cta footer-cta--primary">
                <Heart size={16} aria-hidden />
                Support our mission
              </Link>
              <Link href="/contact#form" className="footer-cta footer-cta--outline">
                Get in touch
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="footer-social" aria-label="Social media">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <Icon size={17} strokeWidth={2} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Quick Links</p>
            <nav className="footer-links" aria-label="Quick links">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} className="footer-link">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Programs</p>
            <nav className="footer-links" aria-label="Programs">
              {programLinks.map((link) => (
                <Link key={link.name} href={link.href} className="footer-link">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Contact</p>
            <address className="footer-contact not-italic">
              <div className="footer-contact-item">
                <MapPin size={17} className="footer-contact-icon" aria-hidden />
                <span>{site.location}</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={17} className="footer-contact-icon" aria-hidden />
                <a href={`mailto:${contact.email}`} className="footer-contact-link">
                  {contact.email}
                </a>
              </div>
              <div className="footer-contact-item">
                <Phone size={17} className="footer-contact-icon" aria-hidden />
                <a href={contact.phoneHref} className="footer-contact-link">
                  {contact.phone}
                </a>
              </div>
              <div className="footer-contact-item">
                <Clock size={17} className="footer-contact-icon" aria-hidden />
                <span>{contact.hours}</span>
              </div>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {site.name}. All rights reserved.
          </p>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <span className="footer-legal-sep" aria-hidden>
              ·
            </span>
            <Link href="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
