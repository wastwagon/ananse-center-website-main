import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminApiUrl } from '../../../../lib/admin-server'

type RouteContext = {
  params: Promise<{ path: string[] }>
}

async function proxy(request: Request, context: RouteContext) {
  const { path } = await context.params
  const apiPath = path.join('/')
  const url = new URL(request.url)
  const target = `${getAdminApiUrl()}/api/v1/admin/${apiPath}${url.search}`

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  if (token) headers.set('authorization', `Bearer ${token}`)

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text()
  }

  const upstream = await fetch(target, init)
  const body = await upstream.text()

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
    },
  })
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const PUT = proxy
export const DELETE = proxy
