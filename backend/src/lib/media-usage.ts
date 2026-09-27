import type { PrismaClient } from '@prisma/client'
import { mediaPublicPath } from './media-url.js'

export type MediaUsageRef = {
  kind: string
  id: string
  title: string
  href: string
  field: string
}

export type MediaUsage = {
  total: number
  refs: MediaUsageRef[]
}

function asStringIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

/** Collect every place a media asset is attached (FK columns, galleries, CMS URL strings). */
export async function collectMediaUsage(
  prisma: PrismaClient,
  mediaId: string,
): Promise<MediaUsage> {
  const publicPath = mediaPublicPath(mediaId)
  const refs: MediaUsageRef[] = []

  const [
    eventCovers,
    events,
    programCovers,
    newsCovers,
    peoplePhotos,
    peopleLogos,
    libraryCovers,
    libraryAudio,
    libraryVideo,
    albumCovers,
    albumImages,
    contentBlocks,
  ] = await Promise.all([
    prisma.event.findMany({
      where: { coverMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.event.findMany({ select: { id: true, title: true, slug: true, galleryMediaIds: true } }),
    prisma.program.findMany({
      where: { coverMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.newsPost.findMany({
      where: { coverMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.person.findMany({
      where: { photoMediaId: mediaId },
      select: { id: true, name: true, slug: true },
    }),
    prisma.person.findMany({
      where: { logoMediaId: mediaId },
      select: { id: true, name: true, slug: true },
    }),
    prisma.libraryItem.findMany({
      where: { coverMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.libraryItem.findMany({
      where: { audioMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.libraryItem.findMany({
      where: { videoMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.photoAlbum.findMany({
      where: { coverMediaId: mediaId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.photoAlbumImage.findMany({
      where: { mediaId },
      select: {
        id: true,
        album: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.contentBlock.findMany({
      where: { body: { contains: publicPath } },
      select: { id: true, key: true, label: true },
    }),
  ])

  for (const row of eventCovers) {
    refs.push({
      kind: 'Event',
      id: row.id,
      title: row.title,
      href: `/admin/events`,
      field: 'cover',
    })
  }
  for (const row of events) {
    if (!asStringIds(row.galleryMediaIds).includes(mediaId)) continue
    refs.push({
      kind: 'Event',
      id: row.id,
      title: row.title,
      href: `/admin/events`,
      field: 'gallery',
    })
  }
  for (const row of programCovers) {
    refs.push({
      kind: 'Program',
      id: row.id,
      title: row.title,
      href: `/admin/programs`,
      field: 'cover',
    })
  }
  for (const row of newsCovers) {
    refs.push({
      kind: 'Insight',
      id: row.id,
      title: row.title,
      href: `/admin/insights`,
      field: 'cover',
    })
  }
  for (const row of peoplePhotos) {
    refs.push({
      kind: 'Person',
      id: row.id,
      title: row.name,
      href: `/admin/people`,
      field: 'photo',
    })
  }
  for (const row of peopleLogos) {
    refs.push({
      kind: 'Person',
      id: row.id,
      title: row.name,
      href: `/admin/people`,
      field: 'logo',
    })
  }
  for (const row of libraryCovers) {
    refs.push({
      kind: 'Library',
      id: row.id,
      title: row.title,
      href: `/admin/library`,
      field: 'cover',
    })
  }
  for (const row of libraryAudio) {
    refs.push({
      kind: 'Library',
      id: row.id,
      title: row.title,
      href: `/admin/library`,
      field: 'audio',
    })
  }
  for (const row of libraryVideo) {
    refs.push({
      kind: 'Library',
      id: row.id,
      title: row.title,
      href: `/admin/library`,
      field: 'video',
    })
  }
  for (const row of albumCovers) {
    refs.push({
      kind: 'Photo album',
      id: row.id,
      title: row.title,
      href: `/admin/photo-albums`,
      field: 'cover',
    })
  }
  for (const row of albumImages) {
    refs.push({
      kind: 'Photo album',
      id: row.album.id,
      title: row.album.title,
      href: `/admin/photo-albums`,
      field: 'image',
    })
  }
  for (const row of contentBlocks) {
    refs.push({
      kind: 'Site content',
      id: row.id,
      title: row.label || row.key,
      href: `/admin/content`,
      field: 'body URL',
    })
  }

  return { total: refs.length, refs }
}

/** Detach media from all records and scrub CMS URL strings. Does not delete the asset. */
export async function detachMediaEverywhere(prisma: PrismaClient, mediaId: string) {
  const publicPath = mediaPublicPath(mediaId)

  await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.event.updateMany({ where: { coverMediaId: mediaId }, data: { coverMediaId: null } }),
      tx.program.updateMany({ where: { coverMediaId: mediaId }, data: { coverMediaId: null } }),
      tx.newsPost.updateMany({ where: { coverMediaId: mediaId }, data: { coverMediaId: null } }),
      tx.person.updateMany({ where: { photoMediaId: mediaId }, data: { photoMediaId: null } }),
      tx.person.updateMany({ where: { logoMediaId: mediaId }, data: { logoMediaId: null } }),
      tx.libraryItem.updateMany({ where: { coverMediaId: mediaId }, data: { coverMediaId: null } }),
      tx.libraryItem.updateMany({ where: { audioMediaId: mediaId }, data: { audioMediaId: null } }),
      tx.libraryItem.updateMany({ where: { videoMediaId: mediaId }, data: { videoMediaId: null } }),
      tx.photoAlbum.updateMany({ where: { coverMediaId: mediaId }, data: { coverMediaId: null } }),
      tx.photoAlbumImage.deleteMany({ where: { mediaId } }),
    ])

    const eventsWithGallery = await tx.event.findMany({
      select: { id: true, galleryMediaIds: true },
    })
    for (const event of eventsWithGallery) {
      const ids = asStringIds(event.galleryMediaIds)
      if (!ids.includes(mediaId)) continue
      await tx.event.update({
        where: { id: event.id },
        data: { galleryMediaIds: ids.filter((id) => id !== mediaId) },
      })
    }

    const blocks = await tx.contentBlock.findMany({
      where: { body: { contains: publicPath } },
      select: { id: true, body: true },
    })
    for (const block of blocks) {
      const nextBody = block.body.split(publicPath).join('')
      if (nextBody === block.body) continue
      await tx.contentBlock.update({
        where: { id: block.id },
        data: { body: nextBody },
      })
    }
  })
}
