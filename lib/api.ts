import { getServerApiUrl } from './server-api-url'

export type ApiEvent = {
  id: string
  title: string
  slug: string
  description: string
  date: string
  startsAt?: string | null
  endsAt?: string | null
  timeLabel?: string
  capacity?: number | null
  registrationStatus?: 'auto' | 'open' | 'closed' | 'waitlist' | 'completed' | string
  eventStatus?: 'scheduled' | 'postponed' | 'cancelled' | string
  deliveryMode?: 'in_person' | 'online' | 'hybrid' | string
  meetingUrl?: string | null
  recordingUrl?: string | null
  galleryImageUrls?: string[]
  program?: { id: string; slug: string; title: string } | null
  location: string
  type: string
  image: string
  coverImageUrl: string | null
  featured: boolean
}

export type ApiEventDetail = ApiEvent & {
  venue: string
  storyTitle: string | null
  storyBody: string | null
  highlights: string[]
}

export type ApiProgram = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  section: string
  duration: string
  level: string
  iconKey: string
  features: string[]
  sortOrder: number
  coverImageUrl: string | null
}

function trimSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getPublicApiUrl() {
  return trimSlash(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4035')
}

export { getServerApiUrl }

export async function fetchEvents(): Promise<ApiEvent[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  const response = await fetch(`${base}/api/v1/events`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to load events (${response.status})`)
  }

  const payload = (await response.json()) as { data: ApiEvent[] }
  return payload.data
}

export async function fetchEventsForProgram(slug: string): Promise<ApiEvent[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}/api/v1/programs/${encodeURIComponent(slug)}/events`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: ApiEvent[] }
    return payload.data
  } catch {
    return []
  }
}

export async function fetchProgramBySlug(slug: string): Promise<ApiProgram | null> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  const response = await fetch(`${base}/api/v1/programs/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to load program (${response.status})`)
  const payload = (await response.json()) as { data: ApiProgram }
  return payload.data
}

export async function fetchPrograms(section?: 'catalog' | 'sankofa'): Promise<ApiProgram[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  const query = section ? `?section=${encodeURIComponent(section)}` : ''
  const response = await fetch(`${base}/api/v1/programs${query}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to load programs (${response.status})`)
  }

  const payload = (await response.json()) as { data: ApiProgram[] }
  return payload.data
}

export async function fetchEventBySlug(slug: string): Promise<ApiEventDetail | null> {
  const response = await fetch(`${getServerApiUrl()}/api/v1/events/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  })

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Failed to load event (${response.status})`)
  }

  const payload = (await response.json()) as { data: ApiEventDetail }
  return payload.data
}

export async function submitContactMessage(body: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to send message')
  }

  return payload as { ok: boolean; message: string }
}

export type DonationConfig = {
  enabled: boolean
  currency: string
  publicKey: string | null
  minAmount: number
}

export type DonationInitializeResult = {
  ok: boolean
  reference: string
  accessCode: string
  authorizationUrl: string
  amount: number
  currency: string
  publicKey: string | null
}

