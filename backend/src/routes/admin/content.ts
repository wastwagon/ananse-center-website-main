import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  CONTENT_KEYS,
  CONTENT_REGISTRY,
  type ContentRegistryEntry,
  isContentKey,
} from '../../cms/registry.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'

function registryFormat(entry: ContentRegistryEntry): 'plain' | 'markdown' | 'html' {
  return entry.format ?? 'plain'
}

const blockSchema = z.object({
  key: z.string().min(2).max(120).regex(/^[a-z0-9._-]+$/),
  label: z.string().min(2).max(160),
  section: z.string().min(2).max(80).optional(),
  body: z.string().min(1),
  format: z.enum(['plain', 'markdown', 'html']).optional(),
  published: z.boolean().optional(),
})

const editSchema = blockSchema.omit({ key: true }).partial().extend({
  body: z.string().min(1).optional(),
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
  const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

  app.get('/api/v1/admin/content-blocks/registry', guard, async () => {
    return {
      data: CONTENT_KEYS.map((key) => ({
        key,
        ...CONTENT_REGISTRY[key],
      })),
    }
  })

  app.post('/api/v1/admin/content-blocks/sync', guard, async () => {
    let created = 0
    for (const key of CONTENT_KEYS) {
      const entry = CONTENT_REGISTRY[key]
      const existing = await prisma.contentBlock.findUnique({ where: { key } })
      if (existing) continue
      await prisma.contentBlock.create({
        data: {
          key,
          label: entry.label,
          section: entry.section,
          body: entry.defaultBody,
          format: registryFormat(entry),
          published: true,
        },
      })
      created += 1
    }
    return { ok: true, created }
  })

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
    if (!isContentKey(data.key)) {
      return reply.status(400).send({
        error: 'Unknown content key. Use “Sync registry” or pick a key from the CMS registry.',
      })
    }

    const existing = await prisma.contentBlock.findUnique({ where: { key: data.key } })
    if (existing) {
      return reply.status(409).send({ error: 'A block with this key already exists' })
    }

    const entry = CONTENT_REGISTRY[data.key]
    const block = await prisma.contentBlock.create({
      data: {
        key: data.key,
        label: data.label || entry.label,
        section: data.section ?? entry.section,
        body: data.body,
        format: data.format ?? registryFormat(entry),
        published: data.published ?? true,
      },
    })

    return reply.status(201).send({ data: mapBlock(block) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/content-blocks/:id', guard, async (request, reply) => {
    const parsed = editSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.contentBlock.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Content block not found' })

    const data = parsed.data
    const block = await prisma.contentBlock.update({
      where: { id: existing.id },
      data: {
        ...(data.label !== undefined ? { label: data.label } : {}),
        ...(data.section !== undefined ? { section: data.section } : {}),
        ...(data.body !== undefined ? { body: data.body } : {}),
        ...(data.format !== undefined ? { format: data.format } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
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
