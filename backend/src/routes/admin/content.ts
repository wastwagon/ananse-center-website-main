import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateAdmin } from '../../plugins/admin-auth.js'
import { prisma } from '../../lib/prisma.js'

const blockSchema = z.object({
  key: z.string().min(2).max(120).regex(/^[a-z0-9._-]+$/),
  label: z.string().min(2).max(160),
  section: z.string().min(2).max(80).optional(),
  body: z.string().min(1),
  format: z.enum(['plain', 'markdown']).optional(),
  published: z.boolean().optional(),
})

function mapBlock(block: {
  id: string
  key: string
  label: string
  section: string
  body: string
  format: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: block.id,
    key: block.key,
    label: block.label,
    section: block.section,
    body: block.body,
    format: block.format,
    published: block.published,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  }
}

export async function adminContentRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/content-blocks', guard, async () => {
    const blocks = await prisma.contentBlock.findMany({
      orderBy: [{ section: 'asc' }, { label: 'asc' }],
    })
    return { data: blocks.map(mapBlock) }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/content-blocks/:id', guard, async (request, reply) => {
    const block = await prisma.contentBlock.findUnique({ where: { id: request.params.id } })
    if (!block) return reply.status(404).send({ error: 'Content block not found' })
    return { data: mapBlock(block) }
  })

  app.post('/api/v1/admin/content-blocks', guard, async (request, reply) => {
    const parsed = blockSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const data = parsed.data
    const existing = await prisma.contentBlock.findUnique({ where: { key: data.key } })
    if (existing) {
      return reply.status(409).send({ error: 'A block with this key already exists' })
    }

    const block = await prisma.contentBlock.create({
      data: {
        key: data.key,
        label: data.label,
        section: data.section ?? 'general',
        body: data.body,
        format: data.format ?? 'plain',
        published: data.published ?? true,
      },
    })

    return reply.status(201).send({ data: mapBlock(block) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/content-blocks/:id', guard, async (request, reply) => {
    const parsed = blockSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.contentBlock.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Content block not found' })

    const data = parsed.data
    if (data.key && data.key !== existing.key) {
      const conflict = await prisma.contentBlock.findUnique({ where: { key: data.key } })
      if (conflict) return reply.status(409).send({ error: 'A block with this key already exists' })
    }

    const block = await prisma.contentBlock.update({
      where: { id: existing.id },
      data,
    })

    return { data: mapBlock(block) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/content-blocks/:id', guard, async (request, reply) => {
    const existing = await prisma.contentBlock.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Content block not found' })
    await prisma.contentBlock.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
