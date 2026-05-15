'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FestivalMap } from './FestivalMap'
import type { LatLngExpression } from 'leaflet'

type MarkerData = {
  id: string
  name: string
  work?: string | null
  place?: string | null
  lat: number
  lng: number
  href: string
  number: number
}

type Props = {
  markers: MarkerData[]
  center: LatLngExpression
  moreInfoLabel: string
  navigateLabel: string
}

export function MapPageClient({ markers, center, moreInfoLabel, navigateLabel }: Props) {
  const searchParams = useSearchParams()
  const initialArtist = searchParams.get('artist')
  const [selectedId, setSelectedId] = useState<string | null>(initialArtist)

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
      <div className="flex-1 lg:order-2 min-h-[50vh] lg:min-h-0">
        <FestivalMap
          markers={markers}
          center={center}
          selectedId={selectedId}
          onMarkerSelect={handleSelect}
          moreInfoLabel={moreInfoLabel}
          navigateLabel={navigateLabel}
        />
      </div>

      <div className="w-full lg:w-80 xl:w-96 lg:order-1 overflow-y-auto border-t lg:border-t-0 lg:border-r border-white/10 scrollbar-hide pt-16 lg:pt-16">
        <ul className="divide-y divide-white/5">
          {markers.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => handleSelect(m.id)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-white/5 ${
                  selectedId === m.id ? 'bg-[#8ebc35]/10 border-l-2 border-l-[#8ebc35]' : 'border-l-2 border-l-transparent'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                      selectedId === m.id
                        ? 'bg-[#8ebc35] text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {m.number}
                  </span>
                  <span className={`text-sm font-medium ${selectedId === m.id ? 'text-white' : 'text-white/80'}`}>
                    {m.name}
                  </span>
                </span>
                {m.work && (
                  <p className="text-xs text-white/40 mt-0.5 ml-8">{m.work}</p>
                )}
                {m.place && (
                  <p className="text-xs text-white/30 ml-8">{m.place}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
