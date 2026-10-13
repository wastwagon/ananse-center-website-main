export const PUBLICATION_STATUSES = [
  'draft',
  'in_review',
  'scheduled',
  'published',
  'archived',
] as const

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number]

export function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocal(value: string): string | null {
  if (!value.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export function publishedFromStatus(status: string, scheduledAtLocal?: string) {
  if (status === 'published') return true
  if (status === 'scheduled' && scheduledAtLocal) {
    const when = new Date(scheduledAtLocal)
    return !Number.isNaN(when.getTime()) && when.getTime() <= Date.now()
  }
  return false
}

export function statusFromPublished(published: boolean): PublicationStatus {
  return published ? 'published' : 'draft'
}
