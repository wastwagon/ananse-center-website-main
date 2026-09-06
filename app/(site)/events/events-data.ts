import type { ApiEvent } from '../../../lib/api'

export const fallbackEvents: ApiEvent[] = [
  {
    id: '1',
    title: 'Ananse Storytelling Festival',
    slug: 'ananse-storytelling-festival',
    description:
      'A celebration of African oral traditions featuring master storytellers, cultural performances, and community workshops.',
    date: 'August 15-17, 2026',
    location: 'Accra, Ghana',
    type: 'Festival',
    image: '🎭',
    coverImageUrl: null,
    featured: true,
  },
  {
    id: '2',
    title: 'Kente Weaving Workshop Series',
    slug: 'kente-weaving-workshop-series',
    description:
      'Learn the ancient art of Kente weaving from master weavers in this hands-on workshop series.',
    date: 'Every Saturday in September',
    location: 'Kumasi, Ghana',
    type: 'Workshop',
    image: '🧵',
    coverImageUrl: null,
    featured: false,
  },
  {
    id: '3',
    title: 'Diaspora Reconnection Retreat',
    slug: 'diaspora-reconnection-retreat',
    description:
      'A transformative retreat for members of the African diaspora seeking to reconnect with their heritage.',
    date: 'October 10-12, 2026',
    location: 'Cape Coast, Ghana',
    type: 'Retreat',
    image: '🌿',
    coverImageUrl: null,
    featured: true,
  },
  {
    id: '4',
    title: 'Contemporary African Art Exhibition',
    slug: 'contemporary-african-art-exhibition',
    description:
      'Showcasing the work of emerging and established African artists exploring themes of identity and heritage.',
    date: 'November 1-30, 2026',
    location: 'Accra Arts Center',
    type: 'Exhibition',
    image: '🖼️',
    coverImageUrl: null,
    featured: false,
  },
  {
    id: '5',
    title: 'Traditional Drumming & Dance Festival',
    slug: 'traditional-drumming-dance-festival',
    description:
      'Experience the power and beauty of traditional African drumming and dance in this vibrant festival.',
    date: 'December 5-7, 2026',
    location: 'Tamale, Ghana',
    type: 'Festival',
    image: '🥁',
    coverImageUrl: null,
    featured: false,
  },
  {
    id: '6',
    title: 'Cultural Heritage Symposium',
    slug: 'cultural-heritage-symposium',
    description:
      'Academic and community discussions on preserving and celebrating African cultural heritage.',
    date: 'February 20-22, 2027',
    location: 'University of Ghana',
    type: 'Symposium',
    image: '🎓',
    coverImageUrl: null,
    featured: true,
  },
]
