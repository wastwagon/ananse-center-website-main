import type { FastifyReply } from 'fastify'
import { z } from 'zod'
import { normalizeRole, publicationChangeAllowed } from './admin-roles.js'

export const sharedEntryFieldsSchema = z.object({
  keywords: z.string().max(500).optional(),
  noindex: z.boolean().optional(),
  shareMediaId: z.string().cuid().nullable().optional(),
})

export function sharedEntryCreate(data: z.infer<typeof sharedEntryFieldsSchema>) {
  return {
    keywords: data.keywords ?? '',
    noindex: data.noindex ?? false,
    shareMediaId: data.shareMediaId ?? null,
  }
}

export function sharedEntryWrite(data: z.infer<typeof sharedEntryFieldsSchema>) {
  return {
    ...(data.keywords !== undefined ? { keywords: data.keywords } : {}),
    ...(data.noindex !== undefined ? { noindex: data.noindex } : {}),
    ...(data.shareMediaId !== undefined ? { shareMediaId: data.shareMediaId } : {}),
  }
}

export function plainText(value: string | null | undefined) {
  return (value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function isPublicStatus(status: string | null | undefined) {
  return status === 'published' || status === 'scheduled'
}

/** True when this save is the moment an item becomes public. */
export function enteringPublication(nextStatus: string | undefined, existingStatus?: string | null) {
  return isPublicStatus(nextStatus) && !isPublicStatus(existingStatus)
}

export function denyPublicationChange(
  role: string | undefined,
  nextStatus: string | undefined,
  existingStatus: string | null | undefined,
  reply: FastifyReply,
) {
  if (publicationChangeAllowed(normalizeRole(role || 'editor'), nextStatus, existingStatus)) {
    return false
  }
  reply.status(403).send({
    error: 'Only an admin or reviewer can publish, schedule, archive, or unpublish.',
  })
  return true
}

export function publishError(missing: string[]) {
  if (missing.length === 0) return null
  return `Before publication, complete: ${missing.join(', ')}.`
}
