import { PrismaClient } from '@prisma/client'

async function main() {
  const p = new PrismaClient()
  const s = await p.siteSettings.findFirst()
  console.log(
    JSON.stringify(
      { name: s?.siteName, location: s?.siteLocation, address: s?.contactAddress },
      null,
      2,
    ),
  )
  if (s) {
    const artsName = /arts and culture/i.test(String(s.siteName || ''))
    const artsPlace =
      /akatakyiwa/i.test(String(s.siteLocation || '')) ||
      /akatakyiwa|arts and culture/i.test(String(s.contactAddress || ''))
    if (artsName || artsPlace) {
      await p.siteSettings.update({
        where: { id: s.id },
        data: {
          siteName: artsName
            ? 'ANANSE Center for Leadership Development'
            : s.siteName,
          siteLocation: /akatakyiwa/i.test(String(s.siteLocation || ''))
            ? 'Ghana'
            : s.siteLocation,
          contactAddress:
            artsPlace || artsName
              ? 'ANANSE Center for Leadership Development\nGhana'
              : s.contactAddress,
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
