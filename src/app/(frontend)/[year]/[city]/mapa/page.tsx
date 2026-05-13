import { CITIES, type CityCode } from '@/lib/constants'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Mapa — ${cityName}` }
}

export default async function MapPage({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mapa</h1>
      <div className="aspect-[16/9] bg-white/5 border border-white/10 rounded flex items-center justify-center">
        <p className="text-white/40">
          Interaktívna mapa — {cityName} (pripravujeme)
        </p>
      </div>
    </div>
  )
}
