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
  new: 'draft',
  pending: 'draft',
  rejected: 'danger',
  failed: 'danger',
}

export function AdminStatus({ value }: { value: string }) {
  const tone = TONES[value.toLowerCase()] ?? 'neutral'
  return <span className={`admin-badge admin-badge--${tone}`}>{value}</span>
}
