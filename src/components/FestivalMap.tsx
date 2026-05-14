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
  navigateLabel?: string
}

const MapInner = dynamic(() => import('./FestivalMapInner'), {
  ssr: false,
})

export function FestivalMap({ markers, center, selectedId, onMarkerSelect, moreInfoLabel, navigateLabel }: Props) {
  return (
    <MapInner
      markers={markers}
      center={center}
      selectedId={selectedId}
      onMarkerSelect={onMarkerSelect}
      moreInfoLabel={moreInfoLabel}
      navigateLabel={navigateLabel}
    />
  )
}
