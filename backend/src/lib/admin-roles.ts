import type { AdminPrincipal } from '../plugins/admin-auth.js'

export const ADMIN_ROLES = ['superadmin', 'admin', 'reviewer', 'editor', 'finance'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

/** Roles that may create and edit the six content types. */
export const CONTENT_EDITOR_ROLES = ['superadmin', 'admin', 'reviewer', 'editor'] as const satisfies readonly AdminRole[]

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
  return role === 'superadmin' || role === 'admin' || role === 'reviewer' || role === 'editor'
}

/** Publish, schedule, archive, or take a public item back down. */
export function canPublishContent(role: AdminRole) {
  return role === 'superadmin' || role === 'admin' || role === 'reviewer'
}

const PUBLISH_STATUSES = new Set(['published', 'scheduled', 'archived'])

/**
 * Editors may prepare drafts and send them to review.
 * They may keep an already-public status while editing copy.
 * They may not publish, schedule, archive, or unpublish.
 */
export function publicationChangeAllowed(
  role: string,
  nextStatus: string | undefined,
  existingStatus?: string | null,
) {
  if (!nextStatus) return true
  if (canPublishContent(normalizeRole(role))) return true
  if (!PUBLISH_STATUSES.has(nextStatus)) {
    return !existingStatus || !PUBLISH_STATUSES.has(existingStatus)
  }
  return nextStatus === existingStatus
}

export function requireRole(admin: AdminPrincipal, allowed: AdminRole[], reply: { status: (code: number) => { send: (body: unknown) => unknown } }) {
  const role = normalizeRole(admin.role)
  if (allowed.includes(role)) return true
  reply.status(403).send({ error: 'Insufficient permissions' })
  return false
}
