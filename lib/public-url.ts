/** Public URLs pasted into the CMS. Rejects javascript: and other schemes. */

export function safeHttpUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString()
  } catch {
    return null
  }
  return null
}

/** Google Maps or OpenStreetMap embed src only. */
export function safeMapEmbedUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:') return null
    const host = url.hostname
    const googleEmbed = host === 'www.google.com' && url.pathname.startsWith('/maps/embed')
    const osmEmbed = host === 'www.openstreetmap.org' && url.pathname.startsWith('/export/embed.html')
    if (!googleEmbed && !osmEmbed) return null
    return url.toString()
  } catch {
    return null
  }
}

/** Accept a watch, share, shorts, or embed link and return a nocookie embed URL. */
export function toYoutubeEmbed(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')
    let id = ''
    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? ''
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname.startsWith('/embed/')) id = url.pathname.split('/')[2] ?? ''
      else if (url.pathname.startsWith('/shorts/')) id = url.pathname.split('/')[2] ?? ''
      else if (url.pathname === '/watch') id = url.searchParams.get('v') ?? ''
    }
    id = id.split('?')[0] ?? ''
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return null
    return `https://www.youtube-nocookie.com/embed/${id}`
  } catch {
    return null
  }
}

export function youtubeWatchUrl(embedUrl: string): string {
  const id = embedUrl.split('/embed/')[1]?.split('?')[0] ?? ''
  return `https://www.youtube.com/watch?v=${id}`
}
