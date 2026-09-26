import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { mapPublicPhotoAlbum, photoAlbumIncludeRelations } from '../lib/photo-album-map.js'

type PhotoAlbumQuery = {
  collection?: string
  featured?: string
  program?: string
  event?: string
}

function buildPhotoAlbumWhere(query: PhotoAlbumQuery): Prisma.PhotoAlbumWhereInput {
  const where: Prisma.PhotoAlbumWhereInput = { published: true }
  if (query.collection?.trim()) where.collection = query.collection.trim()
  if (query.featured === 'true') where.featured = true
  if (query.program?.trim()) {
    where.program = { slug: query.program.trim() }
  }
  if (query.event?.trim()) {
    where.event = { slug: query.event.trim() }
  }
  return where
}

export async function photoAlbumRoutes(app: FastifyInstance) {
  app.get<{ Querystring: PhotoAlbumQuery }>('/api/v1/photo-albums', async (request) => {
    const rows = await prisma.photoAlbum.findMany({
      where: buildPhotoAlbumWhere(request.query),
      include: photoAlbumIncludeRelations,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapPublicPhotoAlbum) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/photo-albums/:slug', async (request, reply) => {
    const row = await prisma.photoAlbum.findFirst({
      where: { slug: request.params.slug, published: true },
      include: photoAlbumIncludeRelations,
    })
    if (!row) {
      return reply.status(404).send({ error: 'Photo album not found' })
    }
    return { data: mapPublicPhotoAlbum(row) }
  })
}
