import { getPayloadClient } from '@/lib/payload'
import { CITIES, PARTNER_CATEGORIES, type CityCode } from '@/lib/constants'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `Partneri — ${cityName}` }
}

export default async function PartnersPage({ params }: Props) {
  const { year, city } = await params
  const cityCode = city as CityCode
  const yearNum = year.replace('y', '')
  const cityField = cityCode === 'ba' ? 'bratislava' : 'kosice'

  const payload = await getPayloadClient()
  const partners = await payload.find({
    collection: 'partners',
    where: {
      year: { equals: yearNum },
      [cityField]: { equals: true },
    },
    limit: 200,
    depth: 1,
  })

  const grouped = PARTNER_CATEGORIES.map((cat) => ({
    ...cat,
    partners: partners.docs.filter((p) => p.category === cat.value),
  })).filter((g) => g.partners.length > 0)

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Partneri</h1>

      {grouped.length === 0 ? (
        <p className="text-white/40">Žiadni partneri pre tento ročník.</p>
      ) : (
        <div className="space-y-12">
          {grouped.map((group) => (
            <section key={group.value}>
              <h2 className="text-sm text-white/50 uppercase tracking-wide mb-4">
                {group.label}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
                {group.partners.map((partner) => {
                  const logo = typeof partner.logo === 'object' ? partner.logo : null
                  const content = (
                    <div className="flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded hover:border-white/30 transition-colors aspect-[3/2]">
                      {logo?.url ? (
                        <img src={logo.url} alt={partner.name} loading="lazy" decoding="async" className="max-h-16 max-w-full object-contain" />
                      ) : (
                        <span className="text-xs text-white/40 text-center">{partner.name}</span>
                      )}
                    </div>
                  )
                  if (partner.link) {
                    return (
                      <a key={partner.id} href={partner.link} target="_blank" rel="noopener noreferrer">
                        {content}
                      </a>
                    )
                  }
                  return <div key={partner.id}>{content}</div>
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
