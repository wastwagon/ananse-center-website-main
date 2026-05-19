export type AdminUser = {
  id: string
  email: string
  name: string
  role: string
}

export type AdminEvent = {
  id: string
  title: string
  slug: string
  description: string
  dateLabel: string
  location: string
  type: string
  imageEmoji: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export type AdminContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export type AdminDonation = {
  id: string
  reference: string
  email: string
  donorName: string | null
  amount: number
  currency: string
  label: string | null
  status: string
  channel: string | null
  paidAt: string | null
  createdAt: string
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`)
  }

  return payload as T
}

export async function adminLogin(email: string, password: string) {
  return adminFetch<{ user: AdminUser }>('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function adminLogout() {
  await adminFetch<{ ok: boolean }>('auth/logout', { method: 'POST' })
}

export async function adminMe() {
  return adminFetch<{ user: AdminUser }>('auth/me')
}

export async function fetchAdminEvents() {
  return adminFetch<{ data: AdminEvent[] }>('events')
}

export async function createAdminEvent(body: Partial<AdminEvent> & Pick<AdminEvent, 'title' | 'description' | 'dateLabel' | 'location' | 'type'>) {
  return adminFetch<{ data: AdminEvent }>('events', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateAdminEvent(id: string, body: Partial<AdminEvent>) {
  return adminFetch<{ data: AdminEvent }>(`events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteAdminEvent(id: string) {
  return adminFetch<{ ok: boolean }>(`events/${id}`, { method: 'DELETE' })
}

export async function fetchAdminContactMessages() {
  return adminFetch<{ data: AdminContactMessage[] }>('contact-messages')
}

export async function fetchAdminDonations() {
  return adminFetch<{ data: AdminDonation[] }>('donations')
}

export type SiteSettings = {
  maintenanceMode: boolean
  maintenanceTitle: string
  maintenanceMessage: string
  siteStatus: 'live' | 'maintenance'
  updatedAt: string
}

export type AdminDashboardData = {
  events: { total: number; published: number }
  contactMessages: { total: number; new: number }
  donations: { total: number; successful: number }
  site: SiteSettings
}

export type SystemStatus = {
  environment: string
  systemOpsAllowed: boolean
  autoMigrateOnDeploy: boolean
  autoSeedOnDeploy: boolean
  confirmPhrases: { migrate: string; seed: string }
  counts: {
    events: number
    contactMessages: number
    donations: number
    adminUsers: number
  }
  site: SiteSettings
}

export type ContentBlock = {
  id: string
  key: string
  label: string
  section: string
  body: string
  format: 'plain' | 'markdown'
  published: boolean
  createdAt: string
  updatedAt: string
}

export async function fetchAdminDashboard() {
  return adminFetch<{ data: AdminDashboardData }>('dashboard')
}

export async function fetchAdminSettings() {
  return adminFetch<{ data: SiteSettings }>('settings')
}

export async function updateAdminSettings(body: Partial<SiteSettings>) {
  return adminFetch<{ data: SiteSettings }>('settings', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function fetchSystemStatus() {
  return adminFetch<{ data: SystemStatus }>('system/status')
}

export async function runAdminMigrate(confirm: string) {
  return adminFetch<{ ok: boolean; message: string; output?: string }>('system/migrate', {
    method: 'POST',
    body: JSON.stringify({ confirm }),
  })
}

export async function runAdminSeed(confirm: string) {
  return adminFetch<{ ok: boolean; message: string; output?: string }>('system/seed', {
    method: 'POST',
    body: JSON.stringify({ confirm }),
  })
}

export async function fetchContentBlocks() {
  return adminFetch<{ data: ContentBlock[] }>('content-blocks')
}

export async function updateContentBlock(id: string, body: Partial<ContentBlock>) {
  return adminFetch<{ data: ContentBlock }>(`content-blocks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function createContentBlock(
  body: Pick<ContentBlock, 'key' | 'label' | 'body'> & Partial<ContentBlock>,
) {
  return adminFetch<{ data: ContentBlock }>('content-blocks', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function deleteContentBlock(id: string) {
  return adminFetch<{ ok: boolean }>(`content-blocks/${id}`, { method: 'DELETE' })
}
