import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminPhotoAlbum, photoAlbumIncludeRelations } from '../../lib/photo-album-map.js'
import { PHOTO_COLLECTIONS } from '../../lib/taxonomy.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const albumImageSchema = z.object({
  mediaId: z.string().cuid(),
  caption: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

const photoAlbumSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  description: z.string().max(8000).optional(),
  dateLabel: z.string().max(80).optional(),
  place: z.string().max(200).optional(),
  collection: z.enum(PHOTO_COLLECTIONS).optional(),
  programId: z.string().cuid().optional().nullable(),
  eventId: z.string().cuid().optional().nullable(),
  coverMediaId: z.string().cuid().optional().nullable(),
  images: z.array(albumImageSchema).max(200).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

async function replaceAlbumImages(albumId: string, images: z.infer<typeof albumImageSchema>[]) {
  await prisma.photoAlbumImage.deleteMany({ where: { albumId } })
  if (images.length === 0) return
  await prisma.photoAlbumImage.createMany({
    data: images.map((image, index) => ({
      albumId,
      mediaId: image.mediaId,
      caption: image.caption ?? '',
      sortOrder: image.sortOrder ?? index,
    })),
  })
}

export async function adminPhotoAlbumRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/photo-albums', guard, async () => {
    const rows = await prisma.photoAlbum.findMany({
      include: photoAlbumIncludeRelations,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapAdminPhotoAlbum) }
  })

  app.post('/api/v1/admin/photo-albums', guard, async (request, reply) => {
    const parsed = photoAlbumSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid photo album payload', details: parsed.error.flatten() })
    }
    const slug = parsed.data.slug?.trim() || slugify(parsed.data.title)
    try {
      const row = await prisma.photoAlbum.create({
        data: {
          title: parsed.data.title,
          slug,
          description: parsed.data.description ?? '',
          dateLabel: parsed.data.dateLabel ?? '',
          place: parsed.data.place ?? '',
          collection: parsed.data.collection ?? 'Events',
          programId: parsed.data.programId ?? null,
          eventId: parsed.data.eventId ?? null,
          coverMediaId: parsed.data.coverMediaId ?? null,
          featured: parsed.data.featured ?? false,
          published: parsed.data.published ?? false,
          sortOrder: parsed.data.sortOrder ?? 0,
        },
      })
      if (parsed.data.images?.length) {
        await replaceAlbumImages(row.id, parsed.data.images)
      }
      const withRelations = await prisma.photoAlbum.findUniqueOrThrow({
        where: { id: row.id },
        include: photoAlbumIncludeRelations,
      })
      return reply.status(201).send({ data: mapAdminPhotoAlbum(withRelations) })
    } catch {
      return reply.status(409).send({ error: 'A photo album with this slug already exists' })
    }
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/photo-albums/:id', guard, async (request, reply) => {
    const parsed = photoAlbumSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid photo album payload', details: parsed.error.flatten() })
    }
    try {
      const data = parsed.data
      await prisma.photoAlbum.update({
        where: { id: request.params.id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.dateLabel !== undefined ? { dateLabel: data.dateLabel } : {}),
          ...(data.place !== undefined ? { place: data.place } : {}),
          ...(data.collection !== undefined ? { collection: data.collection } : {}),
          ...(data.programId !== undefined ? { programId: data.programId } : {}),
          ...(data.eventId !== undefined ? { eventId: data.eventId } : {}),
          ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...(data.published !== undefined ? { published: data.published } : {}),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        },
      })
      if (data.images !== undefined) {
        await replaceAlbumImages(request.params.id, data.images)
      }
      const row = await prisma.photoAlbum.findUniqueOrThrow({
        where: { id: request.params.id },
        include: photoAlbumIncludeRelations,
      })
      return { data: mapAdminPhotoAlbum(row) }
    } catch {
      return reply.status(404).send({ error: 'Photo album not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/photo-albums/:id', guard, async (request, reply) => {
    try {
      await prisma.photoAlbum.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'Photo album not found' })
    }
  })
}
