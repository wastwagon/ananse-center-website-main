import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import { healthRoutes } from './routes/health.js'
import { siteRoutes } from './routes/site.js'
import { eventRoutes } from './routes/events.js'
import { programRoutes } from './routes/programs.js'
import { contactRoutes } from './routes/contact.js'
import { newsletterRoutes } from './routes/newsletter.js'
import { donationRoutes } from './routes/donations.js'
import { adminRoutes } from './routes/admin/index.js'
import { mediaRoutes } from './routes/media.js'
import { ensureUploadDir, maxUploadBytes } from './lib/media-path.js'

const port = Number(process.env.BACKEND_PORT || 4000)
const host = process.env.BACKEND_HOST || '0.0.0.0'

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((value) => value.trim())
  : true

const app = Fastify({
  logger: process.env.NODE_ENV !== 'test',
})

await app.register(cors, {
  origin: corsOrigin,
  credentials: true,
})

await app.register(rateLimit, {
  max: 60,
  timeWindow: '1 minute',
})

await ensureUploadDir()

await app.register(multipart, {
  limits: {
    fileSize: maxUploadBytes(),
    files: 1,
  },
})

await app.register(healthRoutes)
await app.register(mediaRoutes)
await app.register(siteRoutes)
await app.register(eventRoutes)
await app.register(programRoutes)
await app.register(contactRoutes)
await app.register(newsletterRoutes)
await app.register(donationRoutes)
await app.register(adminRoutes)

try {
  await app.listen({ port, host })
  app.log.info(`Ananse API listening on http://${host}:${port}`)
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
