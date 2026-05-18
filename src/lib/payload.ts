import config from '@payload-config'
import { getPayload } from 'payload'
import type { FestivalSetting, BrandingSetting, NavigationSetting, TicketSetting } from '@/payload-types'
import type { Locale } from '@/lib/i18n'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getFestivalSettings(locale?: Locale): Promise<FestivalSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'festival-settings', ...(locale && { locale }) }).catch(() => null)
}

export async function getBrandingSettings(locale?: Locale): Promise<BrandingSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'branding-settings', depth: 1, ...(locale && { locale }) }).catch(() => null)
}

export async function getNavigationSettings(locale?: Locale): Promise<NavigationSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation-settings', ...(locale && { locale }) }).catch(() => null)
}

export async function getTicketSettings(): Promise<TicketSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'ticket-settings' }).catch(() => null)
}
