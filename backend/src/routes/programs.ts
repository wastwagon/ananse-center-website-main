import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { eventIncludePublic, mapPublicEvent } from '../lib/event-map.js'
import { mapPublicProgram, programIncludeCover } from '../lib/program-map.js'

export async function programRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { section?: string } }>('/api/v1/programs', async (request) => {
    const section = request.query.section?.trim() || undefined

    const programs = await prisma.program.findMany({
      where: {
        published: true,
        ...(section ? { section } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: programIncludeCover,
    })

    return { data: programs.map(mapPublicProgram) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/programs/:slug/events', async (request, reply) => {
    const program = await prisma.program.findFirst({
      where: { slug: request.params.slug, published: true },
      select: { id: true },
    })
    if (!program) {
      return reply.status(404).send({ error: 'Program not found' })
    }
    const events = await prisma.event.findMany({
      where: { published: true, programId: program.id },
      include: eventIncludePublic,
      orderBy: [{ featured: 'desc' }, { startsAt: 'desc' }, { createdAt: 'desc' }],
    })
    return { data: events.map(mapPublicEvent) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/programs/:slug', async (request, reply) => {
    const program = await prisma.program.findFirst({
      where: { slug: request.params.slug, published: true },
      include: programIncludeCover,
    })

    if (!program) {
      return reply.status(404).send({ error: 'Program not found' })
    }

    return { data: mapPublicProgram(program) }
  })
}
