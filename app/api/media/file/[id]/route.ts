import { NextResponse } from 'next/server'
import { getServerApiUrl } from '../../../../../lib/server-api-url'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const target = `${getServerApiUrl()}/api/v1/media/file/${encodeURIComponent(id)}`

  const upstream = await fetch(target, { cache: 'no-store' })
  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status })
  }

  const headers = new Headers()
  for (const name of ['content-type', 'content-length', 'cache-control', 'content-disposition'] as const) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  })
}
