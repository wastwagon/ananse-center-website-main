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

/**
 * Best-effort parse for CMS/event date labels.
 * Range strings like "March 15-17, 2025" must be handled before Date.parse —
 * V8 otherwise misreads the end day as a year (e.g. 15-17 → 2017).
 */
export function parseFlexibleDate(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  // "March 15-17, 2025" / "June 1–30, 2025"
  const range = trimmed.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*(\d{1,2}),?\s+(\d{4})$/,
  )
  if (range) {
    const attempt = new Date(`${range[1]} ${range[2]}, ${range[4]}`)
    if (!Number.isNaN(attempt.getTime())) return attempt
  }

  // ISO / unambiguous numeric dates
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const iso = new Date(trimmed)
    if (!Number.isNaN(iso.getTime())) return iso
  }

  // "15 Mar 2025"
  const dayMonthYear = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
  if (dayMonthYear) {
    const attempt = new Date(`${dayMonthYear[2]} ${dayMonthYear[1]}, ${dayMonthYear[3]}`)
    if (!Number.isNaN(attempt.getTime())) return attempt
  }

  // "March 15, 2025"
  const monthDayYear = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (monthDayYear) {
    const attempt = new Date(`${monthDayYear[1]} ${monthDayYear[2]}, ${monthDayYear[3]}`)
    if (!Number.isNaN(attempt.getTime())) return attempt
  }

  // Recurring / freeform labels ("Every Saturday in April") — keep as display text
  if (/\d\s*[-–—]\s*\d/.test(trimmed) || /^every\b/i.test(trimmed)) {
    return null
  }

  const fallback = new Date(trimmed)
  if (!Number.isNaN(fallback.getTime())) return fallback

  return null
}

/** True when the event date is on/after today (Accra calendar day), or unparseable/recurring. */
export function isUpcomingEventDate(dateStr: string, now = new Date()): boolean {
  const parsed = parseFlexibleDate(dateStr)
  if (!parsed) return true

  const today = new Date(
    new Intl.DateTimeFormat('en-CA', { timeZone: ACCRA_TZ }).format(now),
  )
  const eventDay = new Date(
    new Intl.DateTimeFormat('en-CA', { timeZone: ACCRA_TZ }).format(parsed),
  )
  return eventDay.getTime() >= today.getTime()
}


export type EventRegistrationStatus = 'auto' | 'open' | 'closed' | 'waitlist' | 'completed'

/** Resolve display registration status from admin override + schedule. */
export function resolveEventRegistrationStatus(input: {
  registrationStatus?: string | null
  dateLabel?: string | null
  startsAt?: string | Date | null
  endsAt?: string | Date | null
  now?: Date
}): EventRegistrationStatus {
  const status = (input.registrationStatus || 'auto').toLowerCase()
  if (status === 'open' || status === 'closed' || status === 'waitlist' || status === 'completed') {
    return status
  }

  const now = input.now ?? new Date()
  if (input.endsAt) {
    const ends = typeof input.endsAt === 'string' ? new Date(input.endsAt) : input.endsAt
    if (!Number.isNaN(ends.getTime()) && ends.getTime() < now.getTime()) return 'completed'
  }
  if (input.startsAt) {
    const starts = typeof input.startsAt === 'string' ? new Date(input.startsAt) : input.startsAt
    if (!Number.isNaN(starts.getTime())) {
      // Compare calendar day in Accra
      const today = new Date(
        new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Accra' }).format(now),
      )
      const startDay = new Date(
        new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Accra' }).format(starts),
      )
      if (startDay.getTime() < today.getTime()) return 'completed'
      return 'open'
    }
  }
  if (input.dateLabel) {
    return isUpcomingEventDate(input.dateLabel, now) ? 'open' : 'completed'
  }
  return 'open'
}
