/** Parse JSON stored in a CMS block; falls back when invalid or empty. */
export function parseCmsJson<T>(raw: string, fallback: T): T {
  const trimmed = raw.trim()
  if (!trimmed) return fallback
  try {
    return JSON.parse(trimmed) as T
  } catch {
    return fallback
  }
}
