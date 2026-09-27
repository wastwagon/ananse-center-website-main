import { PrismaClient } from '@prisma/client'

async function main() {
  const p = new PrismaClient()
  const s = await p.siteSettings.findFirst()
  console.log(
    JSON.stringify(
      { name: s?.siteName, location: s?.location, address: s?.address },
      null,
      2,
    ),
  )
  if (s) {
    const artsName = /arts and culture/i.test(String(s.siteName || ''))
    const artsPlace =
      /akatakyiwa/i.test(String(s.location || '')) ||
      /akatakyiwa|arts and culture/i.test(String(s.address || ''))
    if (artsName || artsPlace) {
      await p.siteSettings.update({
        where: { id: s.id },
        data: {
          siteName: artsName
            ? 'ANANSE Center for Leadership Development'
            : s.siteName,
          location: /akatakyiwa/i.test(String(s.location || ''))
            ? 'Ghana'
            : s.location,
          address:
            artsPlace || artsName
              ? 'ANANSE Center for Leadership Development\nGhana'
              : s.address,
        },
      })
      console.log('patched siteSettings')
    } else {
      console.log('siteSettings ok')
    }
  } else {
    console.log('no siteSettings row')
  }

  const arts = await p.contentBlock.findMany({
    where: {
      OR: [
        { body: { contains: 'Akatakyiwa' } },
        { body: { contains: 'Arts and Culture' } },
      ],
    },
    select: { key: true },
  })
  console.log('arts content keys', arts.map((x) => x.key))
  await p.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
