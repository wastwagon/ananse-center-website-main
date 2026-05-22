import { images } from './images'

export const defaultOgImage = images.hero.home

export function absoluteAssetUrl(assetPath: string): string {
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
  if (!base) return assetPath
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
  return `${base}${encodeURI(path)}`
}
