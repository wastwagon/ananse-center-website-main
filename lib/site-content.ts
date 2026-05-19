import { getServerApiUrl } from './server-api-url'

export async function fetchSiteContentMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/content`, {
      next: { revalidate: 30 },
    })
    if (!response.ok) return {}
    const payload = (await response.json()) as { data: Record<string, string> }
    return payload.data ?? {}
  } catch {
    return {}
  }
}

export async function getContentValue(key: string, fallback: string) {
  const map = await fetchSiteContentMap()
  return map[key]?.trim() || fallback
}
