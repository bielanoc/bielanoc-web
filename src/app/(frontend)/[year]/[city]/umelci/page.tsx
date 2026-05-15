import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { ArtistFilters } from '@/components/ArtistFilters'
import { getLocale, UI_STRINGS } from '@/lib/locale'

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
    payload.findGlobal({ slug: 'festival-settings' }).catch(() => null),
  ])

  const settings = festivalSettings as Record<string, unknown> | null
  const debugMode = (settings?.debugMode as boolean) ?? false
  const debugTime = (settings?.debugTime as string) ?? null

  const artistData = artists.docs.map((a, index) => {
    const hasCoords = Boolean(a.latitude && a.longitude)
    return {
      id: String(a.id),
      name: a.name,
      work: a.work ?? null,
      image: a.image && typeof a.image === 'object' ? { url: a.image.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${a.image.filename}` : a.image.url ?? null } : null,
      mapNumber: hasCoords ? index + 1 : null,
      dates: Array.isArray(a.dates)
        ? a.dates.map((d) => {
            const dateObj = d as Record<string, unknown>
            return {
              start: (dateObj.start as string) ?? null,
              end: (dateObj.end as string) ?? null,
              display: (dateObj.display as boolean) ?? true,
            }
          })
        : [],
    }
  })

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
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
