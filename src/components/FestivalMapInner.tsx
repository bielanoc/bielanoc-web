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
  number: number
}

type Props = {
  markers: MarkerData[]
  center: LatLngExpression
  zoom: number
}

function createNumberedIcon(num: number) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #8ebc35;
      color: #000;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function FestivalMapInner({ markers, center, zoom }: Props) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .custom-marker { background: none !important; border: none !important; }
      .leaflet-popup-content-wrapper {
        background: #1a1a2e !important;
        color: #fff !important;
        border-radius: 8px !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
      }
      .leaflet-popup-tip { background: #1a1a2e !important; }
      .leaflet-popup-close-button { color: rgba(255,255,255,0.5) !important; }
      .leaflet-popup-close-button:hover { color: #fff !important; }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-[70vh] z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={createNumberedIcon(m.number)}>
          <Popup>
            <a href={m.href} style={{ color: '#8ebc35', fontWeight: 600, textDecoration: 'none' }}>
              {m.number}. {m.name}
            </a>
            {m.work && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>{m.work}</p>}
            {m.place && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{m.place}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
