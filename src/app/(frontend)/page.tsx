import Link from 'next/link'
import { OffFestivalHome } from '@/components/OffFestivalHome'
import { Stars } from '@/components/Stars'
import { getPayloadClient } from '@/lib/payload'
import { getLocale } from '@/lib/locale'

function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as Record<string, unknown>
  if (m.filename) return `${process.env.NEXT_PUBLIC_S3_URL}/${m.filename}`
  if (m.url) return m.url as string
  return null
}

export default async function HomePage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const [festivalSettingsRaw, brandingSettingsRaw] = await Promise.all([
    payload.findGlobal({ slug: 'festival-settings' }).catch(() => null),
    payload.findGlobal({ slug: 'branding-settings' as 'festival-settings', depth: 1 }).catch(() => null),
  ])

  const settings = festivalSettingsRaw as Record<string, unknown> | null
  const branding = brandingSettingsRaw as Record<string, unknown> | null
  const festivalActive = (settings?.festivalActive as boolean) ?? true
  const currentYear = (settings?.currentYear as string) ?? '2025'

  if (!festivalActive) {
    const articlesResult = await payload.find({
      collection: 'articles',
      limit: 20,
      sort: '-createdAt',
      locale,
    }).catch(() => null)

    const articles = (articlesResult?.docs ?? []).map((a) => ({
      id: String(a.id),
      title: (a.title as string) || '',
      excerpt: '',
      createdAt: (a as unknown as { createdAt: string }).createdAt,
    }))

    return <OffFestivalHome articles={articles} locale={locale} />
  }

  // Stars
  const starsGroup = branding?.stars as Record<string, unknown> | null
  const starsEnabled = (starsGroup?.enabled as boolean) ?? true
  const starsColorsRaw = starsGroup?.colors as Array<{ color: string }> | null
  const starsColors = starsColorsRaw?.map((c) => c.color) || ['#F5E455', '#FF5555', '#FF2AC4', '#5555FF']

  // Branding colors
  const colorsGroup = branding?.colors as Record<string, unknown> | null
  const baColor = (colorsGroup?.bratislavaBackground as string) || '#8094F7'
  const keColor = (colorsGroup?.kosiceBackground as string) || '#B2BCAC'

  // Homepage images
  const homepageGroup = branding?.homepage as Record<string, unknown> | null
  const baImage = getMediaUrl(homepageGroup?.imageBA) || '/homepage/2025/ba.png'
  const baHoverImage = getMediaUrl(homepageGroup?.imageBAHover) || '/homepage/2025/ba_hover.png'
  const keImage = getMediaUrl(homepageGroup?.imageKE) || '/homepage/2025/ke.png'
  const keHoverImage = getMediaUrl(homepageGroup?.imageKEHover) || '/homepage/2025/ke_hover.png'

  return (
    <>
    <Stars enabled={starsEnabled} colors={starsColors} />
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full overflow-hidden">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative flex items-start p-10 group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: baColor }}
      >
        <div className="w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)] grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={baImage}
            alt="Bratislava"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={baHoverImage}
            alt="Bratislava"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative flex items-start p-10 group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: keColor }}
      >
        <div className="w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)] grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={keImage}
            alt="Košice"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={keHoverImage}
            alt="Košice"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </Link>
    </div>
    </>
  )
}
