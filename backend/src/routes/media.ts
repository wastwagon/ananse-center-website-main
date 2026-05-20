import type { FastifyInstance } from 'fastify'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { prisma } from '../lib/prisma.js'
import { filePathForStoredName } from '../lib/media-path.js'

export async function mediaRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/api/v1/media/file/:id', async (request, reply) => {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: request.params.id } })
    if (!asset) {
      return reply.status(404).send({ error: 'Media not found' })
    }

    const filePath = filePathForStoredName(asset.filename)
    try {
      const fileStat = await stat(filePath)
      if (!fileStat.isFile()) {
        return reply.status(404).send({ error: 'File missing on disk' })
      }
    } catch {
      return reply.status(404).send({ error: 'File missing on disk' })
    }

    reply
      .header('Content-Type', asset.mimeType)
      .header('Content-Length', String(asset.sizeBytes))
      .header('Cache-Control', 'public, max-age=31536000, immutable')
      .header('Content-Disposition', `inline; filename="${encodeURIComponent(asset.originalName)}"`)

    return reply.send(createReadStream(filePath))
  })
}
