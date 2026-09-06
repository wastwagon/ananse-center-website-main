import { readFile } from 'node:fs/promises'
import path from 'node:path'

const EXT_CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.gif': 'image/gif',
}

function contentTypeForPath(pathname: string): string {
  const ext = path.extname(pathname).toLowerCase()
  return EXT_CONTENT_TYPES[ext] ?? 'image/png'
}

/**
 * Load raw bytes for a CMS-configured icon path (public file or absolute Media Library URL).
 * Returns null when the path is empty or the file/URL cannot be resolved.
 */
export async function loadCmsIconBytes(
  cmsPath: string | undefined | null,
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  const trimmed = cmsPath?.trim()
  if (!trimmed) return null

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const response = await fetch(trimmed, { next: { revalidate: 300 } })
      if (!response.ok) return null
      const data = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') || contentTypeForPath(trimmed)
      return { data, contentType }
    }

    const publicPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
    const filePath = path.join(process.cwd(), 'public', publicPath)
    const buffer = await readFile(filePath)
    return { data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), contentType: contentTypeForPath(filePath) }
  } catch {
    return null
  }
}
