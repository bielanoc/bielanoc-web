import Link from 'next/link'
import Image from 'next/image'
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
      depth: 1,
      locale,
    }).catch(() => null)

    const articles = (articlesResult?.docs ?? []).map((a) => {
      const doc = a as unknown as Record<string, unknown>
      const img = doc.coverImage
      const cover = img && typeof img === 'object'
        ? ((img as Record<string, unknown>).filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${(img as Record<string, unknown>).filename}` : ((img as Record<string, unknown>).url as string | null))
        : null
      return {
        id: String(a.id),
        title: (a.title as string) || '',
        excerpt: '',
        coverImage: cover,
        createdAt: (doc.createdAt as string) || '',
      }
    })

    const offSeasonGroup = branding?.offSeason as Record<string, unknown> | null
    const bannerUrl = getMediaUrl(offSeasonGroup?.banner)
    const heading = (offSeasonGroup?.heading as string) || null
    const text = (offSeasonGroup?.text as unknown) || null

    return <OffFestivalHome articles={articles} locale={locale} bannerUrl={bannerUrl} heading={heading} richText={text} />
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
  const baImage = getMediaUrl(homepageGroup?.imageBA)
  const baHoverImage = getMediaUrl(homepageGroup?.imageBAHover)
  const keImage = getMediaUrl(homepageGroup?.imageKE)
  const keHoverImage = getMediaUrl(homepageGroup?.imageKEHover)

  return (
    <>
    <Stars enabled={starsEnabled} colors={starsColors} />
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full overflow-hidden">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative flex items-start p-10 group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: baColor }}
      >
        {baImage && (
          <div className="relative w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)]">
            <Image
              src={baImage}
              alt="Bratislava"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain object-top-left transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
            />
            {baHoverImage && (
              <Image
                src={baHoverImage}
                alt="Bratislava"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-contain object-top-left transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
              />
            )}
          </div>
        )}
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative flex items-start p-10 group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: keColor }}
      >
        {keImage && (
          <div className="relative w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)]">
            <Image
              src={keImage}
              alt="Košice"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain object-top-left transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
            />
            {keHoverImage && (
              <Image
                src={keHoverImage}
                alt="Košice"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-contain object-top-left transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
              />
            )}
          </div>
        )}
      </Link>
    </div>
    </>
  )
}
