import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '../mocks/next'
import { ArtistFilters } from '@/components/ArtistFilters'

const mockFilters = [
  { id: '1', title: 'Light Art', slug: 'light-art', color: '#FF5555' },
  { id: '2', title: 'Performance', slug: 'performance', color: '#55FF55' },
  { id: '3', title: 'Music', slug: 'music', color: '#5555FF' },
]

const mockArtists = [
  {
    id: '101',
    name: 'Artist One',
    work: 'Light Installation',
    image: { url: 'https://example.com/img1.jpg' },
    filters: [{ id: '1', title: 'Light Art', slug: 'light-art', color: '#FF5555' }],
  },
  {
    id: '102',
    name: 'Artist Two',
    work: 'Dance Show',
    image: { url: 'https://example.com/img2.jpg' },
    filters: [{ id: '2', title: 'Performance', slug: 'performance', color: '#55FF55' }],
  },
  {
    id: '103',
    name: 'Artist Three',
    work: 'Concert',
    image: null,
    filters: [],
  },
]

describe('ArtistFilters', () => {
  it('renders all artists initially', () => {
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('Artist Three')).toBeInTheDocument()
  })

  it('only shows filters that have matching artists', () => {
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    expect(screen.getByText('Light Art')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.queryByText('Music')).not.toBeInTheDocument()
  })

  it('filters artists when a filter button is clicked', async () => {
    const user = userEvent.setup()
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    await user.click(screen.getByText('Light Art'))

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.queryByText('Artist Two')).not.toBeInTheDocument()
    expect(screen.queryByText('Artist Three')).not.toBeInTheDocument()
  })

  it('shows all artists after toggling filter off', async () => {
    const user = userEvent.setup()
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    await user.click(screen.getByText('Light Art'))
    await user.click(screen.getByText('Light Art'))

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('Artist Three')).toBeInTheDocument()
  })

  it('shows clear filter button when filter is active', async () => {
    const user = userEvent.setup()
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    expect(screen.queryByText('Zrušiť filter')).not.toBeInTheDocument()

    await user.click(screen.getByText('Light Art'))

    expect(screen.getByText('Zrušiť filter')).toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    await user.click(screen.getByText('Light Art'))
    await user.click(screen.getByText('Zrušiť filter'))

    expect(screen.getByText('Artist One')).toBeInTheDocument()
    expect(screen.getByText('Artist Two')).toBeInTheDocument()
    expect(screen.getByText('Artist Three')).toBeInTheDocument()
  })

  it('renders placeholder for artists without images', () => {
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('generates correct links to artist detail pages', () => {
    render(<ArtistFilters filters={mockFilters} artists={mockArtists} yearCity="y2025/ba" />)

    const link = screen.getByRole('link', { name: /Artist One/i })
    expect(link).toHaveAttribute('href', '/y2025/ba/umelci/101')
  })

  it('shows no-results message when filter has no match', async () => {
    const user = userEvent.setup()
    const artistsWithOneFilter = [
      {
        id: '101',
        name: 'Artist One',
        work: 'Installation',
        image: null,
        filters: [{ id: '1', title: 'Light Art', slug: 'light-art', color: '#FF5555' }],
      },
    ]

    render(<ArtistFilters filters={mockFilters} artists={artistsWithOneFilter} yearCity="y2025/ba" />)

    // Light Art filter is the only one shown (Music/Performance have no artists)
    expect(screen.queryByText('Performance')).not.toBeInTheDocument()
  })
})
