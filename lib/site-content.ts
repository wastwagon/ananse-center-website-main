import { getCmsText, isContentKey } from './cms/content'

/** @deprecated Use `getCmsText` from `lib/cms/content`. */
export async function getContentValue(key: string, fallback: string) {
  if (isContentKey(key)) return getCmsText(key)
  return fallback
}

export { fetchSiteContentMap, getCmsText, getCmsTexts } from './cms/content'
