import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminPerson, personIncludeMedia } from '../../lib/person-map.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { INSIGHT_TOPICS, PEOPLE_GROUPS } from '../../lib/taxonomy.js'
import { CONTENT_EDITOR_ROLES } from '../../lib/admin-roles.js'
import {
  denyPublicationChange,
  enteringPublication,
  plainText,
  publishError,
  sharedEntryCreate,
  sharedEntryFieldsSchema,
  sharedEntryWrite,
} from '../../lib/entry-fields.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

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
  expertiseTopics: z.array(z.enum(INSIGHT_TOPICS)).max(13).optional(),
  cohortLabel: z.string().max(80).optional(),
  programIds: z.array(z.string().cuid()).max(10).optional(),
  preferredName: z.string().max(200).optional(),
  fullBio: z.string().max(20000).optional(),
  consentConfirmed: z.boolean().optional(),
  socialLinks: z.string().max(2000).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  photoMediaId: z.string().cuid().optional().nullable(),
  logoMediaId: z.string().cuid().optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
}).merge(sharedEntryFieldsSchema).merge(adminPublicationFieldsSchema)

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
    const nextStatus = parsed.data.publicationStatus ?? (parsed.data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const error = publishError(
        [
          !plainText(parsed.data.bio) ? 'short biography' : '',
          !(parsed.data.groups && parsed.data.groups.length > 0) ? 'at least one ANANSE role' : '',
          !parsed.data.consentConfirmed ? 'publication permission' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name)
    try {
      const row = await prisma.person.create({
        data: {
          name: parsed.data.name,
          slug,
          roleTitle: parsed.data.roleTitle ?? '',
          bio: parsed.data.bio ?? '',
          preferredName: parsed.data.preferredName ?? '',
          fullBio: parsed.data.fullBio ?? '',
          consentConfirmed: parsed.data.consentConfirmed ?? false,
          socialLinks: parsed.data.socialLinks ?? '',
          seoTitle: parsed.data.seoTitle ?? '',
          seoDescription: parsed.data.seoDescription ?? '',
          groups: parsed.data.groups ?? [],
          isOrganization: parsed.data.isOrganization ?? false,
          organizationName: parsed.data.organizationName ?? '',
          websiteUrl: parsed.data.websiteUrl ?? '',
          expertise: parsed.data.expertise ?? '',
          expertiseTopics: parsed.data.expertiseTopics ?? [],
          cohortLabel: parsed.data.cohortLabel ?? '',
          programs: {
            create: (parsed.data.programIds ?? []).map((programId) => ({ programId })),
          },
          photoMediaId: parsed.data.photoMediaId ?? null,
          logoMediaId: parsed.data.logoMediaId ?? null,
          featured: parsed.data.featured ?? false,
          ...publicationCreateDefaults(parsed.data),
          ...sharedEntryCreate(parsed.data),
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
      const existing = await prisma.person.findUnique({ where: { id: request.params.id } })
      if (!existing) return reply.status(404).send({ error: 'Person not found' })
      const nextStatus = data.publicationStatus ?? existing.publicationStatus
      if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
        return
      }
      if (enteringPublication(nextStatus, existing.publicationStatus)) {
        const error = publishError(
          [
            !plainText(data.bio ?? existing.bio) ? 'short biography' : '',
            !((data.groups ?? (existing.groups as string[])).length > 0) ? 'at least one ANANSE role' : '',
            !(data.consentConfirmed ?? existing.consentConfirmed) ? 'publication permission' : '',
          ].filter(Boolean),
        )
        if (error) return reply.status(400).send({ error })
      }
      if (data.slug && data.slug !== existing.slug) {
        const taken = await prisma.person.findUnique({ where: { slug: data.slug } })
        if (taken) return reply.status(409).send({ error: 'A person with this slug already exists' })
        await rememberPathRedirect(`/people/${existing.slug}`, `/people/${data.slug}`)
      }
      const row = await prisma.person.update({
        where: { id: request.params.id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.roleTitle !== undefined ? { roleTitle: data.roleTitle } : {}),
          ...(data.bio !== undefined ? { bio: data.bio } : {}),
          ...(data.preferredName !== undefined ? { preferredName: data.preferredName } : {}),
          ...(data.fullBio !== undefined ? { fullBio: data.fullBio } : {}),
          ...(data.consentConfirmed !== undefined ? { consentConfirmed: data.consentConfirmed } : {}),
          ...(data.socialLinks !== undefined ? { socialLinks: data.socialLinks } : {}),
          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
          ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
          ...(data.groups !== undefined ? { groups: data.groups } : {}),
          ...(data.isOrganization !== undefined ? { isOrganization: data.isOrganization } : {}),
          ...(data.organizationName !== undefined ? { organizationName: data.organizationName } : {}),
          ...(data.websiteUrl !== undefined ? { websiteUrl: data.websiteUrl } : {}),
          ...(data.expertise !== undefined ? { expertise: data.expertise } : {}),
          ...(data.expertiseTopics !== undefined ? { expertiseTopics: data.expertiseTopics } : {}),
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
          ...resolvePublicationWrite(data, existing),
          ...sharedEntryWrite(data),
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
    const existing = await prisma.person.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Person not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.person.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
