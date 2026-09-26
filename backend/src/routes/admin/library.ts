import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { libraryIncludeRelations, mapAdminLibraryItem } from '../../lib/library-map.js'
import { INSIGHT_TOPICS, LIBRARY_SHELF_KEYS } from '../../lib/taxonomy.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

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
  publishedAt: z.union([z.string().min(1), z.null()]).optional(),
  topics: z.array(z.enum(INSIGHT_TOPICS)).max(13).optional(),
  programId: z.string().cuid().optional().nullable(),
  personId: z.string().cuid().optional().nullable(),
  newsPostId: z.string().cuid().optional().nullable(),
  coverMediaId: z.string().cuid().optional().nullable(),
  audioMediaId: z.string().cuid().optional().nullable(),
  videoMediaId: z.string().cuid().optional().nullable(),
  audioUrl: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

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
          publishedAt: parseOptionalDate(parsed.data.publishedAt) ?? null,
          topics: parsed.data.topics ?? [],
          programId: parsed.data.programId ?? null,
          personId: parsed.data.personId ?? null,
          newsPostId: parsed.data.newsPostId ?? null,
          coverMediaId: parsed.data.coverMediaId ?? null,
          audioMediaId: parsed.data.audioMediaId ?? null,
          videoMediaId: parsed.data.videoMediaId ?? null,
          audioUrl: parsed.data.audioUrl ?? '',
          videoUrl: parsed.data.videoUrl ?? '',
          featured: parsed.data.featured ?? false,
          published: parsed.data.published ?? false,
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
          ...(data.publishedAt !== undefined
            ? { publishedAt: parseOptionalDate(data.publishedAt) ?? null }
            : {}),
          ...(data.topics !== undefined ? { topics: data.topics } : {}),
          ...(data.programId !== undefined ? { programId: data.programId } : {}),
          ...(data.personId !== undefined ? { personId: data.personId } : {}),
          ...(data.newsPostId !== undefined ? { newsPostId: data.newsPostId } : {}),
          ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
          ...(data.audioMediaId !== undefined ? { audioMediaId: data.audioMediaId } : {}),
          ...(data.videoMediaId !== undefined ? { videoMediaId: data.videoMediaId } : {}),
          ...(data.audioUrl !== undefined ? { audioUrl: data.audioUrl } : {}),
          ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...(data.published !== undefined ? { published: data.published } : {}),
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
    try {
      await prisma.libraryItem.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'Library item not found' })
    }
  })
}
