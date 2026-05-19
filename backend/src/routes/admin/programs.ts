import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { parseFeatures } from '../../lib/program-map.js'
import { authenticateAdmin } from '../../plugins/admin-auth.js'

const programBodySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  category: z.string().min(2).max(120),
  section: z.enum(['catalog', 'sankofa']).optional(),
  duration: z.string().max(80).optional(),
  level: z.string().max(120).optional(),
  iconKey: z.string().min(2).max(40).optional(),
  features: z.array(z.string().min(1)).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  published: z.boolean().optional(),
  slug: z.string().min(2).max(200).optional(),
})

function mapProgram(program: {
  id: string
  title: string
  slug: string
  description: string
  category: string
  section: string
  duration: string
  level: string
  iconKey: string
  features: unknown
  sortOrder: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: program.id,
    title: program.title,
    slug: program.slug,
    description: program.description,
    category: program.category,
    section: program.section,
    duration: program.duration,
    level: program.level,
    iconKey: program.iconKey,
    features: parseFeatures(program.features),
    sortOrder: program.sortOrder,
    published: program.published,
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  }
}

export async function adminProgramRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/programs', guard, async () => {
    const programs = await prisma.program.findMany({
      orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
    })
    return { data: programs.map(mapProgram) }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const program = await prisma.program.findUnique({ where: { id: request.params.id } })
    if (!program) return reply.status(404).send({ error: 'Program not found' })
    return { data: mapProgram(program) }
  })

  app.post('/api/v1/admin/programs', guard, async (request, reply) => {
    const parsed = programBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const data = parsed.data
    const slug = data.slug?.trim() || slugify(data.title)
    const existing = await prisma.program.findUnique({ where: { slug } })
    if (existing) {
      return reply.status(409).send({ error: 'A program with this slug already exists' })
    }

    const program = await prisma.program.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        section: data.section ?? 'catalog',
        duration: data.duration ?? '',
        level: data.level ?? '',
        iconKey: data.iconKey ?? 'BookOpen',
        features: data.features ?? [],
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      },
    })

    return reply.status(201).send({ data: mapProgram(program) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const parsed = programBodySchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.program.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Program not found' })

    const data = parsed.data
    let slug = existing.slug
    if (data.slug && data.slug !== existing.slug) {
      const taken = await prisma.program.findUnique({ where: { slug: data.slug } })
      if (taken) return reply.status(409).send({ error: 'A program with this slug already exists' })
      slug = data.slug
    } else if (data.title && data.title !== existing.title && !data.slug) {
      const nextSlug = slugify(data.title)
      const taken = await prisma.program.findUnique({ where: { slug: nextSlug } })
      if (!taken || taken.id === existing.id) slug = nextSlug
    }

    const program = await prisma.program.update({
      where: { id: existing.id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        slug,
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.section !== undefined ? { section: data.section } : {}),
        ...(data.duration !== undefined ? { duration: data.duration } : {}),
        ...(data.level !== undefined ? { level: data.level } : {}),
        ...(data.iconKey !== undefined ? { iconKey: data.iconKey } : {}),
        ...(data.features !== undefined ? { features: data.features } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
    })

    return { data: mapProgram(program) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const existing = await prisma.program.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Program not found' })
    await prisma.program.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
