import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Vstupenky — ${cityName}` }
}

export default async function TicketsPage({ params }: Props) {
  const { city } = await params
  const cityCode = city as CityCode

  const payload = await getPayloadClient()
  const ticket = await payload.findGlobal({ slug: 'ticket-settings' })

  const link = cityCode === 'ba' ? ticket.linkBA : ticket.linkKE

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Vstupenky</h1>

      {!ticket.saleEnabled ? (
        <div className="border border-white/10 rounded p-8 text-center">
          <p className="text-white/60 text-lg">Predaj vstupeniek je momentálne uzavretý.</p>
        </div>
      ) : (
        <div className="border border-white/10 rounded p-8 text-center space-y-6">
          <p className="text-lg">Vstupenky sú v predaji!</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#8ebc35] text-black font-medium hover:bg-[#7aa82d] transition-colors"
            >
              Kúpiť vstupenky — {CITIES[cityCode].label}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
