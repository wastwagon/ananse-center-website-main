import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { parseLocale, t } from '../lib/i18n'
import { LOCALE_COOKIE, localizedPath } from '../lib/locale-path'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { contact as defaultContact, site as defaultSite, social as defaultSocial } from '../lib/site'
import { type ImpactStat } from '../lib/site-impact'
import type { PublicSiteProfile } from '../lib/site-profile'
import LocaleSwitcher from './LocaleSwitcher'

type FooterLink = { label: string; href: string }

type FooterProps = {
  site?: PublicSiteProfile['site']
  contact?: PublicSiteProfile['contact']
  social?: PublicSiteProfile['social']
  impactStats?: ImpactStat[]
  footerMission?: string
  footerPrimaryCta?: { label: string; href: string }
  footerSecondaryCta?: { label: string; href: string }
  logoSrc?: string
  quickLinks?: FooterLink[]
  programLinks?: FooterLink[]
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403a4.92 4.92 0 0 1 1.77 1.153 4.92 4.92 0 0 1 1.153 1.77c.163.457.349 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.77 4.92 4.92 0 0 1-1.77 1.153c-.457.163-1.257.349-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.77-1.153 4.92 4.92 0 0 1-1.153-1.77c-.163-.457-.349-1.257-.403-2.427C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.77 4.92 4.92 0 0 1 1.77-1.153c.457-.163 1.257-.349 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.905.333 4.14.63a6.12 6.12 0 0 0-2.19 1.19A6.12 6.12 0 0 0 .63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.059 1.277.261 2.148.558 2.913a6.12 6.12 0 0 0 1.19 2.19 6.12 6.12 0 0 0 2.19 1.19c.765.297 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.059 2.148-.261 2.913-.558a6.12 6.12 0 0 0 2.19-1.19 6.12 6.12 0 0 0 1.19-2.19c.297-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.059-1.277-.261-2.148-.558-2.913a6.12 6.12 0 0 0-1.19-2.19 6.12 6.12 0 0 0-2.19-1.19c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0-2.881 0 1.44 1.44 0 0 0 2.881 0z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M20.52 3.449A11.82 11.82 0 0 0 12.06 0C5.495 0 .16 5.335.16 11.9c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.86 11.86 0 0 0 5.75 1.47h.005c6.564 0 11.9-5.335 11.9-11.9 0-3.176-1.237-6.165-3.44-8.467zM12.06 21.785h-.004a9.86 9.86 0 0 1-5.02-1.378l-.36-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.252c0-5.448 4.434-9.882 9.884-9.882 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.874-9.892 9.874zm5.421-7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.717-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

const DEFAULT_QUICK_LINKS: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Library', href: '/library' },
  { label: 'Events', href: '/events' },
  { label: 'Insights', href: '/insights' },
  { label: 'People', href: '/people' },
  { label: 'Get Involved', href: '/get-involved' },
]

const DEFAULT_PROGRAM_LINKS: FooterLink[] = [
  { label: 'EAGLESonline', href: '/about#eaglesonline' },
  { label: 'EAGLES Center', href: '/about#eaglesonline' },
  { label: 'ANANSE Center', href: '/about' },
]

export default async function Footer({
  site = defaultSite,
  contact = { ...defaultContact, address: defaultSite.address },
  social = defaultSocial,
  footerMission = defaultSite.footerMission,
  footerPrimaryCta = { label: 'Support Our Mission', href: '/support' },
  footerSecondaryCta = { label: 'Get In Touch', href: '/contact#form' },
  logoSrc = '/ananse-logo.png',
  quickLinks = DEFAULT_QUICK_LINKS,
  programLinks = DEFAULT_PROGRAM_LINKS,
}: FooterProps) {
  const cookieStore = await cookies()
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value)
  const year = new Date().getFullYear()
  const socialLinks = [
    { label: 'Facebook', href: social.facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: social.instagram, Icon: InstagramIcon },
    { label: 'YouTube', href: social.youtube, Icon: YoutubeIcon },
    ...(social.twitter ? [{ label: 'X', href: social.twitter, Icon: TwitterIcon }] : []),
    ...(social.linkedin ? [{ label: 'LinkedIn', href: social.linkedin, Icon: LinkedInIcon }] : []),
    ...(social.whatsapp ? [{ label: 'WhatsApp', href: social.whatsapp, Icon: WhatsAppIcon }] : []),
  ].filter((item) => item.href?.trim())

  return (
    <footer className="footer-root">
      <div className="footer-pattern" aria-hidden />
      <div className="footer-accent" aria-hidden />

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Image
                src={logoSrc}
                alt="ANANSE Center for Leadership Development"
                width={52}
                height={52}
                className="footer-logo-img"
              />
              <div>
                <p className="footer-brand-name">{site.shortName}</p>
                <p className="footer-brand-sub">Leadership Development</p>
              </div>
            </div>

            <p className="footer-tagline">{site.tagline}</p>
            <p className="footer-desc">{footerMission}</p>

            <div className="footer-cta-group">
              <Link
                href={localizedPath(footerPrimaryCta.href.split('#')[0], locale) + (footerPrimaryCta.href.includes('#') ? `#${footerPrimaryCta.href.split('#')[1]}` : '')}
                className="footer-cta footer-cta--primary"
              >
                <Heart size={16} aria-hidden />
                {footerPrimaryCta.label}
              </Link>
              <Link
                href={localizedPath(footerSecondaryCta.href.split('#')[0], locale) + (footerSecondaryCta.href.includes('#') ? `#${footerSecondaryCta.href.split('#')[1]}` : '')}
                className="footer-cta footer-cta--outline"
              >
                {footerSecondaryCta.label}
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
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">{t('footer.explore', locale)}</p>
            <nav className="footer-links" aria-label="Quick links">
              {quickLinks.map((link) => {
                const base = link.href.split('#')[0]
                const hash = link.href.includes('#') ? `#${link.href.split('#')[1]}` : ''
                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={localizedPath(base, locale) + hash}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">EAGLESonline</p>
            <nav className="footer-links" aria-label="EAGLESonline">
              {programLinks.map((link) => {
                const base = link.href.split('#')[0]
                const hash = link.href.includes('#') ? `#${link.href.split('#')[1]}` : ''
                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={localizedPath(base, locale) + hash}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">{t('footer.connect', locale)}</p>
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
          <LocaleSwitcher />
          <p className="footer-copy">
            © {year} {site.name}. All rights reserved.
          </p>
          <nav className="footer-legal" aria-label="Legal">
            <Link href={localizedPath('/privacy', locale)} className="footer-legal-link">
              {t('nav.privacy', locale)}
            </Link>
            <span className="footer-legal-sep" aria-hidden>
              ·
            </span>
            <Link href={localizedPath('/terms', locale)} className="footer-legal-link">
              {t('nav.terms', locale)}
            </Link>
            <span className="footer-legal-sep" aria-hidden>
              ·
            </span>
            <Link href={localizedPath('/accessibility', locale)} className="footer-legal-link">
              {t('nav.accessibility', locale)}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
