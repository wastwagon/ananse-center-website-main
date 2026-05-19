import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminApiUrl } from '../../../../../lib/admin-server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(`${getAdminApiUrl()}/api/v1/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('[admin/login] upstream fetch failed:', error)
    return NextResponse.json(
      {
        error:
          'Cannot reach the API. If you use Docker, restart with docker compose -f docker-compose.dev.yml up --build.',
      },
      { status: 503 },
    )
  }

  const payload = await upstream.json().catch(() => ({}))
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status })
  }

  if (!payload.token) {
    return NextResponse.json({ error: 'Invalid login response from API' }, { status: 502 })
  }

  const response = NextResponse.json({ user: payload.user })
  response.cookies.set(ADMIN_COOKIE, payload.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
