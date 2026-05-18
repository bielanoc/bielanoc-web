import Link from 'next/link'
import Image from 'next/image'
import { OffFestivalHome } from '@/components/OffFestivalHome'
import { Stars } from '@/components/Stars'
import { getPayloadClient, getFestivalSettings, getBrandingSettings } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { getLocale } from '@/lib/locale'

export default async function HomePage() {
  const locale = await getLocale()
  const [festivalSettings, branding] = await Promise.all([
    getFestivalSettings(),
    getBrandingSettings(locale),
  ])

  const festivalActive = festivalSettings?.festivalActive ?? true
  const currentYear = festivalSettings?.currentYear ?? '2025'

  if (!festivalActive) {
    const payload = await getPayloadClient()
    const articlesResult = await payload.find({
      collection: 'articles',
      limit: 20,
      sort: '-createdAt',
      depth: 1,
      locale,
    }).catch(() => null)

    const articles = (articlesResult?.docs ?? []).map((a) => {
      const cover = getMediaUrl((a as unknown as { coverImage?: unknown }).coverImage)
      return {
        id: String(a.id),
        title: a.title || '',
        excerpt: '',
        coverImage: cover,
        createdAt: a.createdAt || '',
      }
    })

    const bannerUrl = getMediaUrl(branding?.offSeason?.banner)
    const heading = branding?.offSeason?.heading || null
    const text = branding?.offSeason?.text || null

    return <OffFestivalHome articles={articles} locale={locale} bannerUrl={bannerUrl} heading={heading} richText={text} />
  }

  const starsEnabled = branding?.stars?.enabled ?? true
  const starsColors = branding?.stars?.colors?.map((c) => c.color) || ['#F5E455', '#FF5555', '#FF2AC4', '#5555FF']

  const baColor = branding?.colors?.bratislavaBackground || '#8094F7'
  const keColor = branding?.colors?.kosiceBackground || '#B2BCAC'

  const baImage = getMediaUrl(branding?.homepage?.imageBA)
  const baHoverImage = getMediaUrl(branding?.homepage?.imageBAHover)
  const keImage = getMediaUrl(branding?.homepage?.imageKE)
  const keHoverImage = getMediaUrl(branding?.homepage?.imageKEHover)

  return (
    <>
    <Stars enabled={starsEnabled} colors={starsColors} />
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full overflow-hidden">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: baColor }}
      >
        {baImage && (
          <>
            <Image
              src={baImage}
              alt="Bratislava"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain object-top-left p-6 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
            />
            {baHoverImage && (
              <Image
                src={baHoverImage}
                alt="Bratislava"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-contain object-top-left p-6 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
              />
            )}
          </>
        )}
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: keColor }}
      >
        {keImage && (
          <>
            <Image
              src={keImage}
              alt="Košice"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain object-top-left p-6 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
            />
            {keHoverImage && (
              <Image
                src={keHoverImage}
                alt="Košice"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="object-contain object-top-left p-6 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
              />
            )}
          </>
        )}
      </Link>
    </div>
    </>
  )
}