export async function fetchDonationConfig(): Promise<DonationConfig> {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/donations/config`)
  if (!response.ok) {
    throw new Error('Unable to load donation settings')
  }
  return response.json() as Promise<DonationConfig>
}

export async function initializeDonation(body: {
  email: string
  name?: string
  amount: number
  label?: string
}): Promise<DonationInitializeResult> {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/donations/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to start payment')
  }

  return payload as DonationInitializeResult
}

export async function verifyDonation(reference: string) {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/donations/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to verify payment')
  }

  return payload as {
    ok: boolean
    status: string
    reference: string
    amount: number
    currency: string
    message: string
  }
}

export type ApiArchiveRecord = {
  id?: string
  title: string
  description: string
  culture: string
  era: string
  rightsNote: string
  tags?: string[]
  mediaUrl?: string
}

export type ApiSpotlight = {
  id: string
  name: string
  org: string
  title: string
  description: string
}

export type ApiNewsPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  date: string
  author?: string
  category?: string
  featured?: boolean
  href: string
  isExternal: boolean
  coverImageUrl?: string | null
}

export type ApiInsightPost = ApiNewsPost & {
  contentType: string
  topics: string[]
  showInLibraryRead?: boolean
}

export type ApiPerson = {
  id: string
  name: string
  slug: string
  roleTitle: string
  bio: string
  groups: string[]
  isOrganization: boolean
  organizationName: string
  websiteUrl: string | null
  photoImageUrl: string | null
  logoImageUrl: string | null
  featured: boolean
}

export type ApiLibraryProgramRef = { id: string; slug: string; title: string }
export type ApiLibraryPersonRef = { id: string; slug: string; name: string }

export type ApiLibraryItem = {
  id: string
  title: string
  slug: string
  description: string
  shelf: string
  collection: string
  body: string
  transcript: string
  furtherStudy: string
  wisdomNugget: string
  scriptureTheme: string
  episodeNumber: number | null
  dateLabel: string
  publishedAt: string | null
  topics: string[]
  program: ApiLibraryProgramRef | null
  person: ApiLibraryPersonRef | null
  coverImageUrl: string | null
  audioUrl: string | null
  videoUrl: string | null
  featured: boolean
  href: string
}

export type ApiPhotoAlbumImage = {
  id: string
  mediaId: string
  caption: string
  sortOrder: number
  url: string
}

export type ApiPhotoAlbum = {
  id: string
  title: string
  slug: string
  description: string
  dateLabel: string
  place: string
  collection: string
  program: ApiLibraryProgramRef | null
  event: { id: string; slug: string; title: string } | null
  coverImageUrl: string | null
  images: ApiPhotoAlbumImage[]
  featured: boolean
  href: string
}

export type SearchResults = {
  programs: { title: string; path: string; snippet: string }[]
  events: { title: string; path: string; snippet: string }[]
  archives: { title: string; path: string; snippet: string }[]
  news: { title: string; path: string; snippet: string }[]
  insights?: { title: string; path: string; snippet: string; contentType?: string }[]
  library?: { title: string; path: string; snippet: string }[]
  people?: { title: string; path: string; snippet: string }[]
  photoAlbums?: { title: string; path: string; snippet: string }[]
  pages: { title: string; path: string; snippet: string }[]
}

type ListQuery = Record<string, string | undefined>

function buildQueryString(query?: ListQuery): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    const trimmed = value?.trim()
    if (trimmed) params.set(key, trimmed)
  }
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

async function fetchPublicList<T>(path: string, query?: ListQuery): Promise<T[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}${path}${buildQueryString(query)}`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: T[] }
    return payload.data
  } catch {
    return []
  }
}

async function fetchPublicOne<T>(path: string): Promise<T | null> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}${path}`, { next: { revalidate: 60 } })
    if (response.status === 404) return null
    if (!response.ok) return null
    const payload = (await response.json()) as { data: T }
    return payload.data
  } catch {
    return null
  }
}

export async function fetchNewsPosts(): Promise<ApiNewsPost[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}/api/v1/news`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: ApiNewsPost[] }
    return payload.data
  } catch {
    return []
  }
}

export async function fetchNewsPostBySlug(slug: string): Promise<ApiNewsPost | null> {
  return fetchPublicOne<ApiNewsPost>(`/api/v1/news/${encodeURIComponent(slug)}`)
}

export async function fetchInsights(query?: {
  topic?: string
  contentType?: string
  featured?: boolean
}): Promise<ApiInsightPost[]> {
  return fetchPublicList<ApiInsightPost>('/api/v1/insights', {
    topic: query?.topic,
    contentType: query?.contentType,
    featured: query?.featured ? 'true' : undefined,
  })
}

export async function fetchInsightBySlug(slug: string): Promise<ApiInsightPost | null> {
  return fetchPublicOne<ApiInsightPost>(`/api/v1/insights/${encodeURIComponent(slug)}`)
}

