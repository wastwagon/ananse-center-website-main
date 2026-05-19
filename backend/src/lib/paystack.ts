const PAYSTACK_API = 'https://api.paystack.co'

/** Paystack default currency — Ghana Cedis for The Ananse Center */
export const PAYSTACK_DEFAULT_CURRENCY = 'GHS' as const

type PaystackResponse<T> = {
  status: boolean
  message: string
  data: T
}

export type PaystackInitializeData = {
  authorization_url: string
  access_code: string
  reference: string
}

export type PaystackVerifyData = {
  status: string
  reference: string
  amount: number
  currency: string
  channel: string
  paid_at: string
  customer: { email: string }
}

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim()
  if (!key) {
    throw new Error('Paystack is not configured on the server')
  }
  return key
}

export function getPaystackCurrency() {
  return PAYSTACK_DEFAULT_CURRENCY
}

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim())
}

export function toSubunit(amountMajor: number) {
  return Math.round(amountMajor * 100)
}

export function fromSubunit(amountSubunit: number) {
  return amountSubunit / 100
}

export async function paystackPost<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as PaystackResponse<T>
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Paystack request failed')
  }

  return payload.data
}

export async function paystackGet<T>(path: string) {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
    },
  })

  const payload = (await response.json()) as PaystackResponse<T>
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Paystack request failed')
  }

  return payload.data
}

export async function initializeTransaction(input: {
  email: string
  amountSubunit: number
  currency: string
  reference: string
  callbackUrl: string
  metadata: Record<string, string>
}) {
  return paystackPost<PaystackInitializeData>('/transaction/initialize', {
    email: input.email,
    amount: input.amountSubunit,
    currency: input.currency,
    reference: input.reference,
    callback_url: input.callbackUrl,
    metadata: input.metadata,
  })
}

export async function verifyTransaction(reference: string) {
  return paystackGet<PaystackVerifyData>(`/transaction/verify/${encodeURIComponent(reference)}`)
}
