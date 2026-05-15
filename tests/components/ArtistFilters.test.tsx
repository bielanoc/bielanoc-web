import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '../mocks/next'
import { ArtistFilters } from '@/components/ArtistFilters'

vi.mock('@/lib/useFavorites', () => ({
  useFavorites: () => ({
    favorites: ['101'],
    toggle: vi.fn(),
    isFavorite: (id: string) => id === '101',
  }),
}))

const mockArtists = [
  {
    id: '101',
    name: 'Artist One',
    work: 'Light Installation',
    image: { url: 'https://example.com/img1.jpg' },
    mapNumber: 1,
    dates: [{ start: '2025-10-03T18:00:00.000Z', end: '2025-10-03T23:00:00.000Z' }],
  },
  {
    id: '102',
    name: 'Artist Two',
    work: 'Dance Show',
    image: { url: 'https://example.com/img2.jpg' },
    mapNumber: 2,
    dates: [{ start: '2025-10-04T18:00:00.000Z', end: '2025-10-04T23:00:00.000Z' }],
  },
  {
    id: '103',
    name: 'Artist Three',
    work: 'Concert',
    image: null,
    mapNumber: null,
    dates: [],
  },
]

describe('ArtistFilters', () => {
  it('renders all artists on the "All" tab by default', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('Artist Three')).toBeInTheDocument()
  })

  it('shows filter tabs: All, Today, Favorites', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    expect(screen.getByText('Všetky')).toBeInTheDocument()
    expect(screen.getByText('Dnes')).toBeInTheDocument()
    expect(screen.getByText('Obľúbené')).toBeInTheDocument()
  })

  it('shows English labels when locale is en', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="en" />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('filters to favorites when Favorites tab is clicked', async () => {
    const user = userEvent.setup()
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    await user.click(screen.getByText('Obľúbené'))

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.queryByText('Artist Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Artist Three')).not.toBeInTheDocument()
  })

  it('renders placeholder for artists without images', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('generates correct links to artist detail pages', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    const link = screen.getByRole('link', { name: /Artist One/i })
    expect(link).toHaveAttribute('href', '/y2025/ba/umelci/101')
  })

  it('shows map number badge for artists with coordinates', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not show map number for artists without coordinates', () => {
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    const mapLinks = screen.getAllByTitle(/mape/)
    expect(mapLinks).toHaveLength(2)
  })

  it('shows empty state message for favorites when none selected', async () => {
    vi.doMock('@/lib/useFavorites', () => ({
      useFavorites: () => ({
        favorites: [],
        toggle: vi.fn(),
        isFavorite: () => false,
      }),
    }))

    const user = userEvent.setup()
    render(<ArtistFilters artists={mockArtists} yearCity="y2025/ba" debugMode={false} debugTime={null} locale="sk" />)

    await user.click(screen.getByText('Obľúbené'))

    expect(screen.getByText(/obľúbené/i)).toBeInTheDocument()
  })
})
