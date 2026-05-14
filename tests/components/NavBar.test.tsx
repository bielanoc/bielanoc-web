import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => '/y2025/ba/umelci',
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('@/components/LanguageToggle', () => ({
  LanguageToggle: ({ current }: any) => <button>Lang: {current}</button>,
}))

vi.mock('@/components/SideMenu', () => ({
  SideMenu: () => null,
}))

import { NavBar } from '@/components/NavBar'

describe('NavBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders the brand link', () => {
    render(<NavBar />)
    expect(screen.getByText('BIELA NOC')).toBeInTheDocument()
    expect(screen.getByText('BIELA NOC').closest('a')).toHaveAttribute('href', '/')
  })

  it('renders navigation links for year/city pages', () => {
    render(<NavBar locale="sk" />)
    expect(screen.getByText('Umelci')).toBeInTheDocument()
    expect(screen.getByText('Mapa')).toBeInTheDocument()
    expect(screen.getByText('Partneri')).toBeInTheDocument()
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('renders EN labels when locale is en', () => {
    render(<NavBar locale="en" />)
    expect(screen.getByText('Artists')).toBeInTheDocument()
    expect(screen.getByText('Map')).toBeInTheDocument()
    expect(screen.getByText('Partners')).toBeInTheDocument()
  })

  it('renders city switcher buttons', () => {
    render(<NavBar />)
    expect(screen.getByText('BA')).toBeInTheDocument()
    expect(screen.getByText('KE')).toBeInTheDocument()
  })

  it('switches city when KE button is clicked', async () => {
    const user = userEvent.setup()
    render(<NavBar availableYears={['2025', '2024']} />)

    await user.click(screen.getByText('KE'))
    expect(mockPush).toHaveBeenCalledWith('/y2025/ke/umelci')
  })

  it('renders year dropdown with available years', () => {
    render(<NavBar availableYears={['2026', '2025', '2024']} />)

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('2026')
    expect(options[1]).toHaveTextContent('2025')
    expect(options[2]).toHaveTextContent('2024')
  })

  it('switches year when dropdown changes', async () => {
    const user = userEvent.setup()
    render(<NavBar availableYears={['2025', '2024']} />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '2024')

    expect(mockPush).toHaveBeenCalledWith('/y2024/ba/umelci')
  })

  it('shows ticket button with green style when sale is enabled', () => {
    render(<NavBar ticketSaleEnabled={true} locale="sk" />)

    const ticketLinks = screen.getAllByText('Vstupenky')
    const greenButton = ticketLinks.find((el) => el.classList.contains('bg-[#8ebc35]'))
    expect(greenButton).toBeDefined()
  })

  it('shows regular ticket link when sale is disabled', () => {
    render(<NavBar ticketSaleEnabled={false} locale="sk" />)

    const ticketLinks = screen.getAllByText('Vstupenky')
    const greenButton = ticketLinks.find((el) => el.classList.contains('bg-[#8ebc35]'))
    expect(greenButton).toBeUndefined()
  })
})
