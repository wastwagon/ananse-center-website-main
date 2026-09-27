import { randomBytes } from 'node:crypto'
import { prisma } from './prisma.js'
import { sendSmtpMail, smtpConfigured } from './mail.js'

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3035').replace(/\/$/, '')
}

function siteName() {
  return 'ANANSE Center for Leadership Development'
}

export function unsubscribeUrl(token: string) {
  return `${siteUrl()}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`
}

function welcomeText(token: string) {
  return [
    `You are subscribed to updates from ${siteName()}.`,
    '',
    'We write when there is news about gatherings, programs, and reflections.',
    '',
    `Unsubscribe: ${unsubscribeUrl(token)}`,
  ].join('\n')
}

export async function subscribeAddress(email: string) {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  const alreadyActive = existing?.status === 'subscribed'
  const token = existing?.unsubscribeToken || randomBytes(24).toString('hex')

  const row = await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      status: 'subscribed',
      unsubscribeToken: token,
    },
    update: {
      status: 'subscribed',
      unsubscribedAt: null,
      unsubscribeToken: token,
    },
  })

  let emailed = false
  if (!alreadyActive && smtpConfigured()) {
    emailed = await sendSmtpMail({
      to: row.email,
      subject: `You are subscribed — ${siteName()}`,
      text: welcomeText(row.unsubscribeToken),
    })
  }

  return { row, alreadyActive, emailed, smtpConfigured: smtpConfigured() }
}

export async function unsubscribeByToken(token: string) {
  const row = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken: token } })
  if (!row) return { ok: false as const }
  if (row.status !== 'unsubscribed') {
    await prisma.newsletterSubscriber.update({
      where: { id: row.id },
      data: { status: 'unsubscribed', unsubscribedAt: new Date() },
    })
  }
  return { ok: true as const, email: row.email }
}

export async function sendNewsletterIssue(subject: string, body: string) {
  if (!smtpConfigured()) {
    return { ok: false as const, error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and NOTIFY_FROM_EMAIL.' }
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { status: 'subscribed' },
    orderBy: { createdAt: 'asc' },
    take: 2000,
  })

  let sent = 0
  let failed = 0
  for (const subscriber of subscribers) {
    const text = [
      body.trim(),
      '',
      '—',
      siteName(),
      `Unsubscribe: ${unsubscribeUrl(subscriber.unsubscribeToken)}`,
    ].join('\n')
    try {
      const ok = await sendSmtpMail({ to: subscriber.email, subject, text })
      if (ok) sent += 1
      else failed += 1
    } catch (error) {
      failed += 1
      console.warn(
        '[newsletter] Send failed:',
        error instanceof Error ? error.message : error,
      )
    }
  }

  return { ok: true as const, sent, failed, recipients: subscribers.length }
}
