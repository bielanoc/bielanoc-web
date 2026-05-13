import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import Link from 'next/link'

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
  const cityCode = city as CityCode
  const cityName = CITIES[cityCode]?.label ?? city
  const yearNum = year.replace('y', '')

  const payload = await getPayloadClient()
  const artists = await payload.find({
    collection: 'artists',
    where: {
      city: { equals: cityCode },
      year: { equals: yearNum },
    },
    sort: 'hierarchy',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Umelci
      </h1>
      <p className="text-white/50 mb-8">
        {cityName} {yearNum}
      </p>

      {artists.docs.length === 0 ? (
        <p className="text-white/40">Žiadni umelci pre tento ročník.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {artists.docs.map((artist) => (
            <Link
              key={artist.id}
              href={`/${year}/${city}/umelci/${artist.id}`}
              className="block mb-4 break-inside-avoid group relative overflow-hidden border border-white/10 hover:border-[#8ebc35]/50 transition-colors"
            >
              {artist.image && typeof artist.image === 'object' && artist.image.url ? (
                <img
                  src={artist.image.url}
                  alt={artist.name}
                  className="w-full aspect-[3/4] object-cover"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-4xl">{artist.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium">{artist.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
