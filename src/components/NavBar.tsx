'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SideMenu } from './SideMenu'

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const yearCity = extractYearCity(pathname)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="text-xl font-bold tracking-wider hover:opacity-80 transition-opacity">
          BIELA NOC
        </Link>

        {yearCity && (
          <nav className="hidden md:flex items-center gap-6 text-sm uppercase tracking-wide">
            <NavLink href={`/${yearCity}/umelci`} active={pathname.includes('/umelci')}>
              Umelci
            </NavLink>
            <NavLink href={`/${yearCity}/mapa`} active={pathname.includes('/mapa')}>
              Mapa
            </NavLink>
            <NavLink href={`/${yearCity}/partneri`} active={pathname.includes('/partneri')}>
              Partneri
            </NavLink>
            <NavLink href={`/${yearCity}/info`} active={pathname.includes('/info')}>
              Info
            </NavLink>
            <NavLink href={`/${yearCity}/predaj`} active={pathname.includes('/predaj')}>
              Vstupenky
            </NavLink>
          </nav>
        )}

        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-1.5 p-2 hover:opacity-80 transition-opacity"
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </header>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} yearCity={yearCity} />
    </>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`transition-colors ${active ? 'text-[#8ebc35]' : 'text-white/70 hover:text-white'}`}
    >
      {children}
    </Link>
  )
}

function extractYearCity(pathname: string): string | null {
  const match = pathname.match(/^\/(y\d{4})\/(ba|ke)/)
  if (match) return `${match[1]}/${match[2]}`
  return null
}
