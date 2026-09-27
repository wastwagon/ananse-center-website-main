import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminPerson, personIncludeMedia } from '../../lib/person-map.js'
import { PEOPLE_GROUPS } from '../../lib/taxonomy.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const personSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  roleTitle: z.string().max(200).optional(),
  bio: z.string().max(20000).optional(),
  groups: z.array(z.enum(PEOPLE_GROUPS)).max(5).optional(),
  isOrganization: z.boolean().optional(),
  organizationName: z.string().max(200).optional(),
  websiteUrl: z.string().max(500).optional(),
  expertise: z.string().max(2000).optional(),
  cohortLabel: z.string().max(80).optional(),
  programIds: z.array(z.string().cuid()).max(10).optional(),
  photoMediaId: z.string().cuid().optional().nullable(),
  logoMediaId: z.string().cuid().optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

export async function adminPeopleRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/people', guard, async () => {
    const rows = await prisma.person.findMany({
      include: personIncludeMedia,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    })
    return { data: rows.map(mapAdminPerson) }
  })

  app.post('/api/v1/admin/people', guard, async (request, reply) => {
    const parsed = personSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid person payload', details: parsed.error.flatten() })
    }
    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
    try {
      const row = await prisma.person.create({
        data: {
          name: parsed.data.name,
          slug,
          roleTitle: parsed.data.roleTitle ?? '',
          bio: parsed.data.bio ?? '',
          groups: parsed.data.groups ?? [],
          isOrganization: parsed.data.isOrganization ?? false,
          organizationName: parsed.data.organizationName ?? '',
          websiteUrl: parsed.data.websiteUrl ?? '',
          expertise: parsed.data.expertise ?? '',
          cohortLabel: parsed.data.cohortLabel ?? '',
          programs: {
            create: (parsed.data.programIds ?? []).map((programId) => ({ programId })),
          },
          photoMediaId: parsed.data.photoMediaId ?? null,
          logoMediaId: parsed.data.logoMediaId ?? null,
          featured: parsed.data.featured ?? false,
          published: parsed.data.published ?? false,
          sortOrder: parsed.data.sortOrder ?? 0,
        },
        include: personIncludeMedia,
      })
      return reply.status(201).send({ data: mapAdminPerson(row) })
    } catch {
      return reply.status(409).send({ error: 'A person with this slug already exists' })
    }
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/people/:id', guard, async (request, reply) => {
    const parsed = personSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid person payload', details: parsed.error.flatten() })
    }
    try {
      const data = parsed.data
      const row = await prisma.person.update({
        where: { id: request.params.id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.roleTitle !== undefined ? { roleTitle: data.roleTitle } : {}),
          ...(data.bio !== undefined ? { bio: data.bio } : {}),
          ...(data.groups !== undefined ? { groups: data.groups } : {}),
          ...(data.isOrganization !== undefined ? { isOrganization: data.isOrganization } : {}),
          ...(data.organizationName !== undefined ? { organizationName: data.organizationName } : {}),
          ...(data.websiteUrl !== undefined ? { websiteUrl: data.websiteUrl } : {}),
          ...(data.expertise !== undefined ? { expertise: data.expertise } : {}),
          ...(data.cohortLabel !== undefined ? { cohortLabel: data.cohortLabel } : {}),
          ...(data.programIds !== undefined
            ? {
                programs: {
                  deleteMany: {},
                  create: data.programIds.map((programId) => ({ programId })),
                },
              }
            : {}),
          ...(data.photoMediaId !== undefined ? { photoMediaId: data.photoMediaId } : {}),
          ...(data.logoMediaId !== undefined ? { logoMediaId: data.logoMediaId } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...(data.published !== undefined ? { published: data.published } : {}),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        },
        include: personIncludeMedia,
      })
      return { data: mapAdminPerson(row) }
    } catch {
      return reply.status(404).send({ error: 'Person not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/people/:id', guard, async (request, reply) => {
    try {
      await prisma.person.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'Person not found' })
    }
  })
}
