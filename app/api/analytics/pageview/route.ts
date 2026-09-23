import { NextResponse } from 'next/server'
import { getServerApiUrl } from '../../../../lib/server-api-url'

/** Same-origin beacon. Returns 204 even when the API is offline so the browser console stays quiet. */
export async function POST(request: Request) {
  try {
    const body = await request.text()
    await fetch(`${getServerApiUrl()}/api/v1/analytics/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(2500),
    })
  } catch {
    // Tracking is optional when the API is not running.
  }
  return new NextResponse(null, { status: 204 })
}
