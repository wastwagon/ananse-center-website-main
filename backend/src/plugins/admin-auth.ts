import type { FastifyReply, FastifyRequest } from 'fastify'
import { verifyAdminToken } from '../lib/jwt.js'

export type AdminPrincipal = {
  id: string
  email: string
  name: string
  role: string
}

declare module 'fastify' {
  interface FastifyRequest {
    admin?: AdminPrincipal
  }
}

export async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const payload = verifyAdminToken(token)
  if (!payload) {
    return reply.status(401).send({ error: 'Invalid or expired session' })
  }

  request.admin = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  }
}
