import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { getLocale, UI_STRINGS } from '@/lib/locale'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `${t.tickets} — ${cityName}` }
}

export default async function TicketsPage({ params }: Props) {
  const { city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityCode = city as CityCode

  const payload = await getPayloadClient()
  const ticket = await payload.findGlobal({ slug: 'ticket-settings' })

  const link = cityCode === 'ba' ? ticket.linkBA : ticket.linkKE

  return (
    <div className="px-6 pt-16 sm:pt-24 pb-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.tickets}</h1>

      {!ticket.saleEnabled ? (
        <div className="border border-white/10 rounded p-8 text-center">
          <p className="text-white/60 text-lg">{t.ticketsClosed}</p>
        </div>
      ) : (
        <div className="border border-white/10 rounded p-8 text-center space-y-6">
          <p className="text-lg">{t.ticketsOpen}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-accent text-black font-medium hover:bg-accent-hover transition-colors"
            >
              {t.buyTickets} — {CITIES[cityCode].label}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
