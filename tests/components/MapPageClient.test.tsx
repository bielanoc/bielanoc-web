import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '../mocks/next'

vi.mock('@/components/FestivalMap', () => ({
  FestivalMap: ({ markers, selectedId, onMarkerSelect, moreInfoLabel }: any) => (
    <div data-testid="festival-map" data-selected={selectedId}>
      {markers.map((m: any) => (
        <button key={m.id} data-testid={`marker-${m.id}`} onClick={() => onMarkerSelect?.(m.id)}>
          {m.name}
        </button>
      ))}
    </div>
  ),
}))

import { MapPageClient } from '@/components/MapPageClient'

const mockMarkers = [
  { id: '1', name: 'Artist A', work: 'Installation A', place: 'Place A', lat: 48.14, lng: 17.10, href: '/y2025/ba/umelci/1', number: 1 },
  { id: '2', name: 'Artist B', work: 'Installation B', place: 'Place B', lat: 48.15, lng: 17.11, href: '/y2025/ba/umelci/2', number: 2 },
  { id: '3', name: 'Artist C', work: null, place: null, lat: 48.16, lng: 17.12, href: '/y2025/ba/umelci/3', number: 3 },
]

describe('MapPageClient', () => {
  it('renders the program list with all markers', () => {
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    expect(screen.getAllByText('Artist A')).toHaveLength(2) // list + map mock
    expect(screen.getAllByText('Artist B')).toHaveLength(2)
    expect(screen.getAllByText('Artist C')).toHaveLength(2)
  })

  it('renders work and place info for markers that have them', () => {
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    expect(screen.getByText('Installation A')).toBeInTheDocument()
    expect(screen.getByText('Place A')).toBeInTheDocument()
  })

  it('does not render work/place for markers without them', () => {
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    const listButtons = screen.getAllByRole('button')
    const thirdButton = listButtons.find((b) => b.textContent?.includes('Artist C'))
    expect(thirdButton).toBeDefined()
    expect(thirdButton?.textContent).not.toContain('null')
  })

  it('selects a marker when list item is clicked', async () => {
    const user = userEvent.setup()
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    const listItem = screen.getAllByRole('button').find((b) => b.textContent?.includes('Artist A'))
    await user.click(listItem!)

    const map = screen.getByTestId('festival-map')
    expect(map).toHaveAttribute('data-selected', '1')
  })

  it('deselects a marker when the same list item is clicked again', async () => {
    const user = userEvent.setup()
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    const listItem = screen.getAllByRole('button').find((b) => b.textContent?.includes('Artist A'))
    await user.click(listItem!)
    await user.click(listItem!)

    const map = screen.getByTestId('festival-map')
    expect(map.getAttribute('data-selected')).toBeFalsy()
  })

  it('selects a marker when map marker is clicked', async () => {
    const user = userEvent.setup()
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    await user.click(screen.getByTestId('marker-2'))

    const map = screen.getByTestId('festival-map')
    expect(map).toHaveAttribute('data-selected', '2')
  })

  it('renders numbered badges in the list', () => {
    render(<MapPageClient markers={mockMarkers} center={[48.14, 17.10]} moreInfoLabel="Viac info" />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
