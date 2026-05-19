import { getServerApiUrl } from './server-api-url'

export const ADMIN_COOKIE = 'ananse_admin_token'

export function getAdminApiUrl() {
  return getServerApiUrl()
}
