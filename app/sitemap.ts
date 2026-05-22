import type { MetadataRoute } from 'next'
import { localizedPath } from '../lib/locale-path'
import { locales } from '../lib/i18n'

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
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (!base) return []

  const now = new Date()

  return staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${localizedPath(path, locale)}`,
      lastModified: now,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1 : 0.8,
    })),
  )
}
