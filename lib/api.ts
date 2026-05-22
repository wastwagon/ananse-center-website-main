import { getServerApiUrl } from './server-api-url'

export type ApiEvent = {
  id: string
  title: string
  slug: string
  description: string
  date: string
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

export type SearchResults = {
  programs: { title: string; path: string; snippet: string }[]
  events: { title: string; path: string; snippet: string }[]
  pages: { title: string; path: string; snippet: string }[]
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
