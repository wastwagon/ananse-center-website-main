function trimSlash(value: string) {
  return value.replace(/\/+$/, '')
}

/** Server-side fetches (SSR, middleware, admin BFF) — prefer internal Docker URL when set. */
export function getServerApiUrl() {
  const internal = process.env.API_INTERNAL_URL?.trim()
  if (internal) return trimSlash(internal)

  return trimSlash(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4035')
}
