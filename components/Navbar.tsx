'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import MobileMenuSheet, { type MobileMenuLink } from './MobileMenuSheet'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'

const navLinks = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.programs', href: '/programs' },
  { key: 'nav.events', href: '/events' },
  { key: 'nav.videos', href: '/videos' },
  { key: 'nav.donate', href: '/support' },
  { key: 'nav.contact', href: '/contact#form' },
] as const

const mobileSheetLinks = [
  { key: 'nav.about', href: '/about' },
  { key: 'nav.videos', href: '/videos' },
  { key: 'nav.contact', href: '/contact#form' },
  { key: 'nav.privacy', href: '/privacy' },
  { key: 'nav.terms', href: '/terms' },
] as const

const compactTitles: Record<string, string> = {
  '/about': 'About',
  '/programs': 'Programs',
  '/events': 'Events',
  '/videos': 'Videos',
  '/support': 'Support',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
}

function compactTitleForPath(pathname: string): string | null {
  const logical = stripLocalePrefix(pathname)
  if (logical === '/') return null
  if (compactTitles[logical]) return compactTitles[logical]
  if (logical.startsWith('/events/')) return 'Event'
  return null
}

export default function Navbar() {
  const pathname = usePathname()
  const logicalPath = stripLocalePrefix(pathname)
  const { locale, translate } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const sheetLinks: readonly MobileMenuLink[] = useMemo(
    () =>
      mobileSheetLinks.map((link) => ({
        name: translate(link.key),
        href: localizedPath(link.href.split('#')[0], locale) + (link.href.includes('#') ? '#form' : ''),
      })),
    [locale, translate],
  )

  const compactTitle = useMemo(() => compactTitleForPath(pathname), [pathname])

  useEffect(() => {
    const handle = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav
      className={`navbar-main${isScrolled ? ' navbar-scrolled' : ' navbar-transparent'}${compactTitle && isScrolled ? ' navbar-compact-active' : ''}`}
      aria-label="Main navigation"
    >
      <div className="navbar-container">
        <Link href={localizedPath('/', locale)} className="navbar-logo tap-target">
          <img src="/ananse-logo.png" alt="Ananse Center Logo" className="navbar-logo-img" />
        </Link>

        {compactTitle && isScrolled ? (
          <p className="navbar-compact-title" aria-hidden>
            {compactTitle}
          </p>
        ) : null}

        <div className="nav-desktop">
          {navLinks.map((link) => {
            const base = link.href.split('#')[0]
            const hash = link.href.includes('#') ? '#form' : ''
            const active =
              logicalPath === base ||
              (link.href === '/contact#form' && logicalPath.startsWith('/contact'))
            return (
              <Link
                key={link.key}
                href={localizedPath(base, locale) + hash}
                className={`navbar-link${active ? ' navbar-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {translate(link.key)}
              </Link>
            )
          })}
          <Link href={localizedPath('/support', locale)} className="btn-primary navbar-cta">
            {translate('nav.donate')}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="nav-mobile-btn navbar-hamburger tap-target"
        >
          <Menu size={22} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <MobileMenuSheet
        isOpen={menuOpen}
        onClose={closeMenu}
        links={sheetLinks}
        title={translate('nav.more')}
        donateLabel={translate('nav.donateNow')}
      />
    </nav>
  )
}
