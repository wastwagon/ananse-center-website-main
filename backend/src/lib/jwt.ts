import { createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 7

type AdminTokenPayload = {
  sub: string
  email: string
  name: string
  role: string
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(data: string, secret: string) {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be set and at least 32 characters')
  }
  return secret
}

export function signAdminToken(payload: AdminTokenPayload, ttlSec = DEFAULT_TTL_SEC) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + ttlSec,
    }),
  )
  const signature = sign(`${header}.${body}`, getSecret())
  return `${header}.${body}.${signature}`
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const secret = getSecret()
    const [header, body, signature] = token.split('.')
    if (!header || !body || !signature) return null

    const expected = sign(`${header}.${body}`, secret)
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null

    const parsed = JSON.parse(base64UrlDecode(body)) as AdminTokenPayload & {
      iat?: number
      exp?: number
    }

    if (!parsed.sub || !parsed.email || !parsed.exp) return null
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null

    return {
      sub: parsed.sub,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
    }
  } catch {
    return null
  }
}
