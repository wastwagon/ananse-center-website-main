import { prisma } from './prisma.js'
import { promoteDueScheduledContent } from './publication.js'

const INTERVAL_MS = Number(process.env.SCHEDULED_PUBLISH_INTERVAL_MS || 60_000)

/** Promote due scheduled content on an interval (and once at boot). */
export function startScheduledPublishWorker(log?: { info: (obj: unknown, msg?: string) => void }) {
  const run = async () => {
    try {
      const count = await promoteDueScheduledContent(prisma)
      if (count > 0) {
        log?.info({ count }, 'Promoted scheduled content to published')
      }
    } catch (error) {
      log?.info({ err: error }, 'Scheduled publish promotion failed')
    }
  }
  void run()
  const timer = setInterval(() => void run(), INTERVAL_MS)
  if (typeof timer.unref === 'function') timer.unref()
  return timer
}
