/** Public path served by Next proxy (same origin for the site). */
export function mediaPublicPath(assetId: string) {
  return `/api/media/file/${assetId}`
}

export function isImageMime(mimeType: string) {
  return mimeType.startsWith('image/')
}
