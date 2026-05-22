import type { MetadataRoute } from 'next'
import { localizedPath } from '../lib/locale-path'
import { locales } from '../lib/i18n'
import { getServerApiUrl } from '../lib/server-api-url'

const staticPaths = [
  '/',
  '/about',
  '/programs',
  '/events',
  '/videos',
  '/support',
  '/contact',
  '/privacy',
  '/terms',
  '/visit',
  '/repatriation',
  '/trustees',
  '/transparency',
  '/admissions',
  '/community',
  '/resources',
  '/archives',
  '/news',
  '/search',
  '/partnerships',
] as const

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const response = await fetch(`${getServerApiUrl()}${endpoint}`, {
      next: { revalidate: 3600 },
    })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: { slug: string }[] }
    return payload.data.map((row) => row.slug)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (!base) return []

  const now = new Date()
  const [eventSlugs, programSlugs] = await Promise.all([
    fetchSlugs('/api/v1/events'),
    fetchSlugs('/api/v1/programs'),
  ])

  const paths = [
    ...staticPaths,
    ...eventSlugs.map((slug) => `/events/${slug}` as const),
    ...programSlugs.map((slug) => `/programs/${slug}` as const),
  ]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${localizedPath(path, locale)}`,
      lastModified: now,
      changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : path.startsWith('/events/') ? 0.7 : 0.8,
    })),
  )
}
