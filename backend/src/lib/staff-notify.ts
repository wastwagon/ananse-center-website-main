import { notifyCrmWebhook } from './crm-webhook.js'

export type StaffNotifyEvent =
  | 'contact.created'
  | 'newsletter.subscribed'
  | 'donation.success'
  | 'registration.created'
  | 'community.submitted'

function notifyRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL_TO ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function subjectFor(event: StaffNotifyEvent, payload: Record<string, unknown>): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'Ananse Center'
  switch (event) {
    case 'contact.created':
      return `[${site}] New contact message`
    case 'newsletter.subscribed':
      return `[${site}] Newsletter signup`
    case 'donation.success':
      return `[${site}] Donation received`
    case 'registration.created':
      return `[${site}] Event registration`
    case 'community.submitted':
      return `[${site}] Community submission`
    default:
      return `[${site}] ${event}`
  }
}

function textBody(event: StaffNotifyEvent, payload: Record<string, unknown>): string {
  const lines = [`Event: ${event}`, `Time: ${new Date().toISOString()}`, '']
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    lines.push(`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
  }
  lines.push('', '— Ananse Center notifications')
  return lines.join('\n')
}

async function sendViaResend(to: string[], subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.NOTIFY_FROM_EMAIL?.trim()
  if (!apiKey || !from) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  })
  return response.ok
}

async function sendViaSmtp(to: string[], subject: string, text: string) {
  const { sendSmtpMail } = await import('./mail.js')
  return sendSmtpMail({ to, subject, text })
}

/** CRM webhook + optional staff email (Resend API or SMTP). Fire-and-forget. */
export async function notifyStaff(event: StaffNotifyEvent, payload: Record<string, unknown>) {
  void notifyCrmWebhook(event, payload)

  const to = notifyRecipients()
  if (to.length === 0) return

  const subject = subjectFor(event, payload)
  const text = textBody(event, payload)

  try {
    const sent =
      (await sendViaResend(to, subject, text)) || (await sendViaSmtp(to, subject, text))
    if (!sent) {
      console.warn(
        '[staff-notify] NOTIFY_EMAIL_TO is set but neither RESEND_API_KEY+NOTIFY_FROM_EMAIL nor SMTP_HOST is configured',
      )
    }
  } catch (error) {
    console.warn(
      '[staff-notify] Email failed:',
      error instanceof Error ? error.message : error,
    )
  }
}
