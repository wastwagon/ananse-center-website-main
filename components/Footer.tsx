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
import { DEFAULT_IMPACT_STATS, type ImpactStat } from '../lib/site-impact'
import type { PublicSiteProfile } from '../lib/site-profile'
import LocaleSwitcher from './LocaleSwitcher'

type FooterProps = {
  site?: PublicSiteProfile['site']
  contact?: PublicSiteProfile['contact']
  social?: PublicSiteProfile['social']
  impactStats?: ImpactStat[]
  footerMission?: string
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

const quickLinks = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.repatriation', href: '/repatriation' },
  { key: 'nav.programs', href: '/programs' },
  { key: 'nav.admissions', href: '/admissions' },
  { key: 'nav.events', href: '/events' },
  { key: 'nav.community', href: '/community' },
  { key: 'nav.donate', href: '/support' },
  { key: 'nav.transparency', href: '/transparency' },
  { key: 'nav.visit', href: '/visit' },
  { key: 'nav.contact', href: '/contact#form' },
] as const

const programLinks = [
  { name: 'Sankofa Mentorship', href: '/programs' },
  { name: 'Arts & Crafts', href: '/programs' },
  { name: 'Music & Rhythm', href: '/programs' },
  { name: 'Storytelling', href: '/programs' },
]

export default async function Footer({
  site = defaultSite,
  contact = { ...defaultContact, address: defaultSite.address },
  social = defaultSocial,
  impactStats = DEFAULT_IMPACT_STATS,
  footerMission = defaultSite.footerMission,
}: FooterProps) {
  const cookieStore = await cookies()
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value)
  const year = new Date().getFullYear()
  const socialLinks = [
    { label: 'Facebook', href: social.facebook, Icon: FacebookIcon },
    { label: 'Instagram', href: social.instagram, Icon: InstagramIcon },
    { label: 'YouTube', href: social.youtube, Icon: YoutubeIcon },
  ] as const

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
            <p className="footer-desc">{footerMission}</p>

            <div className="footer-cta-group">
              <Link href={localizedPath('/support', locale)} className="footer-cta footer-cta--primary">
                <Heart size={16} aria-hidden />
                Support our mission
              </Link>
              <Link href={`${localizedPath('/contact', locale)}#form`} className="footer-cta footer-cta--outline">
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
                const hash = link.href.includes('#') ? '#form' : ''
                return (
                  <Link
                    key={link.key}
                    href={localizedPath(base, locale) + hash}
                    className="footer-link"
                  >
                    {t(link.key, locale)}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Programs</p>
            <nav className="footer-links" aria-label="Programs">
              {programLinks.map((link) => (
                <Link key={link.name} href={localizedPath(link.href, locale)} className="footer-link">
                  {link.name}
                </Link>
              ))}
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
          </nav>
        </div>
      </div>
    </footer>
  )
}
