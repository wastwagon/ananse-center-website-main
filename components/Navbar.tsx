'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search } from 'lucide-react'
import LocalizedLink from './LocalizedLink'
import MobileMenuSheet, { type MobileMenuLink } from './MobileMenuSheet'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'
import {
  DEFAULT_PRIMARY_NAV,
  DEFAULT_SHEET_NAV,
  splitHref,
  type CmsNavLink,
} from '../lib/cms/nav'

function compactTitleForPath(pathname: string, allLinks: CmsNavLink[]): string | null {
  const logical = stripLocalePrefix(pathname)
  if (logical === '/') return null
  const match = allLinks.find((link) => splitHref(link.href).path === logical)
  if (match) return match.shortLabel || match.label
  if (logical.startsWith('/events/')) return 'Event'
  return null
}

type NavbarProps = {
  logoSrc?: string
  primaryLinks?: CmsNavLink[]
  sheetLinks?: CmsNavLink[]
}

export default function Navbar({
  logoSrc = '/ananse-logo.png',
  primaryLinks = DEFAULT_PRIMARY_NAV,
  sheetLinks: sheetLinksCms = DEFAULT_SHEET_NAV,
}: NavbarProps) {
  const pathname = usePathname()
  const logicalPath = stripLocalePrefix(pathname)
  const { locale, translate } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const sheetLinks: readonly MobileMenuLink[] = useMemo(
    () =>
      sheetLinksCms.map((link) => {
        const { path, hash } = splitHref(link.href)
        return {
          name: link.label,
          href: localizedPath(path, locale) + hash,
        }
      }),
    [locale, sheetLinksCms],
  )

  const allNavLinks = useMemo(() => [...primaryLinks, ...sheetLinksCms], [primaryLinks, sheetLinksCms])
  const compactTitle = useMemo(() => compactTitleForPath(pathname, allNavLinks), [pathname, allNavLinks])
  const donateLink = primaryLinks.find(
    (link) => /donate|support/i.test(link.label) || link.href.startsWith('/support'),
  )
  const donateHref = donateLink?.href || '/support'
  const donateLabel = donateLink?.label || translate('nav.donate')

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
          <img src={logoSrc} alt="Ananse Center Logo" className="navbar-logo-img" />
        </Link>

        {compactTitle && isScrolled ? (
          <p className="navbar-compact-title" aria-hidden>
            {compactTitle}
          </p>
        ) : null}

        <div className="nav-desktop">
          {primaryLinks.map((link) => {
            const { path, hash } = splitHref(link.href)
            const active =
              logicalPath === path ||
              (path === '/contact' && logicalPath.startsWith('/contact'))
            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={localizedPath(path, locale) + hash}
                className={`navbar-link${active ? ' navbar-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <LocalizedLink
            href="/search"
            className="navbar-link navbar-search-link tap-target"
            aria-label={translate('nav.search')}
            title={translate('nav.search')}
          >
            <Search size={18} strokeWidth={2} aria-hidden />
          </LocalizedLink>
          <Link
            href={localizedPath(splitHref(donateHref).path, locale) + splitHref(donateHref).hash}
            className="btn-primary navbar-cta"
          >
            {donateLabel}
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
        donateLabel={donateLabel}
      />
    </nav>
  )
}
