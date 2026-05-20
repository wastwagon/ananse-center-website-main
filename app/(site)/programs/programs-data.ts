import type { ApiProgram } from '../../../lib/api'

export const fallbackCatalogPrograms: ApiProgram[] = [
  {
    id: 'fallback-1',
    slug: 'traditional-arts-crafts',
    title: 'Traditional Arts & Crafts',
    category: 'Arts Education',
    section: 'catalog',
    description:
      'Master Adinkra, Kente, pottery, and wood carving with master artisans in Accra and Kumasi.',
    duration: '8 weeks',
    level: 'All levels welcome',
    iconKey: 'Palette',
    features: ['Hands-on workshops', 'Master artisan guidance', 'Cultural context', 'Materials provided'],
    sortOrder: 0,
    coverImageUrl: null,
  },
  {
    id: 'fallback-2',
    slug: 'african-music-rhythm',
    title: 'African Music & Rhythm',
    category: 'Cultural Workshops',
    section: 'catalog',
    description:
      'Explore drumming, vocal traditions, and instruments through community-centered music education.',
    duration: '12 weeks',
    level: 'Beginner to advanced',
    iconKey: 'Music',
    features: ['Drum circles', 'Instrument making', 'Performance opportunities', 'Music theory'],
    sortOrder: 1,
    coverImageUrl: null,
  },
]
