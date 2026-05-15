'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFavorites } from '@/lib/useFavorites'
import { localToUTC, getLocalParts } from './DebugTimePicker'

type ArtistDate = {
  start: string | null
  end: string | null
  display?: boolean
}

type Artist = {
  id: string
  name: string
  work?: string | null
  image?: { url?: string | null } | null
  mapNumber: number | null
  dates?: ArtistDate[]
}

type Props = {
  artists: Artist[]
  yearCity: string
  debugMode: boolean
  debugTime: string | null
  locale: string
}

type FilterTab = 'all' | 'today' | 'favorites'

function getDateString(date: Date): string {
  const { year, month, day, hour } = getLocalParts(date)
  if (hour < 5) {
    const prev = new Date(Date.UTC(year, month - 1, day - 1))
    return prev.toISOString().slice(0, 10)
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function artistHasDateOn(artist: Artist, dateStr: string): boolean {
  if (!artist.dates || artist.dates.length === 0) return false
  return artist.dates.some((d) => {
    if (!d.start) return false
    const startDate = getDateString(new Date(d.start))
    return startDate === dateStr
  })
}

export function ArtistFilters({ artists, yearCity, debugMode, debugTime, locale }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const currentTime = debugMode && debugTime ? localToUTC(debugTime) : new Date()
  const router = useRouter()
  const { toggle: toggleFavorite, isFavorite } = useFavorites()

  const todayStr = getDateString(currentTime)

  const filtered = (() => {
    switch (activeTab) {
      case 'today':
        return artists.filter((a) => artistHasDateOn(a, todayStr))
      case 'favorites':
        return artists.filter((a) => isFavorite(a.id))
      default:
        return artists
    }
  })()

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: locale === 'en' ? 'All' : 'Všetky' },
    { key: 'today', label: locale === 'en' ? 'Today' : 'Dnes' },
    { key: 'favorites', label: locale === 'en' ? 'Favorites' : 'Obľúbené' },
  ]

  return (
    <>
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[#8ebc35] text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/40">
          {activeTab === 'favorites'
            ? (locale === 'en' ? 'No favorites yet. Tap the heart on any artist to save them.' : 'Zatiaľ žiadne obľúbené. Kliknite na srdce pri umelcovi.')
            : activeTab === 'today'
            ? (locale === 'en' ? 'No performances today.' : 'Dnes nie sú žiadne vystúpenia.')
            : (locale === 'en' ? 'No artists for this edition.' : 'Žiadni umelci pre tento ročník.')}
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {filtered.map((artist) => (
            <div key={artist.id} className="mb-4 break-inside-avoid relative group">
              <Link
                href={`/${yearCity}/umelci/${artist.id}`}
                className="block relative overflow-hidden border border-white/10 hover:border-[#8ebc35]/50 transition-colors"
                onMouseEnter={() => router.prefetch(`/${yearCity}/umelci/${artist.id}`)}
              >
                {artist.image && artist.image.url ? (
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5 animate-pulse">
                    <Image
                      src={artist.image.url}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => (e.currentTarget.parentElement!.classList.remove('animate-pulse', 'bg-white/5'))}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-4xl">{artist.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-sm font-medium">{artist.name}</span>
                    {artist.work && (
                      <p className="text-xs text-white/60 mt-0.5">{artist.work}</p>
                    )}
                  </div>
                </div>
              </Link>

              {artist.mapNumber != null && (
                <Link
                  href={`/${yearCity}/mapa?artist=${artist.id}`}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#8ebc35] text-black text-xs font-bold flex items-center justify-center hover:scale-110 transition-transform"
                  title={locale === 'en' ? 'Show on map' : 'Zobraziť na mape'}
                >
                  {artist.mapNumber}
                </Link>
              )}

              <button
                onClick={(e) => { e.preventDefault(); toggleFavorite(artist.id) }}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                aria-label={isFavorite(artist.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-4 h-4 transition-colors ${isFavorite(artist.id) ? 'text-red-500 fill-red-500' : 'text-white/60 fill-none'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

    </>
  )
}
