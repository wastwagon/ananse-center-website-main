export type AdminUser = {
  id: string
  email: string
  name: string
  role: string
}

export type AdminProgram = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  section: 'catalog' | 'sankofa'
  duration: string
  level: string
  iconKey: string
  features: string[]
  sortOrder: number
  published: boolean
  coverMediaId: string | null
  createdAt: string
  updatedAt: string
}

export type AdminEvent = {
  id: string
  title: string
  slug: string
  description: string
  dateLabel: string
  location: string
  venue: string
  type: string
  imageEmoji: string
  storyTitle: string | null
  storyBody: string | null
  highlights: string[]
  featured: boolean
  published: boolean
  coverMediaId: string | null
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

export type AdminMedia = import('./media').MediaAsset

export type AdminMediaList = {
  data: AdminMedia[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData
  if (!isFormData && !headers.has('content-type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers,
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

export async function fetchAdminPrograms() {
  return adminFetch<{ data: AdminProgram[] }>('programs')
}

export async function createAdminProgram(
  body: Partial<AdminProgram> & Pick<AdminProgram, 'title' | 'description' | 'category'>,
) {
  return adminFetch<{ data: AdminProgram }>('programs', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateAdminProgram(id: string, body: Partial<AdminProgram>) {
  return adminFetch<{ data: AdminProgram }>(`programs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteAdminProgram(id: string) {
  return adminFetch<{ ok: boolean }>(`programs/${id}`, { method: 'DELETE' })
}

export async function fetchAdminContactMessages() {
  return adminFetch<{ data: AdminContactMessage[] }>('contact-messages')
}

export async function fetchAdminDonations() {
  return adminFetch<{ data: AdminDonation[] }>('donations')
}

export type ImpactStat = {
  value: string
  label: string
}

export type SiteIntegrations = {
  lmsPortalUrl: string
  googleAnalyticsId: string
  legacyRedirectHost: string
}

export type SiteSettings = {
  maintenanceMode: boolean
  maintenanceTitle: string
  maintenanceMessage: string
  siteStatus: 'live' | 'maintenance'
  updatedAt: string
  integrations?: SiteIntegrations
  site: {
    name: string
    shortName: string
    tagline: string
    location: string
  }
  contact: {
    phone: string
    phoneHref: string
    email: string
    programsEmail: string
    hours: string
    address: string
  }
  impactStats: ImpactStat[]
  social: {
    facebook: string
    instagram: string
    youtube: string
    twitter: string
  }
}

export type AdminDashboardData = {
  events: { total: number; published: number }
  contactMessages: { total: number; new: number }
  donations: { total: number; successful: number }
  inbox: { pendingStories: number; newRegistrations: number }
  site: SiteSettings
}

export type SystemStatus = {
  environment: string
  systemOpsAllowed: boolean
  autoMigrateOnDeploy: boolean
  autoSeedOnDeploy: boolean
  productionChecklist: {
    httpsSiteUrl: boolean
    jwtSecretStrong: boolean
    skipSeedAfterFirstDeploy: boolean
    systemOpsLocked: boolean
    corsConfigured: boolean
    trustProxy: boolean
  }
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

export type AdminSettingsPatch = {
  maintenanceMode?: boolean
  maintenanceTitle?: string
  maintenanceMessage?: string
  siteName?: string
  siteShortName?: string
  siteTagline?: string
  siteLocation?: string
  contactPhone?: string
  contactPhoneHref?: string
  contactEmail?: string
  programsEmail?: string
  contactHours?: string
  contactAddress?: string
  impactStats?: ImpactStat[]
  socialFacebook?: string
  socialInstagram?: string
  socialYoutube?: string
  socialTwitter?: string
  lmsPortalUrl?: string
  googleAnalyticsId?: string
  legacyRedirectHost?: string
}

export type EventRegistrationRow = {
  id: string
  eventSlug: string
  eventTitle?: string
  name: string
  email: string
  phone: string | null
  notes: string | null
  status: string
  createdAt: string
}

export type CommunitySubmissionRow = {
  id: string
  type: string
  name: string
  email: string
  org: string
  title: string
  body: string
  status: string
  createdAt: string
}

export type AdminArchiveRecord = {
  id: string
  title: string
  description: string
  culture: string
  era: string
  rightsNote: string
  tags: unknown
  mediaUrl: string
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export async function fetchAdminInboxRegistrations() {
  return adminFetch<{ data: EventRegistrationRow[] }>('inbox/registrations')
}

export async function fetchAdminInboxCommunity() {
  return adminFetch<{ data: CommunitySubmissionRow[] }>('inbox/community')
}

export async function updateCommunitySubmissionStatus(
  id: string,
  status: 'pending' | 'published' | 'rejected',
) {
  return adminFetch<{ data: CommunitySubmissionRow }>(`inbox/community/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function fetchAdminArchives() {
  return adminFetch<{ data: AdminArchiveRecord[] }>('archives')
}

export async function createAdminArchive(
  body: Pick<AdminArchiveRecord, 'title' | 'description'> & Partial<AdminArchiveRecord>,
) {
  return adminFetch<{ data: { id: string } }>('archives', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateAdminArchive(id: string, body: Partial<AdminArchiveRecord>) {
  return adminFetch<{ data: { id: string } }>(`archives/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteAdminArchive(id: string) {
  return adminFetch<{ ok: boolean }>(`archives/${id}`, { method: 'DELETE' })
}

export function donationsExportUrl() {
  return '/api/admin/export/donations.csv'
}

export function contactsExportUrl() {
  return '/api/admin/export/contacts.csv'
}

export function newsletterExportUrl() {
  return '/api/admin/export/newsletter.csv'
}

export async function updateEventRegistrationStatus(id: string, status: 'new' | 'reviewed') {
  return adminFetch<{ data: EventRegistrationRow }>(`inbox/registrations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export type AdminUserRow = {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export async function fetchAdminUsers() {
  return adminFetch<{ data: AdminUserRow[] }>('users')
}

export async function createAdminUser(body: {
  email: string
  password: string
  name: string
  role?: string
}) {
  return adminFetch<{ data: AdminUserRow }>('users', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateAdminUser(
  id: string,
  body: { name?: string; role?: string; password?: string },
) {
  return adminFetch<{ data: AdminUserRow }>(`users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteAdminUser(id: string) {
  return adminFetch<{ ok: boolean }>(`users/${id}`, { method: 'DELETE' })
}

export async function updateAdminSettings(body: AdminSettingsPatch) {
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

export async function syncContentBlocksFromRegistry() {
  return adminFetch<{ ok: boolean; created: number }>('content-blocks/sync', { method: 'POST' })
}

export type ContentRegistryItem = {
  key: string
  label: string
  section: string
  defaultBody: string
  format?: 'plain' | 'markdown'
  hint?: string
}

export async function fetchContentRegistry() {
  return adminFetch<{ data: ContentRegistryItem[] }>('content-blocks/registry')
}

export type NewsletterSubscriber = {
  id: string
  email: string
  createdAt: string
}

export async function fetchNewsletterSubscribers() {
  return adminFetch<{ data: NewsletterSubscriber[] }>('newsletter/subscribers')
}

export async function fetchAdminMedia(params?: {
  q?: string
  type?: 'image' | 'file'
  page?: number
  limit?: number
}) {
  const search = new URLSearchParams()
  if (params?.q) search.set('q', params.q)
  if (params?.type) search.set('type', params.type)
  if (params?.page) search.set('page', String(params.page))
  if (params?.limit) search.set('limit', String(params.limit))
  const query = search.toString()
  return adminFetch<AdminMediaList>(`media${query ? `?${query}` : ''}`)
}

export async function uploadAdminMedia(file: File) {
  const body = new FormData()
  body.append('file', file)
  return adminFetch<{ data: AdminMedia }>('media', {
    method: 'POST',
    body,
  })
}

export async function updateAdminMedia(id: string, patch: { altText?: string; title?: string }) {
  return adminFetch<{ data: AdminMedia }>(`media/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export async function deleteAdminMedia(id: string) {
  return adminFetch<{ ok: boolean }>(`media/${id}`, { method: 'DELETE' })
}
