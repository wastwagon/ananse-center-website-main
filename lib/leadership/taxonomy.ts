/** Shared Stage B taxonomies — keep admin + public filters aligned. */

export const INSIGHT_TOPICS = [
  'Leadership',
  'Character',
  'Excellence',
  'Mentorship',
  'Authentic Spirituality',
  'Education',
  'Faith & Life',
  'Marriage & Relationships',
  'Music & Culture',
  'Healthy Living',
  'Africa & Development',
  'Society',
  'Personal Growth',
] as const

export type InsightTopic = (typeof INSIGHT_TOPICS)[number]

/** Insights content types in admin (written forms). Books stay in Library. */
export const INSIGHT_CONTENT_TYPES = [
  'Articles',
  'Essays',
  'Leadership Reflections',
  'Perspectives',
  'Conversations',
  'Special Reflections',
] as const

export type InsightContentType = (typeof INSIGHT_CONTENT_TYPES)[number]

export const PEOPLE_GROUPS = [
  'Leadership',
  'Mentors',
  'Speakers & Faculty',
  'Fellows and Participants',
  'Partners',
] as const

export type PeopleGroup = (typeof PEOPLE_GROUPS)[number]

export const LIBRARY_SHELVES = [
  {
    title: 'Listen',
    key: 'listen' as const,
    items: [
      'Midday Reflection',
      'Leadership Lectures',
      'Excellence Lectures',
      'Sankofa ADR',
      'Interviews & Conversations',
      'Workshops & Seminars',
      'Special Programs',
    ],
  },
  {
    title: 'Watch',
    key: 'watch' as const,
    items: [
      'Leadership Lectures',
      'Excellence Lectures',
      'Public Lectures & Conversations',
      'Conferences & Events',
      'Mentorship Sessions',
      'Interviews',
      'Workshops & Seminars',
      'Special Programs',
    ],
  },
  {
    title: 'Read',
    key: 'read' as const,
    items: [
      'Articles',
      'Essays',
      'Leadership Reflections',
      'Study Materials',
      'Publications',
      'Wisdom Nuggets',
      'Recommended Reading',
    ],
  },
] as const

export const PHOTO_COLLECTIONS = [
  'Events',
  'Lectures',
  'Conferences',
  'Mentorship',
  'People',
  'Community Engagement',
  'Special Programs',
  'Historical Archive',
] as const

export type PhotoCollection = (typeof PHOTO_COLLECTIONS)[number]

export const EVENT_DELIVERY_MODES = ['in_person', 'online', 'hybrid'] as const
export type EventDeliveryMode = (typeof EVENT_DELIVERY_MODES)[number]

export const EVENT_STATUSES = ['scheduled', 'postponed', 'cancelled'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const EVENT_GATHERING_TYPES = [
  'Lecture',
  'Seminar',
  'Workshop',
  'Conference',
  'Conversation',
  'Mentorship',
  'Special Program',
] as const

export function deliveryModeLabel(mode: string): string {
  if (mode === 'online') return 'Online'
  if (mode === 'hybrid') return 'Hybrid'
  return 'In person'
}

export function eventStatusLabel(status: string): string {
  if (status === 'postponed') return 'Postponed'
  if (status === 'cancelled') return 'Cancelled'
  return 'Scheduled'
}
