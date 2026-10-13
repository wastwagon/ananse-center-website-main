import { z } from 'zod'

export const PUBLICATION_STATUSES = [
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived',
] as const

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number]

export const publicationStatusSchema = z.enum(PUBLICATION_STATUSES)

/** Keep the legacy `published` flag aligned with workflow status. */
export function publishedFromStatus(
  status: PublicationStatus | string | undefined,
  scheduledAt?: Date | string | null,
  now = new Date(),
) {
  const value = (status || 'draft') as PublicationStatus
  if (value === 'published') return true
  if (value === 'scheduled' && scheduledAt) {
    const when = typeof scheduledAt === 'string' ? new Date(scheduledAt) : scheduledAt
    return !Number.isNaN(when.getTime()) && when.getTime() <= now.getTime()
  }
  return false
}

/** Prisma filter for records visitors may see. */
export function publicVisibilityWhere(now = new Date()) {
  return {
    OR: [
      { publicationStatus: 'published' },
      { publicationStatus: 'scheduled', scheduledAt: { lte: now } },
    ],
  }
}

/** Catalog/list/search: visible and discoverable (excludes noindex). */
export function publicListingWhere(now = new Date()) {
  return {
    AND: [publicVisibilityWhere(now), { noindex: false }],
  }
}

export function statusFromPublished(published: boolean): PublicationStatus {
  return published ? 'published' : 'draft'
}

/** True when a related record should appear on public payloads. */
export function isPubliclyVisible(row: {
  published?: boolean
  publicationStatus?: string | null
  scheduledAt?: Date | string | null
}, now = new Date()) {
  const status = row.publicationStatus || statusFromPublished(Boolean(row.published))
  if (status === 'published') return true
  if (status === 'scheduled' && row.scheduledAt) {
    const when = typeof row.scheduledAt === 'string' ? new Date(row.scheduledAt) : row.scheduledAt
    return !Number.isNaN(when.getTime()) && when.getTime() <= now.getTime()
  }
  return false
}

/** Flip due scheduled rows to published (keeps admin badges / dashboard in sync). */
export async function promoteDueScheduledContent(
  db: {
    program: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
    event: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
    person: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
    libraryItem: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
    photoAlbum: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
    newsPost: { updateMany: (args: { where: object; data: object }) => Promise<{ count: number }> }
  },
  now = new Date(),
) {
  const where = {
    publicationStatus: 'scheduled',
    scheduledAt: { lte: now },
  }
  const data = { publicationStatus: 'published' as const, published: true }
  const results = await Promise.all([
    db.program.updateMany({ where, data }),
    db.event.updateMany({ where, data }),
    db.person.updateMany({ where, data }),
    db.libraryItem.updateMany({ where, data }),
    db.photoAlbum.updateMany({ where, data }),
    db.newsPost.updateMany({ where, data }),
  ])
  return results.reduce((sum, row) => sum + row.count, 0)
}
