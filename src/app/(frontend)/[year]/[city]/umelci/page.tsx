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
  const cityName = CITIES[cityCode]?.label ?? city
  const yearNum = year.replace('y', '')

  const payload = await getPayloadClient()

  const [artists, filters] = await Promise.all([
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
    payload.find({
      collection: 'filters',
      limit: 50,
      depth: 0,
      locale,
    }),
  ])

  const filterData = filters.docs.map((f) => ({
    id: String(f.id),
    title: (f.title as string) || '',
    slug: f.slug,
    color: f.color,
  }))

  const artistData = artists.docs.map((a) => ({
    id: String(a.id),
    name: a.name,
    work: a.work ?? null,
    image: a.image && typeof a.image === 'object' ? { url: a.image.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${a.image.filename}` : a.image.url ?? null } : null,
    filters: Array.isArray(a.filters)
      ? a.filters.map((f) =>
          typeof f === 'object'
            ? { id: String(f.id), title: (f.title as string) || '', slug: f.slug, color: f.color }
            : f
        )
      : [],
  }))

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t.artists}</h1>
      <p className="text-white/50 mb-8">
        {cityName} {yearNum}
      </p>

      {artists.docs.length === 0 ? (
        <p className="text-white/40">{t.noArtists}</p>
      ) : (
        <ArtistFilters
          filters={filterData}
          artists={artistData}
          yearCity={`${year}/${city}`}
        />
      )}
    </div>
  )
}
