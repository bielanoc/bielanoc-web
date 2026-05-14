import Link from 'next/link'
import { getLocale, UI_STRINGS } from '@/lib/locale'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].archive }
}

const editions = [
  { year: 'y2024', cities: ['ba', 'ke'] },
  { year: 'y2023', cities: ['ba', 'ke'] },
  { year: 'y2022', cities: ['ba', 'ke'] },
  { year: 'y2021', cities: ['ba', 'ke'] },
  { year: 'y2020', cities: ['ba', 'ke'] },
]

export default async function ArchivePage() {
  const locale = await getLocale()
  const t = UI_STRINGS[locale]

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.archive}</h1>

      <div className="space-y-4">
        {editions.map((edition) => (
          <div key={edition.year} className="border border-white/10 rounded p-4 flex items-center justify-between">
            <span className="text-lg font-medium">{edition.year.replace('y', '')}</span>
            <div className="flex gap-3">
              {edition.cities.map((city) => (
                <Link
                  key={city}
                  href={`/${edition.year}/${city}/umelci`}
                  className="px-4 py-2 border border-white/20 hover:border-[#8ebc35] text-sm uppercase tracking-wide transition-colors"
                >
                  {city.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
