import type { MediaAsset } from '@prisma/client'
import { mediaPublicPath, isImageMime } from './media-url.js'

export type MediaDto = {
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

export function mapMedia(asset: MediaAsset): MediaDto {
  return {
    id: asset.id,
    filename: asset.filename,
    originalName: asset.originalName,
    mimeType: asset.mimeType,
    sizeBytes: asset.sizeBytes,
    width: asset.width,
    height: asset.height,
    altText: asset.altText,
    title: asset.title,
    url: mediaPublicPath(asset.id),
    isImage: isImageMime(asset.mimeType),
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  }
}
