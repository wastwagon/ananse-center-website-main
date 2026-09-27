'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import LocalizedLink from './LocalizedLink'
import MobileMenuSheet, { type MobileMenuLink } from './MobileMenuSheet'
import NavbarSearch from './NavbarSearch'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'
import type { Locale } from '../lib/i18n'
import {
  DEFAULT_PRIMARY_NAV,
  DEFAULT_SHEET_NAV,
  splitHref,
  type CmsNavLink,
} from '../lib/cms/nav'

function flattenNav(links: readonly CmsNavLink[]): Array<CmsNavLink & { child?: boolean }> {
  const out: Array<CmsNavLink & { child?: boolean }> = []
  for (const link of links) {
    out.push(link)
    for (const child of link.children ?? []) {
      out.push({ ...child, child: true })
    }
  }
  return out
}

function compactTitleForPath(pathname: string, allLinks: CmsNavLink[]): string | null {
  const logical = stripLocalePrefix(pathname)
  if (logical === '/') return null
  const match = allLinks.find((link) => splitHref(link.href).path === logical)
  if (match) return match.shortLabel || match.label
  if (logical.startsWith('/events/')) return 'Event'
  return null
}

function isInvolveLink(link: CmsNavLink) {
  return splitHref(link.href).path.startsWith('/get-involved')
}

function NavSubmenu({
  link,
  locale,
  alignEnd = false,
}: {
  link: CmsNavLink
  locale: Locale
  alignEnd?: boolean
}) {
  const children = link.children ?? []
  if (!children.length) return null

  return (
    <div
      className={`nav-submenu${alignEnd ? ' nav-submenu--end' : ''}`}
      role="navigation"
      aria-label={`${link.label} sections`}
    >
      {children.map((child) => {
        const childParts = splitHref(child.href)
        return (
          <Link
            key={`${child.label}-${child.href}`}
            href={localizedPath(childParts.path, locale) + childParts.hash}
            className="nav-submenu-link"
          >
            {child.label}
          </Link>
        )
      })}
    </div>
  )
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
  const { locale } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const sheetLinks: readonly MobileMenuLink[] = useMemo(
    () =>
      flattenNav([...primaryLinks, ...sheetLinksCms]).map((link) => {
        const { path, hash } = splitHref(link.href)
        return {
          name: link.label,
          href: localizedPath(path, locale) + hash,
          child: Boolean(link.child),
        }
      }),
    [locale, primaryLinks, sheetLinksCms],
  )

  const allNavLinks = useMemo(() => [...primaryLinks, ...sheetLinksCms], [primaryLinks, sheetLinksCms])
  const compactTitle = useMemo(() => compactTitleForPath(pathname, allNavLinks), [pathname, allNavLinks])
  const involveLink = primaryLinks.find(isInvolveLink)
  const textLinks = primaryLinks.filter((link) => !isInvolveLink(link))
  const involveHref = involveLink?.href || '/get-involved'
  const involveLabel = involveLink?.label || 'Get Involved'
  const involveParts = splitHref(involveHref)
  const involveActive =
    logicalPath === involveParts.path ||
    (involveParts.path !== '/' && logicalPath.startsWith(involveParts.path))

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
        <Link
          href={localizedPath('/', locale)}
          className="navbar-logo tap-target"
          aria-label="ANANSE Center home"
        >
          <img src={logoSrc} alt="" className="navbar-logo-img" />
        </Link>

        <div className="navbar-search-slot">
          <NavbarSearch variant="field" />
        </div>

        {compactTitle && isScrolled ? (
          <p className="navbar-compact-title" aria-hidden>
            {compactTitle}
          </p>
        ) : null}

        <div className="nav-desktop">
          {textLinks.map((link) => {
            const { path, hash } = splitHref(link.href)
            const active =
              logicalPath === path ||
              (path !== '/' && logicalPath.startsWith(path))
            return (
              <div key={`${link.label}-${link.href}`} className="nav-item">
                <Link
                  href={localizedPath(path, locale) + hash}
                  className={`navbar-link${active ? ' navbar-link-active' : ''}${link.children?.length ? ' navbar-link--has-submenu' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  aria-haspopup={link.children?.length ? 'true' : undefined}
                >
                  {link.label}
                </Link>
                <NavSubmenu link={link} locale={locale} />
              </div>
            )
          })}
          <div className="nav-item nav-item--cta">
            <LocalizedLink
              href={involveParts.path + involveParts.hash}
              className={`btn-primary navbar-cta${involveActive ? ' navbar-cta--active' : ''}${involveLink?.children?.length ? ' navbar-cta--has-submenu' : ''}`}
              aria-current={involveActive ? 'page' : undefined}
              aria-haspopup={involveLink?.children?.length ? 'true' : undefined}
            >
              {involveLabel}
            </LocalizedLink>
            {involveLink ? <NavSubmenu link={involveLink} locale={locale} alignEnd /> : null}
          </div>
        </div>

        <div className="nav-mobile-actions">
          <NavbarSearch variant="icon" />
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
      </div>

      <MobileMenuSheet
        isOpen={menuOpen}
        onClose={closeMenu}
        links={sheetLinks}
        title="Menu"
        footerHref={localizedPath(involveParts.path, locale) + involveParts.hash}
        footerLabel={involveLabel}
      />
    </nav>
  )
}
