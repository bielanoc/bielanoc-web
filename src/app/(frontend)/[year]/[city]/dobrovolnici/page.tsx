import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { RichText } from '@/components/RichText'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Dobrovoľníci — ${cityName}` }
}

export default async function VolunteersPage({ params }: Props) {
  const { city } = await params
  const cityCode = city as CityCode

  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'volunteers' })

  const content = cityCode === 'ba' ? data.contentBA : data.contentKE

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dobrovoľníci</h1>
      <div className="prose prose-invert max-w-none">
        <RichText content={content} />
      </div>
    </div>
  )
}
