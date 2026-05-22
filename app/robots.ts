import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const blockIndexing = process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === 'true'

  if (blockIndexing) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  if (!base) {
    return { rules: { userAgent: '*', allow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
