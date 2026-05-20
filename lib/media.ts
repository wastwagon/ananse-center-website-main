/** Same-origin URL for a media asset (proxied to the API). */
export function mediaFileUrl(assetId: string) {
  return `/api/media/file/${assetId}`
}

export type MediaAsset = {
  id: string
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  width: number | null
  height: number | null
  altText: string
  title: string
  url: string
  isImage: boolean
  createdAt: string
  updatedAt: string
}

export function formatMediaSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
