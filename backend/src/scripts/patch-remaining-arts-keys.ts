import { PrismaClient } from '@prisma/client'

const updates: Array<[string, string]> = [
  ['contact.map.heading', 'Find ANANSE'],
  [
    'contact.map.subtitle',
    'Ghana — write to us using the form on Get Involved',
  ],
  [
    'seo.visit.description',
    'Connect with ANANSE Center for Leadership Development — get involved, attend events, and explore programs.',
  ],
  [
    'seo.news.description',
    'ANANSE Insights — ideas for living, leading, and serving.',
  ],
  [
    'seo.trustees.description',
    'The ANANSE community — leadership and partners.',
  ],
]

async function main() {
  const p = new PrismaClient()
  for (const [key, body] of updates) {
    const r = await p.contentBlock.updateMany({ where: { key }, data: { body } })
    console.log(key, r.count)
  }
  await p.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
