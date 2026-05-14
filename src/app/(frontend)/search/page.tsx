import { getPayloadClient } from '@/lib/payload'
import { getLocale } from '@/lib/locale'
import { SearchClient } from '@/components/SearchClient'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: locale === 'en' ? 'Search' : 'Vyhľadávanie' }
}

export default async function SearchPage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'artists',
    limit: 500,
    depth: 0,
    locale,
    sort: '-year',
  })

  const artists = result.docs.map((a) => ({
    id: String(a.id),
    name: a.name,
    work: a.work ?? null,
    place: a.place ?? null,
    year: (a.year as string) ?? '',
    city: (a.city as string) ?? '',
  }))

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {locale === 'en' ? 'Search Artists' : 'Vyhľadávanie umelcov'}
      </h1>
      <SearchClient
        artists={artists}
        locale={locale}
      />
    </div>
  )
}
