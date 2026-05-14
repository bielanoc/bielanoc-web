'use client'

import { useState } from 'react'

type Filter = {
  id: string
  title: string
  slug: string
  color: string
}

type Artist = {
  id: string
  name: string
  work?: string | null
  image?: { url?: string | null } | null
  filters?: (Filter | string | number)[]
}

type Props = {
  filters: Filter[]
  artists: Artist[]
  yearCity: string
}

export function ArtistFilters({ filters, artists, yearCity }: Props) {
  const [active, setActive] = useState<string[]>([])

  const toggle = (slug: string) => {
    setActive((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const filtered = active.length === 0
    ? artists
    : artists.filter((artist) => {
        if (!artist.filters) return false
        return artist.filters.some((f) => {
          const filter = typeof f === 'object' ? f : null
          return filter && active.includes(filter.slug)
        })
      })

  return (
    <>
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => {
            const isActive = active.includes(filter.slug)
            return (
              <button
                key={filter.id}
                onClick={() => toggle(filter.slug)}
                className="flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm transition-colors"
                style={{
                  borderColor: isActive ? filter.color : 'rgba(255,255,255,0.15)',
                  backgroundColor: isActive ? `${filter.color}20` : 'transparent',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? filter.color : 'transparent',
                    border: `2px solid ${filter.color}`,
                  }}
                />
                <span className={isActive ? 'text-white' : 'text-white/60'}>
                  {filter.title}
                </span>
              </button>
            )
          })}
          {active.length > 0 && (
            <button
              onClick={() => setActive([])}
              className="px-3 py-1.5 text-sm text-white/40 hover:text-white transition-colors"
            >
              Zrušiť filter
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-white/40">Žiadni umelci pre tento filter.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {filtered.map((artist) => (
            <a
              key={artist.id}
              href={`/${yearCity}/umelci/${artist.id}`}
              className="block mb-4 break-inside-avoid group relative overflow-hidden border border-white/10 hover:border-[#8ebc35]/50 transition-colors"
            >
              {artist.image && artist.image.url ? (
                <img
                  src={artist.image.url}
                  alt={artist.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-4xl">{artist.name.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <span className="text-sm font-medium">{artist.name}</span>
                  {artist.work && (
                    <p className="text-xs text-white/60 mt-0.5">{artist.work}</p>
                  )}
                </div>
              </div>
              {artist.filters && artist.filters.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {artist.filters.map((f) => {
                    const filter = typeof f === 'object' ? f : null
                    if (!filter) return null
                    return (
                      <span
                        key={filter.id}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: filter.color }}
                      />
                    )
                  })}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
