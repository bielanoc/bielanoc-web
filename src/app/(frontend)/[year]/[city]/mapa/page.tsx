import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { FestivalMap } from '@/components/FestivalMap'

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
    limit: 200,
    depth: 0,
  })

  const markers = artists.docs
    .filter((a) => a.latitude && a.longitude)
    .map((a) => ({
      id: String(a.id),
      name: a.name,
      work: a.work ?? null,
      place: a.place ?? null,
      lat: a.latitude!,
      lng: a.longitude!,
      href: `/${year}/${city}/umelci/${a.id}`,
    }))

  const center = CITY_CENTERS[cityCode] ?? CITY_CENTERS.ba

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mapa</h1>

      {markers.length === 0 ? (
        <div className="w-full aspect-[16/9] bg-white/5 border border-white/10 rounded flex items-center justify-center">
          <p className="text-white/40">Žiadne lokácie pre tento ročník.</p>
        </div>
      ) : (
        <FestivalMap
          markers={markers}
          center={[center.lat, center.lng]}
          zoom={center.zoom}
        />
      )}
    </div>
  )
}
