import { prisma } from './prisma.js'

function normalizePath(path: string) {
  const trimmed = path.trim()
  if (!trimmed.startsWith('/')) return ''
  const withoutTrail = trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : trimmed
  return withoutTrail
}

/** Keep the previous public URL working after a slug change. */
export async function rememberPathRedirect(fromPath: string, toPath: string) {
  const from = normalizePath(fromPath)
  const to = normalizePath(toPath)
  if (!from || !to || from === to) return

  await prisma.pathRedirect.deleteMany({ where: { fromPath: to } })
  await prisma.pathRedirect.updateMany({ where: { toPath: from }, data: { toPath: to } })
  await prisma.pathRedirect.upsert({
    where: { fromPath: from },
    create: { fromPath: from, toPath: to },
    update: { toPath: to },
  })
}
