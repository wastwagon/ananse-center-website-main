import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
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
}
