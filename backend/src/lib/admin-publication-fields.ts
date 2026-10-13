import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import {
  publicationStatusSchema,
  publishedFromStatus,
  type PublicationStatus,
} from './publication.js'
import { relatedOverridesSchema } from './related-overrides.js'

export const adminPublicationFieldsSchema = z.object({
  publicationStatus: publicationStatusSchema.optional(),
  scheduledAt: z.union([z.string().min(1), z.null()]).optional(),
  relatedPinned: relatedOverridesSchema.optional(),
  relatedHidden: relatedOverridesSchema.optional(),
  published: z.boolean().optional(),
})

function parseScheduledAt(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Resolve create/update fields for publication workflow + related overrides. */
export function resolvePublicationWrite(
  data: z.infer<typeof adminPublicationFieldsSchema>,
  existing?: {
    publicationStatus?: string
    scheduledAt?: Date | null
    published?: boolean
  },
) {
  const status = (data.publicationStatus ??
    existing?.publicationStatus ??
    (existing?.published ? 'published' : 'draft')) as PublicationStatus

  const scheduledAt =
    data.scheduledAt !== undefined
      ? parseScheduledAt(data.scheduledAt) ?? null
      : existing?.scheduledAt ?? null

  const published =
    data.publicationStatus !== undefined || data.scheduledAt !== undefined
      ? publishedFromStatus(status, scheduledAt)
      : data.published !== undefined
        ? data.published
        : undefined

  const publicationStatus =
    data.publicationStatus !== undefined
      ? data.publicationStatus
      : data.published !== undefined
        ? data.published
          ? 'published'
          : existing?.publicationStatus === 'archived'
            ? 'archived'
            : 'draft'
        : undefined

  return {
    ...(publicationStatus !== undefined ? { publicationStatus } : {}),
    ...(data.scheduledAt !== undefined ? { scheduledAt } : {}),
    ...(published !== undefined ? { published } : {}),
    ...(data.relatedPinned !== undefined
      ? { relatedPinned: data.relatedPinned as Prisma.InputJsonValue }
      : {}),
    ...(data.relatedHidden !== undefined
      ? { relatedHidden: data.relatedHidden as Prisma.InputJsonValue }
      : {}),
  }
}

/** Defaults for create when status omitted. */
export function publicationCreateDefaults(
  data: z.infer<typeof adminPublicationFieldsSchema>,
) {
  const status = (data.publicationStatus ??
    (data.published === false ? 'draft' : 'published')) as PublicationStatus
  const scheduledAt = parseScheduledAt(data.scheduledAt) ?? null
  return {
    publicationStatus: status,
    scheduledAt,
    published: publishedFromStatus(status, scheduledAt),
    relatedPinned: (data.relatedPinned ?? {}) as Prisma.InputJsonValue,
    relatedHidden: (data.relatedHidden ?? {}) as Prisma.InputJsonValue,
  }
}
