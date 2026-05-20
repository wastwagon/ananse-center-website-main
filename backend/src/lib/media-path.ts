import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export function getUploadDir() {
  const configured = process.env.MEDIA_UPLOAD_DIR?.trim()
  if (configured) return path.resolve(configured)
  return path.join(backendRoot, 'uploads')
}

export async function ensureUploadDir() {
  const dir = getUploadDir()
  await mkdir(dir, { recursive: true })
  return dir
}

export function filePathForStoredName(storedName: string) {
  return path.join(getUploadDir(), storedName)
}

export function extensionForMime(mimeType: string) {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
  }
  return map[mimeType] ?? ''
}

export const ALLOWED_MEDIA_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
])

export function maxUploadBytes() {
  const raw = Number(process.env.MEDIA_MAX_BYTES || 10 * 1024 * 1024)
  return Number.isFinite(raw) && raw > 0 ? raw : 10 * 1024 * 1024
}
