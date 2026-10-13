import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminPhotoAlbum, photoAlbumIncludeRelations } from '../../lib/photo-album-map.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { PHOTO_COLLECTIONS } from '../../lib/taxonomy.js'
import { CONTENT_EDITOR_ROLES } from '../../lib/admin-roles.js'
import {
  denyPublicationChange,
  enteringPublication,
  plainText,
  publishError,
  sharedEntryCreate,
  sharedEntryFieldsSchema,
  sharedEntryWrite,
} from '../../lib/entry-fields.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

const albumImageSchema = z.object({
  mediaId: z.string().cuid(),
  caption: z.string().max(500).optional(),
  altText: z.string().max(300).optional(),
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
  photographer: z.string().max(200).optional(),
  rightsNote: z.string().max(500).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  images: z.array(albumImageSchema).max(200).optional(),
  personIds: z.array(z.string().cuid()).max(40).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
}).merge(sharedEntryFieldsSchema).merge(adminPublicationFieldsSchema)

async function replaceAlbumPeople(albumId: string, personIds: string[]) {
  await prisma.photoAlbumPerson.deleteMany({ where: { albumId } })
  if (personIds.length === 0) return
  await prisma.photoAlbumPerson.createMany({
    data: personIds.map((personId) => ({ albumId, personId })),
  })
}

async function replaceAlbumImages(albumId: string, images: z.infer<typeof albumImageSchema>[]) {
  await prisma.photoAlbumImage.deleteMany({ where: { albumId } })
  if (images.length === 0) return
  await prisma.photoAlbumImage.createMany({
    data: images.map((image, index) => ({
      albumId,
      mediaId: image.mediaId,
      caption: image.caption ?? '',
      altText: image.altText ?? '',
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
    const nextStatus = parsed.data.publicationStatus ?? (parsed.data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const error = publishError(
        [
          !(parsed.data.images && parsed.data.images.length > 0) ? 'at least one photograph' : '',
          !parsed.data.rightsNote?.trim() ? 'rights note' : '',
          !plainText(parsed.data.description) ? 'short description' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
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
          photographer: parsed.data.photographer ?? '',
          rightsNote: parsed.data.rightsNote ?? '',
          seoTitle: parsed.data.seoTitle ?? '',
          seoDescription: parsed.data.seoDescription ?? '',
          featured: parsed.data.featured ?? false,
          ...publicationCreateDefaults(parsed.data),
          ...sharedEntryCreate(parsed.data),
          sortOrder: parsed.data.sortOrder ?? 0,
        },
      })
      if (parsed.data.personIds !== undefined) {
        await replaceAlbumPeople(row.id, parsed.data.personIds)
      }
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
      const existing = await prisma.photoAlbum.findUnique({ where: { id: request.params.id } })
      if (!existing) return reply.status(404).send({ error: 'Photo album not found' })
      const nextStatus = data.publicationStatus ?? existing.publicationStatus
      if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
        return
      }
      if (enteringPublication(nextStatus, existing.publicationStatus)) {
        const imageCount = data.images?.length ?? (await prisma.photoAlbumImage.count({ where: { albumId: existing.id } }))
        const error = publishError(
          [
            imageCount < 1 ? 'at least one photograph' : '',
            !(data.rightsNote ?? existing.rightsNote).trim() ? 'rights note' : '',
            !plainText(data.description ?? existing.description) ? 'short description' : '',
          ].filter(Boolean),
        )
        if (error) return reply.status(400).send({ error })
      }
      if (data.slug && data.slug !== existing.slug) {
        const taken = await prisma.photoAlbum.findUnique({ where: { slug: data.slug } })
        if (taken) return reply.status(409).send({ error: 'A photo album with this slug already exists' })
        await rememberPathRedirect(
          `/library/photo-gallery/${existing.slug}`,
          `/library/photo-gallery/${data.slug}`,
        )
      }
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
          ...(data.photographer !== undefined ? { photographer: data.photographer } : {}),
          ...(data.rightsNote !== undefined ? { rightsNote: data.rightsNote } : {}),
          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
          ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...resolvePublicationWrite(data, existing),
          ...sharedEntryWrite(data),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        },
      })
      if (data.personIds !== undefined) {
        await replaceAlbumPeople(request.params.id, data.personIds)
      }
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
    const existing = await prisma.photoAlbum.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Photo album not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.photoAlbum.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
