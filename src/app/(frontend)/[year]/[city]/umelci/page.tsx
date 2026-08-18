import { getPayloadClient, getFestivalSettings } from '@/lib/payload'
import { getMediaSrc } from '@/lib/media'
import { CITIES, type CityCode } from '@/lib/constants'
import { ArtistFilters } from '@/components/ArtistFilters'
import { getLocale, UI_STRINGS } from '@/lib/locale'
import type { Artist } from '@/payload-types'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Umelci — ${cityName} ${year.replace('y', '')}` }
}

export default async function ArtistsPage({ params }: Props) {
  const { year, city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityCode = city as CityCode
  const yearNum = year.replace('y', '')

  const payload = await getPayloadClient()

  const [artists, festivalSettings] = await Promise.all([
    payload.find({
      collection: 'artists',
      where: {
        city: { equals: cityCode },
        year: { equals: yearNum },
      },
      sort: 'hierarchy',
      limit: 200,
      depth: 1,
      locale,
    }),
    getFestivalSettings(),
  ])

  const debugMode = festivalSettings?.debugMode ?? false
  const debugTime = festivalSettings?.debugTime ?? null

  const artistData = artists.docs.map((a: Artist, index: number) => {
    const hasCoords = Boolean(a.latitude && a.longitude)
    const image = a.image && typeof a.image === 'object' ? a.image : null
    return {
      id: String(a.id),
      name: a.name,
      work: a.work ?? null,
      image: image ? { url: getMediaSrc(image) } : null,
      mapNumber: hasCoords ? index + 1 : null,
      dates: Array.isArray(a.dates)
        ? a.dates.filter((d): d is Exclude<typeof d, number> => typeof d !== 'number').map((d) => ({
            start: d.start ?? null,
            end: d.end ?? null,
            display: d.display ?? true,
          }))
        : [],
    }
  })

  return (
    <div className="px-6 pt-16 sm:pt-24 pb-8 max-w-7xl mx-auto">
      {artists.docs.length === 0 ? (
        <p className="text-white/40">{t.noArtists}</p>
      ) : (
        <ArtistFilters
          artists={artistData}
          yearCity={`${year}/${city}`}
          debugMode={debugMode}
          debugTime={debugTime}
          locale={locale}
        />
      )}
    </div>
  )
}
