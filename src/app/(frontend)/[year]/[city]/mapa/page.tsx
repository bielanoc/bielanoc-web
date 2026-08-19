import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { MapPageClient } from '@/components/MapPageClient'
import { getLocale } from '@/lib/locale'

const CITY_CENTERS = {
  ba: { lat: 48.1486, lng: 17.1077 },
  ke: { lat: 48.7164, lng: 21.2611 },
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

  const backLabel = locale === 'en' ? '← Back to artists' : '← Späť na umelcov'

  return (
    <>
      {/* Sits below the floating logo + edition label (top-left overlay), whose
          width varies with the city/year, so we clear it vertically. */}
      <div className="px-6 pt-16 sm:pt-24">
        <Link
          href={`/${year}/${city}/umelci`}
          className="text-sm text-white/50 hover:text-white transition-colors inline-block"
        >
          {backLabel}
        </Link>
      </div>
      {markers.length === 0 ? (
        <div className="px-6 py-8">
          <div className="w-full aspect-[16/9] bg-white/5 border border-white/10 rounded flex items-center justify-center">
            <p className="text-white/40">{locale === 'en' ? 'No locations for this edition.' : 'Žiadne lokácie pre tento ročník.'}</p>
          </div>
        </div>
      ) : (
        <MapPageClient
          markers={markers}
          center={[center.lat, center.lng]}
          moreInfoLabel={locale === 'en' ? 'More info' : 'Viac info'}
          navigateLabel={locale === 'en' ? 'Navigate' : 'Navigovať'}
        />
      )}
    </>
  )
}
