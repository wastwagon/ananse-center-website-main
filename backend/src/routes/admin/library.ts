import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { libraryIncludeRelations, mapAdminLibraryItem } from '../../lib/library-map.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { INSIGHT_TOPICS, LIBRARY_SHELF_KEYS } from '../../lib/taxonomy.js'
import { CONTENT_EDITOR_ROLES } from '../../lib/admin-roles.js'
import {
  denyPublicationChange,
  enteringPublication,
  plainText,
  publishError,
  sharedEntryWrite,
} from '../../lib/entry-fields.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

const librarySchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().max(8000).optional(),
  shelf: z.enum(LIBRARY_SHELF_KEYS),
  collection: z.string().min(2).max(120),
  body: z.string().max(50000).optional(),
  transcript: z.string().max(50000).optional(),
  furtherStudy: z.string().max(20000).optional(),
  wisdomNugget: z.string().max(5000).optional(),
  scriptureTheme: z.string().max(500).optional(),
  episodeNumber: z.number().int().positive().optional().nullable(),
  dateLabel: z.string().max(80).optional(),
  originalAt: z.union([z.string().min(1), z.null()]).optional(),
  publishedAt: z.union([z.string().min(1), z.null()]).optional(),
  noindex: z.boolean().optional(),
  shareMediaId: z.string().cuid().nullable().optional(),
  topics: z.array(z.enum(INSIGHT_TOPICS)).max(13).optional(),
  keywords: z.string().max(500).optional(),
  programId: z.string().cuid().optional().nullable(),
  eventId: z.string().cuid().optional().nullable(),
  personId: z.string().cuid().optional().nullable(),
  newsPostId: z.string().cuid().optional().nullable(),
  coverMediaId: z.string().cuid().optional().nullable(),
  audioMediaId: z.string().cuid().optional().nullable(),
  videoMediaId: z.string().cuid().optional().nullable(),
  downloadMediaId: z.string().cuid().optional().nullable(),
  audioUrl: z.string().max(500).optional(),
  downloadUrl: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
  duration: z.string().max(40).optional(),
  rightsNote: z.string().max(500).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
}).merge(adminPublicationFieldsSchema)

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function adminLibraryRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/library', guard, async () => {
    const rows = await prisma.libraryItem.findMany({
      include: libraryIncludeRelations,
      orderBy: [{ shelf: 'asc' }, { featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapAdminLibraryItem) }
  })

  app.post('/api/v1/admin/library', guard, async (request, reply) => {
    const parsed = librarySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid library payload', details: parsed.error.flatten() })
    }
    const nextStatus = parsed.data.publicationStatus ?? (parsed.data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const hasMedia = Boolean(
        plainText(parsed.data.body) ||
          plainText(parsed.data.transcript) ||
          parsed.data.audioUrl?.trim() ||
          parsed.data.videoUrl?.trim() ||
          parsed.data.downloadUrl?.trim() ||
          parsed.data.audioMediaId ||
          parsed.data.videoMediaId ||
          parsed.data.downloadMediaId,
      )
      const error = publishError(
        [
          !plainText(parsed.data.description) ? 'short description' : '',
          !(parsed.data.topics && parsed.data.topics.length > 0) ? 'at least one topic' : '',
          !hasMedia ? 'a file, embed, transcript, or body' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    const slug = parsed.data.slug?.trim() || slugify(parsed.data.title)
    try {
      const row = await prisma.libraryItem.create({
        data: {
          title: parsed.data.title,
          slug,
          description: parsed.data.description ?? '',
          shelf: parsed.data.shelf,
          collection: parsed.data.collection,
          body: parsed.data.body ?? '',
          transcript: parsed.data.transcript ?? '',
          furtherStudy: parsed.data.furtherStudy ?? '',
          wisdomNugget: parsed.data.wisdomNugget ?? '',
          scriptureTheme: parsed.data.scriptureTheme ?? '',
          episodeNumber: parsed.data.episodeNumber ?? null,
          dateLabel: parsed.data.dateLabel ?? '',
          originalAt: parseOptionalDate(parsed.data.originalAt) ?? null,
          publishedAt: parseOptionalDate(parsed.data.publishedAt) ?? null,
          noindex: parsed.data.noindex ?? false,
          shareMediaId: parsed.data.shareMediaId ?? null,
          topics: parsed.data.topics ?? [],
          keywords: parsed.data.keywords ?? '',
          programId: parsed.data.programId ?? null,
          eventId: parsed.data.eventId ?? null,
          personId: parsed.data.personId ?? null,
          newsPostId: parsed.data.newsPostId ?? null,
          coverMediaId: parsed.data.coverMediaId ?? null,
          audioMediaId: parsed.data.audioMediaId ?? null,
          videoMediaId: parsed.data.videoMediaId ?? null,
          downloadMediaId: parsed.data.downloadMediaId ?? null,
          audioUrl: parsed.data.audioUrl ?? '',
          videoUrl: parsed.data.videoUrl ?? '',
          downloadUrl: parsed.data.downloadUrl ?? '',
          duration: parsed.data.duration ?? '',
          rightsNote: parsed.data.rightsNote ?? '',
          seoTitle: parsed.data.seoTitle ?? '',
          seoDescription: parsed.data.seoDescription ?? '',
          featured: parsed.data.featured ?? false,
          ...publicationCreateDefaults(parsed.data),
          sortOrder: parsed.data.sortOrder ?? 0,
        },
        include: libraryIncludeRelations,
      })
      return reply.status(201).send({ data: mapAdminLibraryItem(row) })
    } catch {
      return reply.status(409).send({ error: 'A library item with this slug already exists' })
    }
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/library/:id', guard, async (request, reply) => {
    const parsed = librarySchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid library payload', details: parsed.error.flatten() })
    }
    try {
      const data = parsed.data
      const existing = await prisma.libraryItem.findUnique({ where: { id: request.params.id } })
      if (!existing) return reply.status(404).send({ error: 'Library item not found' })
      const nextStatus = data.publicationStatus ?? existing.publicationStatus
      if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
        return
      }
      if (enteringPublication(nextStatus, existing.publicationStatus)) {
        const description = data.description ?? existing.description
        const topics = data.topics ?? existing.topics
        const topicList = Array.isArray(topics) ? topics : []
        const hasMedia = Boolean(
          plainText(data.body ?? existing.body ?? '') ||
            plainText(data.transcript ?? existing.transcript ?? '') ||
            (data.audioUrl ?? existing.audioUrl)?.trim() ||
            (data.videoUrl ?? existing.videoUrl)?.trim() ||
            (data.downloadUrl ?? existing.downloadUrl)?.trim() ||
            data.audioMediaId ||
            existing.audioMediaId ||
            data.videoMediaId ||
            existing.videoMediaId ||
            data.downloadMediaId ||
            existing.downloadMediaId,
        )
        const error = publishError(
          [
            !plainText(description) ? 'short description' : '',
            topicList.length === 0 ? 'at least one topic' : '',
            !hasMedia ? 'a file, embed, transcript, or body' : '',
          ].filter(Boolean),
        )
        if (error) return reply.status(400).send({ error })
      }
      if (data.slug && data.slug !== existing.slug) {
        const taken = await prisma.libraryItem.findUnique({ where: { slug: data.slug } })
        if (taken) return reply.status(409).send({ error: 'A library item with this slug already exists' })
        await rememberPathRedirect(`/library/${existing.slug}`, `/library/${data.slug}`)
      }
      const row = await prisma.libraryItem.update({
        where: { id: request.params.id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.shelf !== undefined ? { shelf: data.shelf } : {}),
          ...(data.collection !== undefined ? { collection: data.collection } : {}),
          ...(data.body !== undefined ? { body: data.body } : {}),
          ...(data.transcript !== undefined ? { transcript: data.transcript } : {}),
          ...(data.furtherStudy !== undefined ? { furtherStudy: data.furtherStudy } : {}),
          ...(data.wisdomNugget !== undefined ? { wisdomNugget: data.wisdomNugget } : {}),
          ...(data.scriptureTheme !== undefined ? { scriptureTheme: data.scriptureTheme } : {}),
          ...(data.episodeNumber !== undefined ? { episodeNumber: data.episodeNumber } : {}),
          ...(data.dateLabel !== undefined ? { dateLabel: data.dateLabel } : {}),
          ...(data.originalAt !== undefined
            ? { originalAt: parseOptionalDate(data.originalAt) ?? null }
            : {}),
          ...(data.publishedAt !== undefined
            ? { publishedAt: parseOptionalDate(data.publishedAt) ?? null }
            : {}),
          ...sharedEntryWrite(data),
          ...(data.topics !== undefined ? { topics: data.topics } : {}),
          ...(data.keywords !== undefined ? { keywords: data.keywords } : {}),
          ...(data.programId !== undefined ? { programId: data.programId } : {}),
          ...(data.eventId !== undefined ? { eventId: data.eventId } : {}),
          ...(data.personId !== undefined ? { personId: data.personId } : {}),
          ...(data.newsPostId !== undefined ? { newsPostId: data.newsPostId } : {}),
          ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
          ...(data.audioMediaId !== undefined ? { audioMediaId: data.audioMediaId } : {}),
          ...(data.videoMediaId !== undefined ? { videoMediaId: data.videoMediaId } : {}),
          ...(data.downloadMediaId !== undefined ? { downloadMediaId: data.downloadMediaId } : {}),
          ...(data.audioUrl !== undefined ? { audioUrl: data.audioUrl } : {}),
          ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
          ...(data.downloadUrl !== undefined ? { downloadUrl: data.downloadUrl } : {}),
          ...(data.duration !== undefined ? { duration: data.duration } : {}),
          ...(data.rightsNote !== undefined ? { rightsNote: data.rightsNote } : {}),
          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
          ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...resolvePublicationWrite(data, existing),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        },
        include: libraryIncludeRelations,
      })
      return { data: mapAdminLibraryItem(row) }
    } catch {
      return reply.status(404).send({ error: 'Library item not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/library/:id', guard, async (request, reply) => {
    const existing = await prisma.libraryItem.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Library item not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.libraryItem.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
