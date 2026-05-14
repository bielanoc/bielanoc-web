import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { FestivalMap } from '@/components/FestivalMap'
import { getLocale, UI_STRINGS } from '@/lib/locale'
import Link from 'next/link'

const CITY_CENTERS = {
  ba: { lat: 48.1486, lng: 17.1077, zoom: 14 },
  ke: { lat: 48.7164, lng: 21.2611, zoom: 14 },
} as const

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Mapa — ${cityName}` }
}

export default async function MapPage({ params }: Props) {
  const { year, city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityCode = city as CityCode
  const yearNum = year.replace('y', '')

  const payload = await getPayloadClient()
  const artists = await payload.find({
    collection: 'artists',
    where: {
      city: { equals: cityCode },
      year: { equals: yearNum },
      latitude: { exists: true },
      longitude: { exists: true },
    },
    sort: 'hierarchy',
    limit: 200,
    depth: 0,
    locale,
  })

  const markers = artists.docs
    .filter((a) => a.latitude && a.longitude)
    .map((a, index) => ({
      id: String(a.id),
      name: a.name,
      work: a.work ?? null,
      place: a.place ?? null,
      lat: a.latitude!,
      lng: a.longitude!,
      href: `/${year}/${city}/umelci/${a.id}`,
      number: index + 1,
    }))

  const center = CITY_CENTERS[cityCode] ?? CITY_CENTERS.ba

  return (
    <div>
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold">{t.map}</h1>
      </div>

      {markers.length === 0 ? (
        <div className="px-6 pb-8">
          <div className="w-full aspect-[16/9] bg-white/5 border border-white/10 rounded flex items-center justify-center">
            <p className="text-white/40">{locale === 'en' ? 'No locations for this edition.' : 'Žiadne lokácie pre tento ročník.'}</p>
          </div>
        </div>
      ) : (
        <>
          <FestivalMap
            markers={markers}
            center={[center.lat, center.lng]}
            zoom={center.zoom}
          />

          <div className="px-6 py-8 max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-white/80">
              {locale === 'en' ? 'Program' : 'Program'} ({markers.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {markers.map((m) => (
                <Link
                  key={m.id}
                  href={m.href}
                  className="flex items-start gap-3 py-2 group hover:bg-white/5 rounded px-2 -mx-2 transition-colors"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#8ebc35] text-black text-xs font-bold flex items-center justify-center mt-0.5">
                    {m.number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-[#8ebc35] transition-colors truncate">
                      {m.name}
                    </p>
                    {m.place && (
                      <p className="text-xs text-white/40 truncate">{m.place}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
