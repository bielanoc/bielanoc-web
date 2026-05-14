import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { RichText } from '@/components/RichText'
import { getLocale } from '@/lib/locale'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params
  const locale = await getLocale()
  const cityName = CITIES[city as CityCode]?.label ?? city
  return { title: `${locale === 'en' ? 'Info' : 'Info'} — ${cityName}` }
}

export default async function InfoPage({ params }: Props) {
  const { city } = await params
  const locale = await getLocale()
  const cityCode = city as CityCode

  const payload = await getPayloadClient()
  const info = await payload.findGlobal({ slug: 'practical-info', locale })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: Array<{ id?: string | null; title?: string | null; text?: any }> =
    (cityCode === 'ba' ? info.sectionsBA : info.sectionsKE) || []

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{locale === 'en' ? 'Practical Information' : 'Praktické informácie'}</h1>

      {!sections || sections.length === 0 ? (
        <p className="text-white/40">Žiadne informácie.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section, i) => (
            <details key={section.id || i} className="group border border-white/10 rounded">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="font-medium">{section.title}</span>
                <span className="text-white/40 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="p-4 pt-0 text-white/70">
                <RichText content={section.text} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
