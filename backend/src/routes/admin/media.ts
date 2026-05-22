import type { FastifyInstance } from 'fastify'
import { unlink, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import {
  ALLOWED_MEDIA_MIME_TYPES,
  ensureUploadDir,
  extensionForMime,
  filePathForStoredName,
  maxUploadBytes,
} from '../../lib/media-path.js'
import { mapMedia } from '../../lib/media-map.js'

const patchSchema = z.object({
  altText: z.string().max(500).optional(),
  title: z.string().max(200).optional(),
})

export async function adminMediaRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

  app.get<{
    Querystring: { q?: string; type?: string; page?: string; limit?: string }
  }>('/api/v1/admin/media', guard, async (request) => {
    const q = request.query.q?.trim()
    const type = request.query.type?.trim()
    const page = Math.max(1, Number(request.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(request.query.limit) || 48))
    const skip = (page - 1) * limit

    const where = {
      ...(q
        ? {
            OR: [
              { originalName: { contains: q, mode: 'insensitive' as const } },
              { title: { contains: q, mode: 'insensitive' as const } },
              { altText: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(type === 'image' ? { mimeType: { startsWith: 'image/' } } : {}),
      ...(type === 'file' ? { NOT: { mimeType: { startsWith: 'image/' } } } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mediaAsset.count({ where }),
    ])

    return {
      data: items.map(mapMedia),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/media/:id', guard, async (request, reply) => {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: request.params.id } })
    if (!asset) return reply.status(404).send({ error: 'Media not found' })
    return { data: mapMedia(asset) }
  })

  app.post('/api/v1/admin/media', guard, async (request, reply) => {
    const file = await request.file()
    if (!file) {
      return reply.status(400).send({ error: 'No file uploaded' })
    }

    const mimeType = file.mimetype || 'application/octet-stream'
    if (!ALLOWED_MEDIA_MIME_TYPES.has(mimeType)) {
      return reply.status(400).send({ error: `File type not allowed: ${mimeType}` })
    }

    const buffer = await file.toBuffer()
    if (buffer.byteLength > maxUploadBytes()) {
      return reply.status(400).send({ error: 'File exceeds maximum upload size' })
    }

    const ext = extensionForMime(mimeType) || pathExtFromName(file.filename)
    const storedName = `${randomUUID()}${ext}`
    await ensureUploadDir()
    await writeFile(filePathForStoredName(storedName), buffer)

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: storedName,
        originalName: file.filename,
        mimeType,
        sizeBytes: buffer.byteLength,
        altText: '',
        title: file.filename,
      },
    })

    return reply.status(201).send({ data: mapMedia(asset) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/media/:id', guard, async (request, reply) => {
    const parsed = patchSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body', details: parsed.error.flatten() })
    }

    const asset = await prisma.mediaAsset.update({
      where: { id: request.params.id },
      data: parsed.data,
    })

    return { data: mapMedia(asset) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/media/:id', guard, async (request, reply) => {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: request.params.id } })
    if (!asset) return reply.status(404).send({ error: 'Media not found' })

    await prisma.$transaction([
      prisma.event.updateMany({ where: { coverMediaId: asset.id }, data: { coverMediaId: null } }),
      prisma.program.updateMany({ where: { coverMediaId: asset.id }, data: { coverMediaId: null } }),
      prisma.mediaAsset.delete({ where: { id: asset.id } }),
    ])

    try {
      await unlink(filePathForStoredName(asset.filename))
    } catch {
      /* file may already be gone */
    }

    return { ok: true }
  })
}

function pathExtFromName(name: string) {
  const match = name.match(/\.[a-zA-Z0-9]+$/)
  return match ? match[0].toLowerCase() : ''
}
