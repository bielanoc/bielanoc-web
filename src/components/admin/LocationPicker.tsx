'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useField } from '@payloadcms/ui'

const CITIES = {
  ba: { lat: 48.1486, lng: 17.1077, label: 'Bratislava' },
  ke: { lat: 48.7164, lng: 21.2611, label: 'Košice' },
} as const

export function LocationPicker() {
  const { value: latValue, setValue: setLatValue } = useField<number>({ path: 'latitude' })
  const { value: lngValue, setValue: setLngValue } = useField<number>({ path: 'longitude' })
  const { value: cityValue } = useField<string>({ path: 'city' })

  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)

  const defaultCity = CITIES[cityValue as keyof typeof CITIES] ?? CITIES.ba
  const lat = latValue ?? defaultCity.lat
  const lng = lngValue ?? defaultCity.lng

  const updatePosition = useCallback((newLat: number, newLng: number) => {
    setLatValue(Math.round(newLat * 1000000) / 1000000)
    setLngValue(Math.round(newLng * 1000000) / 1000000)
  }, [setLatValue, setLngValue])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: latValue ? 16 : 13,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OSM',
        maxZoom: 20,
      }).addTo(map)

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        updatePosition(pos.lat, pos.lng)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        updatePosition(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
      markerRef.current = marker
    }
    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const pos = markerRef.current.getLatLng()
      if (Math.abs(pos.lat - lat) > 0.000001 || Math.abs(pos.lng - lng) > 0.000001) {
        markerRef.current.setLatLng([lat, lng])
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom())
      }
    }
  }, [lat, lng])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const center = mapInstanceRef.current
        ? mapInstanceRef.current.getCenter()
        : { lat, lng }
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=5&countrycodes=sk`,
        { headers: { 'Accept-Language': 'sk' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const closest = data.reduce((best: { lat: string; lon: string }, item: { lat: string; lon: string }) => {
          const distBest = Math.pow(parseFloat(best.lat) - center.lat, 2) + Math.pow(parseFloat(best.lon) - center.lng, 2)
          const distItem = Math.pow(parseFloat(item.lat) - center.lat, 2) + Math.pow(parseFloat(item.lon) - center.lng, 2)
          return distItem < distBest ? item : best
        })
        const newLat = parseFloat(closest.lat)
        const newLng = parseFloat(closest.lon)
        updatePosition(newLat, newLng)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 17)
          markerRef.current?.setLatLng([newLat, newLng])
        }
      }
    } catch {
      // silent fail
    }
    setSearching(false)
  }

  const jumpToCity = (city: keyof typeof CITIES) => {
    const c = CITIES[city]
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([c.lat, c.lng], 14)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
        Poloha na mape
      </label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => jumpToCity('ba')}
          style={{
            padding: '0.4rem 0.75rem',
            background: 'var(--theme-elevation-100, #222)',
            color: 'var(--theme-text, #fff)',
            border: '1px solid var(--theme-elevation-150, #333)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Bratislava
        </button>
        <button
          type="button"
          onClick={() => jumpToCity('ke')}
          style={{
            padding: '0.4rem 0.75rem',
            background: 'var(--theme-elevation-100, #222)',
            color: 'var(--theme-text, #fff)',
            border: '1px solid var(--theme-elevation-150, #333)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Košice
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
          placeholder="Hľadať adresu alebo miesto..."
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            border: '1px solid var(--theme-elevation-150, #333)',
            borderRadius: '4px',
            background: 'var(--theme-elevation-50, #1a1a1a)',
            color: 'var(--theme-text, #fff)',
            fontSize: '0.875rem',
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          style={{
            padding: '0.5rem 1rem',
            background: '#ff6b4a',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: searching ? 'wait' : 'pointer',
          }}
        >
          {searching ? '...' : 'Hľadať'}
        </button>
      </div>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150, #333)',
        }}
      />
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', opacity: 0.6 }}>
        Kliknutím na mapu alebo presunutím špendlíka zmeníte polohu. Súradnice sa automaticky uložia.
      </p>
    </div>
  )
}
