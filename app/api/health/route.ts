import { NextResponse } from 'next/server'

/** Lightweight health probe for Coolify / compose (web container). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'ananse-web',
    timestamp: new Date().toISOString(),
  })
}
