export type CmsNavLink = {
  label: string
  href: string
  /** Optional short label for compact navbar title / mobile tab */
  shortLabel?: string
  /** Lucide icon key for mobile bottom nav */
  iconKey?: string
}

export type CmsMobileNavLink = CmsNavLink & {
  iconKey: string
}

export const DEFAULT_PRIMARY_NAV: CmsNavLink[] = [
  { label: 'Home', href: '/', shortLabel: 'Home' },
  { label: 'About', href: '/about', shortLabel: 'About' },
  { label: 'Programs', href: '/programs', shortLabel: 'Programs' },
  { label: 'Events', href: '/events', shortLabel: 'Events' },
  { label: 'Videos', href: '/videos', shortLabel: 'Videos' },
  { label: 'Donate', href: '/support', shortLabel: 'Support' },
  { label: 'Contact', href: '/contact#form', shortLabel: 'Contact' },
]

export const DEFAULT_MOBILE_NAV: CmsMobileNavLink[] = [
  { label: 'Home', href: '/', iconKey: 'Home' },
  { label: 'Programs', href: '/programs', iconKey: 'Sparkles' },
  { label: 'Events', href: '/events', iconKey: 'CalendarDays' },
  { label: 'Donate', href: '/support', iconKey: 'Heart' },
  { label: 'Contact', href: '/contact', iconKey: 'Mail' },
]

export const DEFAULT_SHEET_NAV: CmsNavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Repatriation', href: '/repatriation' },
  { label: 'Visit', href: '/visit' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Community', href: '/community' },
  { label: 'Partnerships', href: '/partnerships' },
  { label: 'News', href: '/news' },
  { label: 'Resources', href: '/resources' },
  { label: 'Archives', href: '/archives' },
  { label: 'Trustees', href: '/trustees' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'Videos', href: '/videos' },
  { label: 'Search', href: '/search' },
  { label: 'Contact', href: '/contact#form' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export const DEFAULT_FOOTER_QUICK_LINKS: CmsNavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Events', href: '/events' },
  { label: 'Videos', href: '/videos' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact#form' },
  { label: 'Trustees', href: '/trustees' },
  { label: 'Transparency', href: '/transparency' },
]

export const DEFAULT_FOOTER_PROGRAM_LINKS: CmsNavLink[] = [
  { label: 'Browse All Programs', href: '/programs' },
  { label: 'Traditional Arts & Crafts', href: '/programs' },
  { label: 'Music & Rhythm', href: '/programs' },
  { label: 'Storytelling', href: '/programs' },
  { label: 'Cultural Leadership', href: '/programs' },
]

/** Split path + hash for locale-aware linking. */
export function splitHref(href: string): { path: string; hash: string } {
  const [path, hashPart] = href.split('#')
  return { path: path || '/', hash: hashPart ? `#${hashPart}` : '' }
}
