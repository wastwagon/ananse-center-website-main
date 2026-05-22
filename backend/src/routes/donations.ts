import type { FastifyInstance } from 'fastify'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { notifyCrmWebhook } from '../lib/crm-webhook.js'
import {
  fromSubunit,
  getPaystackCurrency,
  initializeTransaction,
  isPaystackConfigured,
  PAYSTACK_DEFAULT_CURRENCY,
  toSubunit,
  verifyTransaction,
} from '../lib/paystack.js'

const initializeSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().min(2).max(120).optional(),
  amount: z.number().positive().max(1_000_000),
  label: z.string().trim().max(120).optional(),
})

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3035').replace(/\/+$/, '')
}

function donationReference() {
  return `ananse_${randomBytes(12).toString('hex')}`
}

export async function donationRoutes(app: FastifyInstance) {
  app.get('/api/v1/donations/config', async () => {
    const currency = getPaystackCurrency()
    return {
      enabled: isPaystackConfigured(),
      currency,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() || null,
      minAmount: currency === PAYSTACK_DEFAULT_CURRENCY ? 10 : 1,
    }
  })

  app.post('/api/v1/donations/initialize', async (request, reply) => {
    if (!isPaystackConfigured()) {
      return reply.status(503).send({ error: 'Online donations are not configured yet' })
    }

    const parsed = initializeSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const currency = getPaystackCurrency()
    const minMajor = currency === PAYSTACK_DEFAULT_CURRENCY ? 10 : 1
    if (parsed.data.amount < minMajor) {
      return reply.status(400).send({
        error: `Minimum donation is ${minMajor} ${currency}`,
      })
    }

    const reference = donationReference()
    const amountSubunit = toSubunit(parsed.data.amount)

    const donation = await prisma.donation.create({
      data: {
        reference,
        email: parsed.data.email,
        donorName: parsed.data.name,
        amount: amountSubunit,
        currency,
        label: parsed.data.label,
        status: 'pending',
      },
    })

    try {
      const paystack = await initializeTransaction({
        email: parsed.data.email,
        amountSubunit,
        currency,
        reference,
        callbackUrl: `${siteUrl()}/support?donation=success&reference=${reference}`,
        metadata: {
          donation_id: donation.id,
          label: parsed.data.label || 'Donation',
        },
      })

      return reply.send({
        ok: true,
        reference,
        accessCode: paystack.access_code,
        authorizationUrl: paystack.authorization_url,
        amount: parsed.data.amount,
        currency,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() || null,
      })
    } catch (error) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: 'failed' },
      })

      const message = error instanceof Error ? error.message : 'Unable to start payment'
      return reply.status(502).send({ error: message })
    }
  })

  app.post('/api/v1/donations/verify', async (request, reply) => {
    if (!isPaystackConfigured()) {
      return reply.status(503).send({ error: 'Online donations are not configured yet' })
    }

    const parsed = z.object({ reference: z.string().trim().min(8).max(120) }).safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid reference' })
    }

    const donation = await prisma.donation.findUnique({
      where: { reference: parsed.data.reference },
    })

    if (!donation) {
      return reply.status(404).send({ error: 'Donation not found' })
    }

    if (donation.status === 'success') {
      return reply.send({
        ok: true,
        status: 'success',
        reference: donation.reference,
        amount: fromSubunit(donation.amount),
        currency: donation.currency,
        message: 'Thank you — your gift was received.',
      })
    }

    try {
      const verified = await verifyTransaction(parsed.data.reference)

      if (verified.status !== 'success') {
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'failed' },
        })
        return reply.status(402).send({ error: 'Payment was not completed' })
      }

      const paidAt = verified.paid_at ? new Date(verified.paid_at) : new Date()

      const updated = await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: 'success',
          paystackRef: verified.reference,
          channel: verified.channel,
          paidAt,
        },
      })

      void notifyCrmWebhook('donation.success', {
        reference: updated.reference,
        email: updated.email,
        donorName: updated.donorName,
        amount: fromSubunit(updated.amount),
        currency: updated.currency,
      })

      return reply.send({
        ok: true,
        status: 'success',
        reference: donation.reference,
        amount: fromSubunit(verified.amount),
        currency: verified.currency,
        message: 'Thank you — your gift was received.',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to verify payment'
      return reply.status(502).send({ error: message })
    }
  })
}
