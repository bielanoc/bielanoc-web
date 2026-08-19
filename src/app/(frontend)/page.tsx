import Link from 'next/link'
import Image from 'next/image'
import { OffFestivalHome } from '@/components/OffFestivalHome'
import { getPayloadClient, getFestivalSettings, getBrandingSettings } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { getLocale } from '@/lib/locale'

export default async function HomePage() {
  const locale = await getLocale()
  const [festivalSettings, branding] = await Promise.all([
    getFestivalSettings(locale),
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

  const baColor = branding?.colors?.bratislavaBackground || '#8094F7'
  const keColor = branding?.colors?.kosiceBackground || '#B2BCAC'

  const baImage = getMediaUrl(branding?.homepage?.imageBA)
  const baHoverImage = getMediaUrl(branding?.homepage?.imageBAHover)
  const baVideo = getMediaUrl(branding?.homepage?.videoBA)
  const keImage = getMediaUrl(branding?.homepage?.imageKE)
  const keHoverImage = getMediaUrl(branding?.homepage?.imageKEHover)
  const keVideo = getMediaUrl(branding?.homepage?.videoKE)

  const baDates = festivalSettings?.dateInfoBA || null
  const keDates = festivalSettings?.dateInfoKE || null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full overflow-hidden">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: baColor }}
      >
        <CityMedia alt="Bratislava" image={baImage} hoverImage={baHoverImage} video={baVideo} />
        <CityOverlay name="Bratislava" dates={baDates} />
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
        style={{ backgroundColor: keColor }}
      >
        <CityMedia alt="Košice" image={keImage} hoverImage={keHoverImage} video={keVideo} />
        <CityOverlay name="Košice" dates={keDates} />
      </Link>
    </div>
  )
}

// City name (centered) + festival dates (bottom) rendered over the panel media,
// matching the 2026 homepage design. Non-interactive so clicks fall through to
// the wrapping Link.
function CityOverlay({ name, dates }: { name: string; dates: string | null }) {
  // The stored date string may already end with the city name
  // (e.g. "2. – 4. október 2026 Bratislava"); strip it so it isn't repeated
  // under the large city heading.
  const dateLine = dates?.replace(new RegExp(`\\s*${name}\\s*$`, 'i'), '').trim() || null
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <span className="text-center font-bold uppercase tracking-wide text-white text-4xl sm:text-6xl lg:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
        {name}
      </span>
      {dateLine && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 font-bold uppercase text-white text-lg sm:text-2xl lg:text-3xl [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            {dateLine}
          </span>
        </>
      )}
    </div>
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
