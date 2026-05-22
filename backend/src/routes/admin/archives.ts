import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const archiveSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(8000),
  culture: z.string().max(120).optional(),
  era: z.string().max(120).optional(),
  rightsNote: z.string().max(2000).optional(),
  tags: z.array(z.string().max(80)).max(12).optional(),
  mediaUrl: z.string().max(500).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

export async function adminArchiveRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/archives', guard, async () => {
    const rows = await prisma.archiveRecord.findMany({
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    })
    return {
      data: rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        culture: row.culture,
        era: row.era,
        rightsNote: row.rightsNote,
        tags: row.tags,
        mediaUrl: row.mediaUrl,
        published: row.published,
        sortOrder: row.sortOrder,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
    }
  })

  app.post('/api/v1/admin/archives', guard, async (request, reply) => {
    const parsed = archiveSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid archive payload' })
    }
    const row = await prisma.archiveRecord.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        culture: parsed.data.culture ?? '',
        era: parsed.data.era ?? '',
        rightsNote: parsed.data.rightsNote ?? '',
        tags: parsed.data.tags ?? [],
        mediaUrl: parsed.data.mediaUrl ?? '',
        published: parsed.data.published ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    })
    return reply.status(201).send({ data: { id: row.id } })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/archives/:id', guard, async (request, reply) => {
    const parsed = archiveSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid archive payload' })
    }
    try {
      const row = await prisma.archiveRecord.update({
        where: { id: request.params.id },
        data: parsed.data,
      })
      return { data: { id: row.id } }
    } catch {
      return reply.status(404).send({ error: 'Archive record not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/archives/:id', guard, async (request, reply) => {
    try {
      await prisma.archiveRecord.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'Archive record not found' })
    }
  })
}
