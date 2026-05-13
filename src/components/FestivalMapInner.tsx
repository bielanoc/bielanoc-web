'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type MarkerData = {
  id: string
  name: string
  work?: string | null
  place?: string | null
  lat: number
  lng: number
  href: string
}

type Props = {
  markers: MarkerData[]
  center: LatLngExpression
  zoom: number
}

export default function FestivalMapInner({ markers, center, zoom }: Props) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full aspect-[16/9] rounded border border-white/10 z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>
            <a href={m.href} className="text-black font-medium no-underline hover:underline">
              {m.name}
            </a>
            {m.work && <p className="text-xs text-gray-600 mt-1 mb-0">{m.work}</p>}
            {m.place && <p className="text-xs text-gray-500 mt-0.5 mb-0">{m.place}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
