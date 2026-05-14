'use client'

import dynamic from 'next/dynamic'
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
  selectedId?: string | null
  onMarkerSelect?: (id: string) => void
  moreInfoLabel?: string
}

const MapInner = dynamic(() => import('./FestivalMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white/5 flex items-center justify-center">
      <p className="text-white/40">Načítavam mapu...</p>
    </div>
  ),
})

export function FestivalMap({ markers, center, selectedId, onMarkerSelect, moreInfoLabel }: Props) {
  return (
    <MapInner
      markers={markers}
      center={center}
      selectedId={selectedId}
      onMarkerSelect={onMarkerSelect}
      moreInfoLabel={moreInfoLabel}
    />
  )
}
