import type { Metadata } from 'next'
import { site } from './site'
import { defaultLocale, type Locale } from './i18n'
import { localizedPath } from './locale-path'
import { absoluteAssetUrl, defaultOgImage } from './og'

const defaultDescription =
  'Preserving heritage, restoring identity, and developing Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.'

export function buildPageMetadata({
  title,
  description = defaultDescription,
  path = '',
  locale = defaultLocale,
  ogImage = defaultOgImage,
}: {
  title: string
  description?: string
  path?: string
  locale?: Locale
  ogImage?: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
  const canonicalPath = localizedPath(path, locale)
  const canonical = siteUrl ? `${siteUrl}${canonicalPath}` : undefined
  const ogUrl = absoluteAssetUrl(ogImage)

  const languages =
    siteUrl && path !== undefined
      ? {
          en: `${siteUrl}${localizedPath(path, 'en')}`,
          fr: `${siteUrl}${localizedPath(path, 'fr')}`,
        }
      : undefined

  return {
    // Root layout already applies `template: '%s | Ananse Center'`.
    title,
    description,
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      alternateLocale: locale === 'fr' ? ['en_GB'] : ['fr_FR'],
      ...(canonical ? { url: canonical } : {}),
      ...(ogUrl.startsWith('http')
        ? {
            images: [
              {
                url: ogUrl,
                width: 1200,
                height: 630,
                alt: `${title} — ${site.shortName}`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
      ...(ogUrl.startsWith('http') ? { images: [ogUrl] } : {}),
    },
    ...(canonical || languages
      ? {
          alternates: {
            ...(canonical ? { canonical } : {}),
            ...(languages ? { languages } : {}),
          },
        }
      : {}),
  }
}
