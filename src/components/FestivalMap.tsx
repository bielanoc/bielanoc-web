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
  zoom: number
}

const MapInner = dynamic(() => import('./FestivalMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-white/5 flex items-center justify-center">
      <p className="text-white/40">Načítavam mapu...</p>
    </div>
  ),
})

export function FestivalMap({ markers, center, zoom }: Props) {
  return <MapInner markers={markers} center={center} zoom={zoom} />
}
