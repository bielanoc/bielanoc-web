'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type Artist = {
  id: string
  name: string
  work: string | null
  place: string | null
  year: string
  city: string
}

type Props = {
  artists: Artist[]
  locale: string
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function SearchClient({ artists, locale }: Props) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (q.length < 2) return []

    const terms = q.split(/\s+/)

    return artists
      .filter((a) => {
        const searchable = normalize(
          [a.name, a.work, a.place, a.year, a.city === 'ba' ? 'bratislava' : 'košice kosice'].join(' ')
        )
        return terms.every((term) => searchable.includes(term))
      })
      .slice(0, 30)
  }, [query, artists])

  return (
    <div>
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locale === 'en' ? 'Artist name, artwork, or place...' : 'Meno umelca, dielo alebo miesto...'}
          autoFocus
          className="w-full px-5 py-4 text-lg bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#8ebc35] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xl"
          >
            ×
          </button>
        )}
      </div>

      {query.trim().length < 2 && (
        <p className="text-center text-white/40">
          {locale === 'en'
            ? 'Type at least 2 characters to search...'
            : 'Zadajte aspoň 2 znaky pre vyhľadávanie...'}
        </p>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="text-center text-white/40">
          {locale === 'en'
            ? 'No results found.'
            : 'Žiadne výsledky.'}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((a) => (
            <Link
              key={`${a.id}-${a.year}-${a.city}`}
              href={`/${a.year}/${a.city}/umelci/${a.id}`}
              className="block px-4 py-3 border border-white/10 rounded-lg hover:border-[#8ebc35]/50 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{a.name}</p>
                  {a.work && (
                    <p className="text-sm text-white/50 truncate">{a.work}</p>
                  )}
                  {a.place && (
                    <p className="text-xs text-white/30 truncate">{a.place}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                    {a.year}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60 uppercase">
                    {a.city}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
