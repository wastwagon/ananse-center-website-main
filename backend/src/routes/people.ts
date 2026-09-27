import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { mapPublicPerson, personIncludeDetail, personIncludeMedia } from '../lib/person-map.js'

type PeopleQuery = {
  group?: string
  featured?: string
}

function buildPeopleWhere(query: PeopleQuery): Prisma.PersonWhereInput {
  const where: Prisma.PersonWhereInput = { published: true }
  if (query.featured === 'true') where.featured = true
  if (query.group?.trim()) {
    where.groups = { array_contains: query.group.trim() }
  }
  return where
}

export async function peopleRoutes(app: FastifyInstance) {
  app.get<{ Querystring: PeopleQuery }>('/api/v1/people', async (request) => {
    const rows = await prisma.person.findMany({
      where: buildPeopleWhere(request.query),
      include: personIncludeMedia,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    })
    return { data: rows.map(mapPublicPerson) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/people/:slug', async (request, reply) => {
    const row = await prisma.person.findFirst({
      where: { slug: request.params.slug, published: true },
      include: personIncludeDetail,
    })
    if (!row) {
      return reply.status(404).send({ error: 'Person not found' })
    }
    return { data: mapPublicPerson(row) }
  })
}
