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
  featured: boolean
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
