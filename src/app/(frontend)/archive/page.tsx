import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Archív' }

const editions = [
  { year: 'y2024', cities: ['ba', 'ke'] },
  { year: 'y2023', cities: ['ba', 'ke'] },
  { year: 'y2022', cities: ['ba', 'ke'] },
  { year: 'y2021', cities: ['ba', 'ke'] },
]

export default function ArchivePage() {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Archív</h1>

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
