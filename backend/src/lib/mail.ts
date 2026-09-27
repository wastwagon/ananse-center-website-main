import { createTransport } from 'nodemailer'

export function smtpFromAddress(): string {
  return process.env.NOTIFY_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim() || ''
}

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim() && smtpFromAddress())
}

export async function sendSmtpMail(input: {
  to: string | string[]
  subject: string
  text: string
}): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim()
  const from = smtpFromAddress()
  if (!host || !from) return false

  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const transport = createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })

  await transport.sendMail({
    from,
    to: Array.isArray(input.to) ? input.to.join(', ') : input.to,
    subject: input.subject,
    text: input.text,
  })
  return true
}
