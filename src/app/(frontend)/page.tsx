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
  const baVideo = getMediaUrl(branding?.homepage?.videoBA)
  const keImage = getMediaUrl(branding?.homepage?.imageKE)
  const keHoverImage = getMediaUrl(branding?.homepage?.imageKEHover)
  const keVideo = getMediaUrl(branding?.homepage?.videoKE)

  return (
    <>
    <Stars enabled={starsEnabled} colors={starsColors} />
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full overflow-hidden">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: baColor }}
      >
        <CityMedia alt="Bratislava" image={baImage} hoverImage={baHoverImage} video={baVideo} />
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: keColor }}
      >
        <CityMedia alt="Košice" image={keImage} hoverImage={keHoverImage} video={keVideo} />
      </Link>
    </div>
    </>
  )
}

function CityMedia({
  alt,
  image,
  hoverImage,
  video,
}: {
  alt: string
  image: string | null
  hoverImage: string | null
  video: string | null
}) {
  // A looping background video takes precedence. The still image doubles as the
  // poster (shown until the video is ready) and as the fallback for browsers or
  // users (prefers-reduced-motion) that don't autoplay video.
  if (video) {
    return (
      <>
        {/* Base layer: still image. Shown for reduced-motion users (video hidden
            below) and as a fallback if the video fails to load. */}
        {image && (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={image ?? undefined}
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        >
          <source src={video} />
        </video>
      </>
    )
  }

  if (!image) return null

  return (
    <>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        className="object-contain object-top-left p-6 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
      />
      {hoverImage && (
        <Image
          src={hoverImage}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          loading="lazy"
          className="object-contain object-top-left p-6 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
        />
      )}
    </>
  )
}
