export function formatAdminWhen(value: string | Date) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const TONES: Record<string, string> = {
  published: 'published',
  paid: 'published',
  success: 'published',
  successful: 'published',
  subscribed: 'published',
  reviewed: 'published',
  draft: 'draft',
  in_review: 'draft',
  scheduled: 'neutral',
  archived: 'neutral',
  new: 'draft',
  pending: 'draft',
  rejected: 'danger',
  failed: 'danger',
}

const LABELS: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In review',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}

export function AdminStatus({ value }: { value: string }) {
  const key = value.toLowerCase()
  const tone = TONES[key] ?? 'neutral'
  const label = LABELS[key] || value.replace(/_/g, ' ')
  return <span className={`admin-badge admin-badge--${tone}`}>{label}</span>
}
