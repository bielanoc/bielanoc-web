import { getPayloadClient } from '@/lib/payload'
import { getMediaSrc } from '@/lib/media'
import { CITIES, PARTNER_CATEGORIES, type CityCode } from '@/lib/constants'
import { getLocale, UI_STRINGS } from '@/lib/locale'
import Image from 'next/image'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `${t.partners} — ${cityName}` }
}

export default async function PartnersPage({ params }: Props) {
  const { year, city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
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
    <div className="px-6 pt-16 sm:pt-24 pb-8 max-w-5xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-12">{t.partners}</h1>

      {grouped.length === 0 ? (
        <p className="text-white/40">Žiadni partneri pre tento ročník.</p>
      ) : (
        <div className="space-y-14">
          {grouped.map((group) => (
            <section key={group.value}>
              <h2 className="text-sm text-accent uppercase tracking-wide font-semibold mb-6">
                {group.label}
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8">
                {group.partners.map((partner) => {
                  const logo = typeof partner.logo === 'object' ? partner.logo : null
                  const logoSrc = getMediaSrc(logo)
                  const content = logoSrc ? (
                    <div className="flex items-center justify-center h-20 w-40 sm:w-44">
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        width={200}
                        height={80}
                        sizes="200px"
                        className="max-h-16 max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-white/50 px-4">{partner.name}</span>
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
