import { describe, it, expect } from 'vitest'

function buildMarkers(artists: any[], year: string, city: string) {
  return artists
    .filter((a) => a.latitude && a.longitude)
    .map((a, index) => ({
      id: String(a.id),
      name: a.name,
      work: a.work ?? null,
      place: a.place ?? null,
      lat: a.latitude!,
      lng: a.longitude!,
      href: `/${year}/${city}/umelci/${a.id}`,
      number: index + 1,
    }))
}

describe('Map markers data building', () => {
  const artists = [
    { id: 1, name: 'Artist A', work: 'Work A', place: 'Place A', latitude: 48.14, longitude: 17.10 },
    { id: 2, name: 'Artist B', work: null, place: null, latitude: 48.15, longitude: 17.11 },
    { id: 3, name: 'Artist C', work: 'Work C', place: 'Place C', latitude: null, longitude: null },
    { id: 4, name: 'Artist D', work: 'Work D', place: 'Place D', latitude: 48.16, longitude: null },
  ]

  it('filters out artists without coordinates', () => {
    const markers = buildMarkers(artists, 'y2025', 'ba')
    expect(markers).toHaveLength(2)
    expect(markers.map((m) => m.name)).toEqual(['Artist A', 'Artist B'])
  })

  it('assigns sequential numbers starting from 1', () => {
    const markers = buildMarkers(artists, 'y2025', 'ba')
    expect(markers[0].number).toBe(1)
    expect(markers[1].number).toBe(2)
  })

  it('builds correct href for each marker', () => {
    const markers = buildMarkers(artists, 'y2025', 'ba')
    expect(markers[0].href).toBe('/y2025/ba/umelci/1')
    expect(markers[1].href).toBe('/y2025/ba/umelci/2')
  })

  it('preserves null work and place', () => {
    const markers = buildMarkers(artists, 'y2025', 'ba')
    expect(markers[1].work).toBeNull()
    expect(markers[1].place).toBeNull()
  })

  it('converts id to string', () => {
    const markers = buildMarkers(artists, 'y2025', 'ba')
    expect(typeof markers[0].id).toBe('string')
  })

  it('returns empty array for no valid artists', () => {
    const noCoords = [
      { id: 1, name: 'No Coords', work: null, place: null, latitude: null, longitude: null },
    ]
    const markers = buildMarkers(noCoords, 'y2025', 'ba')
    expect(markers).toHaveLength(0)
  })

  it('works with KE city', () => {
    const markers = buildMarkers(artists, 'y2025', 'ke')
    expect(markers[0].href).toBe('/y2025/ke/umelci/1')
  })
})
