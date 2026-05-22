import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { hashPassword } from '../../lib/password.js'
import { ADMIN_ROLES } from '../../lib/admin-roles.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const listGuard = { preHandler: [withAdminRoles(['superadmin', 'admin'])] }
const manageGuard = { preHandler: [withAdminRoles(['superadmin'])] }

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(120),
  name: z.string().min(2).max(120),
  role: z.enum(ADMIN_ROLES).optional(),
})

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  password: z.string().min(8).max(120).optional(),
})

function mapUser(user: {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

export async function adminUserRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/users', listGuard, async () => {
    const users = await prisma.adminUser.findMany({
      orderBy: { email: 'asc' },
    })
    return { data: users.map(mapUser) }
  })

  app.post('/api/v1/admin/users', manageGuard, async (request, reply) => {
    const parsed = createSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid user payload' })
    }

    const email = parsed.data.email.toLowerCase()
    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'Email already in use' })
    }

    const user = await prisma.adminUser.create({
      data: {
        email,
        name: parsed.data.name.trim(),
        role: parsed.data.role ?? 'editor',
        passwordHash: hashPassword(parsed.data.password),
      },
    })

    return reply.status(201).send({ data: mapUser(user) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/users/:id', manageGuard, async (request, reply) => {
    const parsed = patchSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid user payload' })
    }

    const data: { name?: string; role?: string; passwordHash?: string } = {}
    if (parsed.data.name) data.name = parsed.data.name
    if (parsed.data.role) data.role = parsed.data.role
    if (parsed.data.password) data.passwordHash = hashPassword(parsed.data.password)

    if (Object.keys(data).length === 0) {
      return reply.status(400).send({ error: 'No fields to update' })
    }

    try {
      const user = await prisma.adminUser.update({
        where: { id: request.params.id },
        data,
      })
      return { data: mapUser(user) }
    } catch {
      return reply.status(404).send({ error: 'User not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/users/:id', manageGuard, async (request, reply) => {
    if (request.admin?.id === request.params.id) {
      return reply.status(400).send({ error: 'You cannot delete your own account' })
    }

    try {
      await prisma.adminUser.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'User not found' })
    }
  })
}
