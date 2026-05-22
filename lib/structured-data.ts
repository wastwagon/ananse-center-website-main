import { site, contact, social } from './site'

export function websiteJsonLd(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: base,
    description: site.tagline,
    inLanguage: ['en', 'fr'],
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: base,
    },
  }
}

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.shortName,
    url: siteUrl,
    description: site.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Accra',
      addressCountry: 'GH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phone,
      email: contact.email,
      contactType: 'customer service',
      areaServed: 'Worldwide',
    },
    sameAs: [social.facebook, social.instagram, social.youtube, social.twitter].filter(Boolean),
  }
}

export function eventJsonLd(
  event: {
    title: string
    description: string
    slug: string
    date: string
    location: string
    image?: string
  },
  siteUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Accra',
        addressCountry: 'GH',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: site.name,
      url: siteUrl,
    },
    image: event.image,
    url: `${siteUrl.replace(/\/$/, '')}/events/${event.slug}`,
  }
}
