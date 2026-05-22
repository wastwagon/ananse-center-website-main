import type { AdminPrincipal } from '../plugins/admin-auth.js'

export const ADMIN_ROLES = ['superadmin', 'admin', 'editor', 'finance'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export function normalizeRole(role: string): AdminRole {
  if (ADMIN_ROLES.includes(role as AdminRole)) return role as AdminRole
  return 'admin'
}

export function canAccessSettings(role: AdminRole) {
  return role === 'superadmin' || role === 'admin'
}

export function canAccessSystem(role: AdminRole) {
  return role === 'superadmin' || role === 'admin'
}

export function canAccessDonations(role: AdminRole) {
  return role === 'superadmin' || role === 'admin' || role === 'finance'
}

export function canManageContent(role: AdminRole) {
  return role === 'superadmin' || role === 'admin' || role === 'editor'
}

export function requireRole(admin: AdminPrincipal, allowed: AdminRole[], reply: { status: (code: number) => { send: (body: unknown) => unknown } }) {
  const role = normalizeRole(admin.role)
  if (allowed.includes(role)) return true
  reply.status(403).send({ error: 'Insufficient permissions' })
  return false
}
