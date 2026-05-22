import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authRateLimit } from '../../lib/rate-limit-route.js'
import { prisma } from '../../lib/prisma.js'
import { verifyPassword } from '../../lib/password.js'
import { signAdminToken } from '../../lib/jwt.js'
import { authenticateAdmin } from '../../plugins/admin-auth.js'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function adminAuthRoutes(app: FastifyInstance) {
  app.post(
    '/api/v1/admin/auth/login',
    authRateLimit(),
    async (request, reply) => {
    try {
      const parsed = loginSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid email or password' })
      }

      const { email, password } = parsed.data
      const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user || !verifyPassword(password, user.passwordHash)) {
        return reply.status(401).send({ error: 'Invalid email or password' })
      }

      const token = signAdminToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }
    } catch (error) {
      request.log.error(error)
      const message = error instanceof Error ? error.message : 'Login failed'
      if (message.includes('ADMIN_JWT_SECRET')) {
        return reply.status(503).send({
          error: 'Admin login is not configured. Set ADMIN_JWT_SECRET (32+ chars) on the API service.',
        })
      }
      return reply.status(500).send({ error: 'Unable to sign in right now. Try again shortly.' })
    }
    },
  )

  app.get(
    '/api/v1/admin/auth/me',
    { preHandler: [authenticateAdmin] },
    async (request) => {
      return { user: request.admin }
    },
  )
}
