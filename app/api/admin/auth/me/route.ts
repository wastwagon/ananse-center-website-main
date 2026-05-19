import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminApiUrl } from '../../../../../lib/admin-server'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const upstream = await fetch(`${getAdminApiUrl()}/api/v1/admin/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  const payload = await upstream.json().catch(() => ({}))
  return NextResponse.json(payload, { status: upstream.status })
}
