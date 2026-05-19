export const ADMIN_COOKIE = 'ananse_admin_token'

export function getAdminApiUrl() {
  const publicUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4035').replace(/\/+$/, '')
  const internal = process.env.API_INTERNAL_URL?.replace(/\/+$/, '')

  if (internal?.includes('backend:') && process.env.RUNNING_IN_DOCKER === 'true') {
    return internal
  }

  if (internal && !internal.includes('backend:')) {
    return internal
  }

  return publicUrl
}
