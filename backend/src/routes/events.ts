import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { eventIncludePublic, mapPublicEvent } from '../lib/event-map.js'
import { mediaPublicPath } from '../lib/media-url.js'
import { publicListingWhere, publicVisibilityWhere } from '../lib/publication.js'

async function withGallery(event: ReturnType<typeof mapPublicEvent>) {
  const ids = event.galleryMediaIds ?? []
  if (ids.length === 0) return { ...event, gallery: [] as { url: string; alt: string }[] }
  const assets = await prisma.mediaAsset.findMany({
    where: { id: { in: ids } },
    select: { id: true, altText: true, title: true },
  })
  const byId = new Map(assets.map((asset) => [asset.id, asset]))
  return {
    ...event,
    gallery: ids.map((id) => {
      const asset = byId.get(id)
      return {
        url: mediaPublicPath(id),
        alt: asset?.altText?.trim() || asset?.title?.trim() || event.title,
      }
    }),
  }
}

export async function eventRoutes(app: FastifyInstance) {
  app.get('/api/v1/events', async () => {
    const events = await prisma.event.findMany({
      where: publicListingWhere(),
      orderBy: [{ featured: 'desc' }, { startsAt: 'desc' }, { createdAt: 'desc' }],
      include: eventIncludePublic,
    })

    return { data: events.map(mapPublicEvent) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/events/:slug', async (request, reply) => {
    const event = await prisma.event.findFirst({
      where: { slug: request.params.slug, ...publicVisibilityWhere() },
      include: eventIncludePublic,
    })

    if (!event) {
      return reply.status(404).send({ error: 'Event not found' })
    }

    return { data: await withGallery(mapPublicEvent(event)) }
  })
}
