import { prisma } from './prisma.js'

export const SITE_SETTINGS_ID = 'default'

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: { id: SITE_SETTINGS_ID },
    update: {},
  })
}

export function mapSiteSettings(settings: {
  maintenanceMode: boolean
  maintenanceTitle: string
  maintenanceMessage: string
  updatedAt: Date
}) {
  return {
    maintenanceMode: settings.maintenanceMode,
    maintenanceTitle: settings.maintenanceTitle,
    maintenanceMessage: settings.maintenanceMessage,
    siteStatus: settings.maintenanceMode ? ('maintenance' as const) : ('live' as const),
    updatedAt: settings.updatedAt.toISOString(),
  }
}
