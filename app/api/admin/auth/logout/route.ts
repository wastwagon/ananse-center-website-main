import { NextResponse } from 'next/server'
import { adminSessionCookieOptions } from '../../../../../lib/admin-cookie'
import { ADMIN_COOKIE } from '../../../../../lib/admin-server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', adminSessionCookieOptions(0))
  return response
}
