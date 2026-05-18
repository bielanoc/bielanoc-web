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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('@/components/SideMenu', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SideMenu: ({ open }: any) => open ? <div data-testid="side-menu">Menu</div> : null,
}))

import { FloatingMenuButton } from '@/components/FloatingMenuButton'

describe('FloatingMenuButton', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders the hamburger button', () => {
    render(<FloatingMenuButton />)
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
  })

  it('opens side menu when hamburger is clicked', async () => {
    const user = userEvent.setup()
    render(<FloatingMenuButton />)

    await user.click(screen.getByLabelText('Open menu'))
    expect(screen.getByTestId('side-menu')).toBeInTheDocument()
  })
})
