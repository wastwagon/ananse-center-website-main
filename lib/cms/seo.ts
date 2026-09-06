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
      'The Ananse Center for Arts and Culture — Sankofa programs, events, and Pan-African leadership development in Accra and across the diaspora.',
    path: '/',
  },
  about: {
    title: 'About',
    description:
      'Learn about The Ananse Center mission, vision, leadership, and Sankofa approach to cultural restoration.',
    path: '/about',
  },
  programs: {
    title: 'Programs',
    description:
      'Explore Sankofa arts, culture, and leadership programs at The Ananse Center in Ghana.',
    path: '/programs',
  },
  events: {
    title: 'Events',
    description:
      'Festivals, workshops, and community gatherings at The Ananse Center for Arts and Culture.',
    path: '/events',
  },
  support: {
    title: 'Support',
    description:
      'Donate and partner with The Ananse Center to sustain cultural arts education and community programs.',
    path: '/support',
  },
  contact: {
    title: 'Contact',
    description:
      'Contact The Ananse Center for partnerships, visits, programs, and press inquiries.',
    path: '/contact',
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
    title: 'News',
    description: 'News and updates from The Ananse Center for Arts and Culture.',
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
    description: 'Meet the Board of Trustees of The Ananse Center for Arts and Culture.',
    path: '/trustees',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for The Ananse Center website and community programs.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service for The Ananse Center website.',
    path: '/terms',
  },
  search: {
    title: 'Search',
    description: 'Search The Ananse Center website for programs, events, and resources.',
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