export async function fetchPeople(query?: {
  group?: string
  featured?: boolean
}): Promise<ApiPerson[]> {
  return fetchPublicList<ApiPerson>('/api/v1/people', {
    group: query?.group,
    featured: query?.featured ? 'true' : undefined,
  })
}

export async function fetchPersonBySlug(slug: string): Promise<ApiPerson | null> {
  return fetchPublicOne<ApiPerson>(`/api/v1/people/${encodeURIComponent(slug)}`)
}

export async function fetchLibraryItems(query?: {
  shelf?: string
  collection?: string
  program?: string
  person?: string
  topic?: string
  featured?: boolean
  q?: string
}): Promise<ApiLibraryItem[]> {
  return fetchPublicList<ApiLibraryItem>('/api/v1/library', {
    shelf: query?.shelf,
    collection: query?.collection,
    program: query?.program,
    person: query?.person,
    topic: query?.topic,
    featured: query?.featured ? 'true' : undefined,
    q: query?.q,
  })
}

export async function fetchLibraryItemBySlug(slug: string): Promise<ApiLibraryItem | null> {
  return fetchPublicOne<ApiLibraryItem>(`/api/v1/library/${encodeURIComponent(slug)}`)
}

export async function fetchMiddayReflectionEpisodes(): Promise<ApiLibraryItem[]> {
  return fetchPublicList<ApiLibraryItem>('/api/v1/library/midday-reflection/episodes')
}

export async function fetchLibraryLinkedArticles(): Promise<ApiInsightPost[]> {
  return fetchPublicList<ApiInsightPost>('/api/v1/library/read/linked-articles')
}

export async function fetchPhotoAlbums(query?: {
  collection?: string
  featured?: boolean
  program?: string
  event?: string
}): Promise<ApiPhotoAlbum[]> {
  return fetchPublicList<ApiPhotoAlbum>('/api/v1/photo-albums', {
    collection: query?.collection,
    featured: query?.featured ? 'true' : undefined,
    program: query?.program,
    event: query?.event,
  })
}

export async function fetchPhotoAlbumBySlug(slug: string): Promise<ApiPhotoAlbum | null> {
  return fetchPublicOne<ApiPhotoAlbum>(`/api/v1/photo-albums/${encodeURIComponent(slug)}`)
}

export async function fetchArchiveRecords(): Promise<ApiArchiveRecord[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}/api/v1/archives`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: ApiArchiveRecord[] }
    return payload.data
  } catch {
    return []
  }
}

export async function fetchPublishedSpotlights(): Promise<ApiSpotlight[]> {
  const base = typeof window === 'undefined' ? getServerApiUrl() : getPublicApiUrl()
  try {
    const response = await fetch(`${base}/api/v1/community/spotlights`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    const payload = (await response.json()) as { data: ApiSpotlight[] }
    return payload.data
  } catch {
    return []
  }
}

export async function searchSite(query: string): Promise<SearchResults> {
  const response = await fetch(
    `${getPublicApiUrl()}/api/v1/search?q=${encodeURIComponent(query)}`,
    { cache: 'no-store' },
  )
  if (!response.ok) {
    throw new Error('Search unavailable')
  }
  const payload = (await response.json()) as { data: SearchResults }
  return payload.data
}

export async function registerForEvent(body: {
  eventSlug?: string
  eventTitle?: string
  name: string
  email: string
  phone?: string
  notes?: string
}) {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/events/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to register')
  }
  return payload as { data: { message: string } }
}

export async function submitCommunityStory(body: {
  type?: 'story' | 'spotlight'
  name: string
  email: string
  org?: string
  title: string
  body: string
}) {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/community/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to submit')
  }
  return payload as { data: { message: string } }
}

export async function subscribeNewsletter(email: string) {
  const response = await fetch(`${getPublicApiUrl()}/api/v1/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to subscribe')
  }

  return payload as { ok: boolean; message: string }
}
