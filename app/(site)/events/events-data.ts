import type { ApiEvent } from '../../../lib/api'

export const fallbackEvents: ApiEvent[] = [
  {
    id: '1',
    title: 'Ananse Storytelling Festival',
    slug: 'ananse-storytelling-festival',
    description:
      'A celebration of African oral traditions featuring master storytellers, cultural performances, and community workshops.',
    date: 'March 15-17, 2025',
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
    date: 'Every Saturday in April',
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
    date: 'May 10-12, 2025',
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
    date: 'June 1-30, 2025',
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
    date: 'July 20-22, 2025',
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
    date: 'September 5-7, 2025',
    location: 'University of Ghana',
    type: 'Symposium',
    image: '🎓',
    coverImageUrl: null,
    featured: true,
  },
]
