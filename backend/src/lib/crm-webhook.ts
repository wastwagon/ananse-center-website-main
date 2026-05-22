/** Optional CRM webhook (HubSpot/Zapier/etc.) — fire-and-forget. */
export async function notifyCrmWebhook(
  event: 'donation.success' | 'contact.created' | 'newsletter.subscribed',
  payload: Record<string, unknown>,
) {
  const url = process.env.CRM_WEBHOOK_URL?.trim()
  if (!url) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, at: new Date().toISOString(), ...payload }),
    })
  } catch (error) {
    console.warn('[crm-webhook] Delivery failed:', error instanceof Error ? error.message : error)
  }
}
