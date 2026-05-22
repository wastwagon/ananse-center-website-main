import type { FastifyReply, FastifyRequest } from 'fastify'
import { ADMIN_ROLES, normalizeRole, type AdminRole } from '../lib/admin-roles.js'
import { authenticateAdmin } from './admin-auth.js'

export function withAdminRoles(allowed: readonly AdminRole[]) {
  return async function adminRoleGuard(request: FastifyRequest, reply: FastifyReply) {
    await authenticateAdmin(request, reply)
    if (reply.sent || !request.admin) return

    const role = normalizeRole(request.admin.role)
    if (!allowed.includes(role)) {
      reply.status(403).send({ error: 'Insufficient permissions' })
    }
  }
}

/** Routes any authenticated admin role can access (legacy `admin` included). */
export const anyAdminRole = ADMIN_ROLES
