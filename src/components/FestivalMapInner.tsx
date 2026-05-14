'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
  selectedId?: string | null
  onMarkerSelect?: (id: string) => void
  moreInfoLabel?: string
}

function createNumberedIcon(num: number, selected: boolean) {
  const size = selected ? 36 : 28
  const fontSize = selected ? 14 : 12
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${selected ? '#fff' : '#8ebc35'};
      color: ${selected ? '#8ebc35' : '#000'};
      font-size: ${fontSize}px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid ${selected ? '#8ebc35' : '#fff'};
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: all 0.2s;
    ">${num}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  })
}

function FitAllMarkers({ markers }: { markers: MarkerData[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]))
    map.fitBounds(bounds, { padding: [30, 30] })
  }, [markers, map])

  return null
}

function FlyToSelected({ selectedId, markers }: { selectedId: string | null; markers: MarkerData[] }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedId) return
    const marker = markers.find((m) => m.id === selectedId)
    if (marker) {
      map.flyTo([marker.lat, marker.lng], 17, { duration: 0.8 })
    }
  }, [selectedId, markers, map])

  return null
}

export default function FestivalMapInner({ markers, center, selectedId, onMarkerSelect, moreInfoLabel }: Props) {
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
      zoom={14}
      maxZoom={20}
      className="w-full h-full z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      <FitAllMarkers markers={markers} />
      <FlyToSelected selectedId={selectedId ?? null} markers={markers} />
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={createNumberedIcon(m.number, selectedId === m.id)}
          eventHandlers={{
            click: () => onMarkerSelect?.(m.id),
          }}
        >
          <Popup>
            <div>
              <strong style={{ color: '#8ebc35' }}>{m.number}. {m.name}</strong>
              {m.work && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>{m.work}</p>}
              {m.place && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{m.place}</p>}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <a
                  href={m.href}
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: '#8ebc35',
                    color: '#000',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {moreInfoLabel ?? 'Viac info'} →
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Navigovať ↗
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
