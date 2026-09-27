export type CmsNavLink = {
  label: string
  href: string
  /** Optional short label for compact navbar title / mobile tab */
  shortLabel?: string
  /** Lucide icon key for mobile bottom nav */
  iconKey?: string
  /** Desktop dropdown and phone-sheet children. Long lists scroll. */
  children?: CmsNavLink[]
}

export type CmsMobileNavLink = CmsNavLink & {
  iconKey: string
}

export const DEFAULT_PRIMARY_NAV: CmsNavLink[] = [
  { label: 'Home', href: '/', shortLabel: 'Home' },
  {
    label: 'About',
    href: '/about',
    shortLabel: 'About',
    children: [
      { label: 'Who We Are', href: '/about#who-we-are' },
      { label: 'Who We Serve', href: '/about#who-we-serve' },
      { label: 'The ANANSE Story', href: '/about#the-ananse-story' },
      { label: 'Roots & Continuity', href: '/about#continuity' },
      { label: 'Vision & Mission', href: '/about#vision-mission' },
      { label: 'Core Values', href: '/about#core-values' },
      { label: 'ANANSE & EAGLESonline', href: '/about#eaglesonline' },
      { label: 'ANANSE & Africa', href: '/about#ananse-africa' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    shortLabel: 'Programs',
    children: [
      { label: 'Leadership Development', href: '/programs/leadership-development' },
      { label: 'Mentorship', href: '/programs/mentorship' },
      { label: 'Excellence Lectures', href: '/programs/excellence-lectures' },
      { label: 'Midday Reflection', href: '/programs/midday-reflection' },
      { label: 'Public Lectures & Conversations', href: '/programs/public-lectures-conversations' },
      { label: 'Special Initiatives', href: '/programs/special-initiatives' },
      { label: 'Marriage & Relationships', href: '/programs/marriage-relationships' },
      { label: 'Music & Culture', href: '/programs/music-culture' },
      { label: 'Sankofa ADR', href: '/programs/sankofa-adr' },
      { label: 'Healthy Living', href: '/programs/healthy-living' },
    ],
  },
  {
    label: 'Library',
    href: '/library',
    shortLabel: 'Library',
    children: [
      { label: 'Listen', href: '/library?shelf=listen' },
      { label: 'Watch', href: '/library?shelf=watch' },
      { label: 'Read', href: '/library?shelf=read' },
      { label: 'Midday Reflection archive', href: '/library/midday-reflection' },
      { label: 'Photo galleries', href: '/library/photos' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    shortLabel: 'Events',
    children: [
      { label: 'All Events', href: '/events' },
      { label: 'Lectures', href: '/events?type=Lecture' },
      { label: 'Seminars', href: '/events?type=Seminar' },
      { label: 'Workshops', href: '/events?type=Workshop' },
      { label: 'Conferences', href: '/events?type=Conference' },
      { label: 'Conversations', href: '/events?type=Conversation' },
      { label: 'Mentorship', href: '/events?type=Mentorship' },
      { label: 'Special Programs', href: '/events?type=Special%20Program' },
    ],
  },
  {
    label: 'Insights',
    href: '/insights',
    shortLabel: 'Insights',
    children: [{ label: 'Browse by topic', href: '/insights' }],
  },
  {
    label: 'People',
    href: '/people',
    shortLabel: 'People',
    children: [
      { label: 'All People', href: '/people' },
      { label: 'Leadership', href: '/people?group=Leadership' },
      { label: 'Mentors', href: '/people?group=Mentors' },
      { label: 'Speakers & Faculty', href: '/people?group=Speakers%20%26%20Faculty' },
      { label: 'Fellows and Participants', href: '/people?group=Fellows%20and%20Participants' },
      { label: 'Partners', href: '/people?group=Partners' },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    shortLabel: 'Involve',
    children: [
      { label: 'Learn', href: '/get-involved#learn' },
      { label: 'Attend', href: '/get-involved#attend' },
      { label: 'Mentor', href: '/get-involved#mentor' },
      { label: 'Partner', href: '/get-involved#partner' },
      { label: 'Support', href: '/get-involved#support' },
      { label: 'Share', href: '/get-involved#share' },
      { label: 'Contact', href: '/get-involved#contact' },
    ],
  },
]

export const DEFAULT_MOBILE_NAV: CmsMobileNavLink[] = [
  { label: 'Home', href: '/', iconKey: 'Home' },
  { label: 'Programs', href: '/programs', iconKey: 'Sparkles' },
  { label: 'Library', href: '/library', iconKey: 'Library' },
  { label: 'Events', href: '/events', iconKey: 'CalendarDays' },
  { label: 'People', href: '/people', iconKey: 'Users' },
]

export const DEFAULT_SHEET_NAV: CmsNavLink[] = [
  { label: 'Search', href: '/search' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
]

export const DEFAULT_FOOTER_QUICK_LINKS: CmsNavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Events', href: '/events' },
  { label: 'Library', href: '/library' },
  { label: 'Insights', href: '/insights' },
  { label: 'People', href: '/people' },
  { label: 'Support', href: '/support' },
  { label: 'Get Involved', href: '/get-involved' },
]

export const DEFAULT_FOOTER_PROGRAM_LINKS: CmsNavLink[] = [
  { label: 'EAGLESonline', href: '/about#eaglesonline' },
  { label: 'EAGLES Center', href: '/about#eaglesonline' },
  { label: 'ANANSE Center', href: '/about' },
]

const ARTS_NAV_PATHS = [
  '/repatriation',
  '/visit',
  '/admissions',
  '/trustees',
  '/archives',
  '/transparency',
  '/videos',
  '/community',
  '/resources',
  '/partnerships',
]

function usesArtsNav(links: CmsNavLink[]): boolean {
  return links.some((link) => {
    if (ARTS_NAV_PATHS.includes(splitHref(link.href).path)) return true
    return /arts|kente|storytelling|cultural leadership|trustees|repatriation|admissions|drumming/i.test(link.label)
  })
}

function hasAnyChildren(links: CmsNavLink[]): boolean {
  return links.some((link) => (link.children?.length ?? 0) > 0)
}

/** Keep a customized menu only when it already follows the leadership architecture with dropdowns. */
export function resolvePrimaryNav(stored: CmsNavLink[] | null | undefined): CmsNavLink[] {
  if (
    !stored?.length ||
    usesArtsNav(stored) ||
    !stored.some((link) => splitHref(link.href).path === '/library') ||
    !hasAnyChildren(stored)
  ) {
    return DEFAULT_PRIMARY_NAV
  }
  return normalizeLeadershipNav(stored)
}

const ABOUT_ANCHORS: CmsNavLink[] = [
  { label: 'ANANSE & EAGLESonline', href: '/about#eaglesonline' },
  { label: 'ANANSE & Africa', href: '/about#ananse-africa' },
]

function normalizeLeadershipNav(links: CmsNavLink[]): CmsNavLink[] {
  return links.map((link) => {
    const path = splitHref(link.href).path
    if (path === '/insights') {
      return { ...link, children: [{ label: 'Browse by topic', href: '/insights' }] }
    }
    if (path === '/about') {
      const children = [...(link.children ?? [])]
      for (const anchor of ABOUT_ANCHORS) {
        if (!children.some((child) => child.href === anchor.href)) children.push(anchor)
      }
      return { ...link, children }
    }
    return link
  })
}

export function resolveSheetNav(stored: CmsNavLink[] | null | undefined): CmsNavLink[] {
  if (!stored?.length || usesArtsNav(stored)) return DEFAULT_SHEET_NAV
  return stored
}

export function resolveFooterLinks(
  stored: CmsNavLink[] | null | undefined,
  fallback: CmsNavLink[],
): CmsNavLink[] {
  if (!stored?.length || usesArtsNav(stored)) return fallback
  return stored
}

/** Split path + hash for locale-aware linking. */
export function splitHref(href: string): { path: string; hash: string } {
  const [path, hashPart] = href.split('#')
  return { path: path || '/', hash: hashPart ? `#${hashPart}` : '' }
}
