import { getPayloadClient } from '@/lib/payload'
import { CITIES, type CityCode } from '@/lib/constants'
import { getLocale, UI_STRINGS } from '@/lib/locale'
import { ProgramTimeline } from '@/components/ProgramTimeline'

type Props = {
  params: Promise<{ year: string; city: string }>
}

export async function generateMetadata({ params }: Props) {
  const { year, city } = await params
  const locale = await getLocale()
  const cityName = CITIES[city as CityCode]?.label ?? city
  const title = locale === 'en' ? 'Program' : 'Program'
  return { title: `${title} — ${cityName} ${year.replace('y', '')}` }
}

export default async function ProgramPage({ params }: Props) {
  const { year, city } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const cityCode = city as CityCode
  const yearNum = year.replace('y', '')

  const payload = await getPayloadClient()

  const [artistsResult, festivalSettings] = await Promise.all([
    payload.find({
      collection: 'artists',
      where: {
        city: { equals: cityCode },
        year: { equals: yearNum },
      },
      limit: 200,
      depth: 1,
      locale,
    }),
    payload.findGlobal({ slug: 'festival-settings' }),
  ])

  const events = artistsResult.docs
    .filter((a) => Array.isArray(a.dates) && a.dates.length > 0)
    .map((a) => {
      const dates = a.dates as { id: number; dateText?: string; start?: string; end?: string; display?: boolean }[]
      const firstDate = dates[0]
      return {
        id: String(a.id),
        name: a.name,
        work: a.work ?? null,
        place: a.place ?? null,
        dateText: firstDate?.dateText ?? null,
        start: firstDate?.start ?? null,
        end: firstDate?.end ?? null,
      }
    })

  const settings = festivalSettings as unknown as Record<string, unknown>
  const debugMode = (settings?.debugMode as boolean) ?? false
  const debugTime = debugMode ? (settings?.debugTime as string | null) : null

  return (
    <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        {t.program ?? 'Program'}
      </h1>
      <p className="text-white/50 text-sm mb-8">
        {CITIES[cityCode]?.label} {yearNum}
      </p>
      <ProgramTimeline
        events={events}
        city={cityCode}
        year={yearNum}
        locale={locale}
        debugMode={debugMode}
        debugTime={debugTime}
      />
    </div>
  )
}
