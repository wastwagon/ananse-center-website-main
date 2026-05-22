const ACCRA_TZ = 'Africa/Accra'

/** Display event dates for a global audience (GMT / Accra labeled). */
export function formatEventDateDisplay(
  dateStr: string,
  options?: { includeTime?: boolean; locale?: string },
): string {
  const parsed = parseFlexibleDate(dateStr)
  if (!parsed) return dateStr

  const locale = options?.locale ?? 'en-GB'
  const fmt = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: ACCRA_TZ,
    ...(options?.includeTime
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : {}),
  })

  return `${fmt.format(parsed)} · Accra (GMT)`
}

function parseFlexibleDate(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const iso = new Date(trimmed)
  if (!Number.isNaN(iso.getTime())) return iso

  const match = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
  if (match) {
    const attempt = new Date(`${match[2]} ${match[1]}, ${match[3]}`)
    if (!Number.isNaN(attempt.getTime())) return attempt
  }

  return null
}
