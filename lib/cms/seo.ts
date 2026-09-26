import type { Metadata } from 'next'
import { getCmsTexts, type ContentKey } from './content'
import { buildPageMetadata } from '../page-meta'
import { defaultOgImage } from '../og'

export type SeoPageId =
  | 'home'
  | 'about'
  | 'programs'
  | 'events'
  | 'support'
  | 'contact'
  | 'insights'
  | 'library'
  | 'people'
  | 'getInvolved'
  | 'accessibility'
  | 'videos'
  | 'visit'
  | 'repatriation'
  | 'admissions'
  | 'archives'
  | 'community'
  | 'news'
  | 'partnerships'
  | 'resources'
  | 'transparency'
  | 'trustees'
  | 'privacy'
  | 'terms'
  | 'search'

type SeoPageDefaults = {
  title: string
  description: string
  path: string
  ogImage?: string
}

export const SEO_PAGE_DEFAULTS: Record<SeoPageId, SeoPageDefaults> = {
  home: {
    title: 'Home',
    description:
      'ANANSE Center for Leadership Development — developing people through leadership education, mentoring, and practical service.',
    path: '/',
  },
  about: {
    title: 'About',
    description:
      'Who ANANSE is, why the name matters, the vision and mission, seven core values, and EAGLESonline.',
    path: '/about',
  },
  programs: {
    title: 'Programs',
    description:
      'Ten ANANSE programs, including Leadership Development, Mentorship, Excellence Lectures, Midday Reflection, and Sankofa ADR.',
    path: '/programs',
  },
  events: {
    title: 'Events',
    description:
      'Lectures, seminars, and conversations at ANANSE Center for Leadership Development. Registration stays open on the event page until the gathering closes.',
    path: '/events',
  },
  support: {
    title: 'Support',
    description:
      'Financial gifts to ANANSE Center for Leadership Development through Paystack. Giving is separate from offering time, skill, or opportunities.',
    path: '/support',
  },
  contact: {
    title: 'Contact',
    description:
      'Contact ANANSE Center for Leadership Development. The form also lives under Get Involved.',
    path: '/contact',
  },
  insights: {
    title: 'Insights',
    description:
      'Articles, essays, and reflections on leadership, character, wisdom, and service — filtered by topic, not separate menus.',
    path: '/insights',
  },
  library: {
    title: 'Library',
    description:
      'The ANANSE Library — listen, watch, read, and photo galleries. Lectures, Midday Reflection, study materials, and more.',
    path: '/library',
  },
  people: {
    title: 'People',
    description:
      'The ANANSE community: leadership, mentors, speakers, fellows, and partners. Profiles published only with permission.',
    path: '/people',
  },
  getInvolved: {
    title: 'Get Involved',
    description:
      'Learn, attend, mentor, partner, support, and share with ANANSE Center for Leadership Development.',
    path: '/get-involved',
  },
  accessibility: {
    title: 'Accessibility',
    description:
      'Accessibility statement for the ANANSE Center for Leadership Development website.',
    path: '/accessibility',
  },
  videos: {
    title: 'Videos',
    description:
      'Stories, performances, and teachings from The Ananse Center community.',
    path: '/videos',
  },
  visit: {
    title: 'Visit',
    description: 'Plan a visit to The Ananse Center campus in Akatakyiwa, Central Region, Ghana.',
    path: '/visit',
  },
  repatriation: {
    title: 'Repatriation',
    description:
      'Sankofa healing journeys and cultural repatriation programs at The Ananse Center.',
    path: '/repatriation',
  },
  admissions: {
    title: 'Admissions',
    description: 'Admissions information for Ananse Center programs and learning pathways.',
    path: '/admissions',
  },
  archives: {
    title: 'Archives',
    description:
      'Digitized cultural heritage with community-centered metadata at The Ananse Center.',
    path: '/archives',
  },
  community: {
    title: 'Community',
    description: 'Community stories, spotlights, and submissions from The Ananse Center network.',
    path: '/community',
  },
  news: {
    title: 'Insights',
    description:
      'Articles and reflections from ANANSE Center for Leadership Development. Public listing lives at /insights.',
    path: '/news',
  },
  partnerships: {
    title: 'Partnerships',
    description: 'Partner with The Ananse Center to advance cultural education and leadership.',
    path: '/partnerships',
  },
  resources: {
    title: 'Resources',
    description: 'Learning resources and materials from The Ananse Center.',
    path: '/resources',
  },
  transparency: {
    title: 'Transparency',
    description: 'Financial transparency and stewardship reports from The Ananse Center.',
    path: '/transparency',
  },
  trustees: {
    title: 'Trustees',
    description: 'Governance information for ANANSE Center for Leadership Development.',
    path: '/trustees',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for the ANANSE Center for Leadership Development website.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service for the ANANSE Center for Leadership Development website.',
    path: '/terms',
  },
  search: {
    title: 'Search',
    description:
      'Search ANANSE for programs, events, insights, library records, people, and pages.',
    path: '/search',
  },
}

/** Build page metadata from CMS seo.* keys with hardcoded fallbacks. */
export async function buildCmsMetadata(
  page: SeoPageId,
  overrides?: { ogImage?: string },
): Promise<Metadata> {
  const defaults = SEO_PAGE_DEFAULTS[page]
  const titleKey = `seo.${page}.title` as ContentKey
  const descriptionKey = `seo.${page}.description` as ContentKey
  const ogImageKey = `seo.${page}.ogImage` as ContentKey

  const cms = await getCmsTexts([titleKey, descriptionKey, ogImageKey] as const)
  const ogFromCms = cms[ogImageKey]?.trim()
  const ogImage = overrides?.ogImage || ogFromCms || defaults.ogImage || defaultOgImage

  return buildPageMetadata({
    title: cms[titleKey]?.trim() || defaults.title,
    description: cms[descriptionKey]?.trim() || defaults.description,
    path: defaults.path,
    ogImage,
  })
}

export function seoRegistryEntries(): Record<string, {
  label: string
  section: string
  defaultBody: string
  hint?: string
}> {
  const out: Record<string, { label: string; section: string; defaultBody: string; hint?: string }> = {}
  for (const [page, defaults] of Object.entries(SEO_PAGE_DEFAULTS) as [SeoPageId, SeoPageDefaults][]) {
    out[`seo.${page}.title`] = {
      label: `SEO — ${page} title`,
      section: 'seo',
      defaultBody: defaults.title,
      hint: 'Browser tab and search title (site name is appended automatically).',
    }
    out[`seo.${page}.description`] = {
      label: `SEO — ${page} description`,
      section: 'seo',
      defaultBody: defaults.description,
      hint: 'Meta description for search and social previews.',
    }
    out[`seo.${page}.ogImage`] = {
      label: `SEO — ${page} Open Graph image`,
      section: 'seo',
      defaultBody: defaults.ogImage || '',
      hint: 'Optional public path or Media Library URL. Leave blank to use the default OG image.',
    }
  }
  return out
}
