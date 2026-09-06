/** Curated photography — avoids random index assignment across pages */

/** Next/Image sizes for responsive card grids (2 col mobile → 4 col desktop). */
export const cardImageSizes = '(max-width: 639px) 50vw, (max-width: 899px) 50vw, 25vw'

/** Resolve a CMS image path (public file or /api/media/...) with a safe fallback. */
export function resolveCmsImage(path: string | undefined | null, fallback: string): string {
  const trimmed = path?.trim()
  if (!trimmed) return fallback
  return trimmed
}

export const images = {
  hero: {
    home: '/images/image (20).jpeg',
    about: '/images/image (18).jpeg',
    programs: '/images/image (8).jpeg',
    events: '/images/image (10).jpeg',
    contact: '/images/image (1).jpeg',
    support: '/images/image (12).jpeg',
    videos: '/images/image (15).jpeg',
  },
  goals: [
    '/images/image (2).jpeg',
    '/images/image (3).jpeg',
    '/images/image (4).jpeg',
    '/images/image (5).jpeg',
    '/images/image (6).jpeg',
    '/images/image (7).jpeg',
  ],
  programs: [
    '/images/image (8).jpeg',
    '/images/image (9).jpeg',
    '/images/image (10).jpeg',
    '/images/image (11).jpeg',
    '/images/image (12).jpeg',
    '/images/image (13).jpeg',
  ],
  programCatalog: [
    '/images/image (26).jpeg',
    '/images/image (27).jpeg',
    '/images/image (28).jpeg',
    '/images/image (29).jpeg',
    '/images/image (30).jpeg',
    '/images/image (31).jpeg',
  ],
  events: {
    featured: ['/images/image (1).jpeg', '/images/image (3).jpeg', '/images/image (6).jpeg'],
    festival: '/images/image (1).jpeg',
    workshop: '/images/image (2).jpeg',
    retreat: '/images/image (3).jpeg',
    exhibition: '/images/image (4).jpeg',
    symposium: '/images/image (6).jpeg',
  },
  story: '/images/image (14).jpeg',
} as const

export function programImageForOrder(sortOrder: number): string {
  const index = Math.max(0, sortOrder) % images.programCatalog.length
  return images.programCatalog[index]
}

export function resolveEventCoverImage(
  event: { slug: string; coverImageUrl?: string | null },
): string {
  return event.coverImageUrl || eventImageForSlug(event.slug)
}

export function resolveProgramCoverImage(
  program: { sortOrder: number; coverImageUrl?: string | null },
): string {
  return program.coverImageUrl || programImageForOrder(program.sortOrder)
}

export function resolveNewsCoverImage(
  post: { coverImageUrl?: string | null; slug?: string },
  fallbackIndex = 0,
): string {
  if (post.coverImageUrl) return post.coverImageUrl
  const catalog = images.programCatalog.length
    ? images.programCatalog
    : [images.hero.home]
  return catalog[fallbackIndex % catalog.length]
}

export function eventImageForSlug(slug: string): string {
  if (slug.includes('storytelling') || slug.includes('festival') || slug.includes('drumming')) {
    return images.events.festival
  }
  if (slug.includes('kente') || slug.includes('weaving')) return images.events.workshop
  if (slug.includes('diaspora') || slug.includes('retreat')) return images.events.retreat
  if (slug.includes('art') || slug.includes('exhibition')) return images.events.exhibition
  return images.events.symposium
}
