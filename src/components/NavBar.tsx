'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { SideMenu } from './SideMenu'
import { LanguageToggle } from './LanguageToggle'
import { UI_STRINGS, type Locale } from '@/lib/i18n'

type NavBarProps = {
  ticketSaleEnabled?: boolean
  dateInfo?: { ba: string | null; ke: string | null }
  locale?: Locale
  availableYears?: string[]
}

export function NavBar({ ticketSaleEnabled = false, dateInfo, locale = 'sk', availableYears = ['2025'] }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const yearCity = extractYearCity(pathname)
  const { year, city, section } = parseRoute(pathname)
  const t = UI_STRINGS[locale]

  function switchCity(newCity: string) {
    const y = year || availableYears[0]
    const s = section || 'umelci'
    router.push(`/y${y}/${newCity}/${s}`)
  }

  function switchYear(newYear: string) {
    const c = city || 'ba'
    const s = section || 'umelci'
    router.push(`/y${newYear}/${c}/${s}`)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-4 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="text-xl font-bold tracking-wider hover:opacity-80 transition-opacity">
          BIELA NOC
        </Link>

        {yearCity && (
          <nav className="hidden md:flex items-center gap-6 text-sm uppercase tracking-wide">
            <NavLink href={`/${yearCity}/umelci`} active={pathname.includes('/umelci')}>
              {t.artists}
            </NavLink>
            <NavLink href={`/${yearCity}/mapa`} active={pathname.includes('/mapa')}>
              {t.map}
            </NavLink>
            <NavLink href={`/${yearCity}/partneri`} active={pathname.includes('/partneri')}>
              {t.partners}
            </NavLink>
            <NavLink href={`/${yearCity}/info`} active={pathname.includes('/info')}>
              {t.info}
            </NavLink>
            {ticketSaleEnabled ? (
              <Link
                href={`/${yearCity}/predaj`}
                className="px-3 py-1 bg-[#8ebc35] text-black text-xs font-medium rounded hover:bg-[#7aa82d] transition-colors"
              >
                {t.tickets}
              </Link>
            ) : (
              <NavLink href={`/${yearCity}/predaj`} active={pathname.includes('/predaj')}>
                {t.tickets}
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label={locale === 'en' ? 'Search' : 'Vyhľadávanie'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <LanguageToggle current={locale} />

          {year && (
            <div className="flex items-center gap-2">
              <div className="flex border border-white/20 rounded overflow-hidden text-xs">
                <button
                  onClick={() => switchCity('ba')}
                  className={`px-2.5 py-1 transition-colors ${city === 'ba' ? 'bg-[#8ebc35] text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  BA
                </button>
                <button
                  onClick={() => switchCity('ke')}
                  className={`px-2.5 py-1 transition-colors ${city === 'ke' ? 'bg-[#8ebc35] text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  KE
                </button>
              </div>

              <select
                value={year}
                onChange={(e) => switchYear(e.target.value)}
                className="bg-transparent border border-white/20 rounded text-xs text-white/70 px-2 py-1 appearance-none cursor-pointer hover:border-white/40 transition-colors"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y} className="bg-black text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
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
        </div>
      </header>

      {year && dateInfo && (dateInfo[city as 'ba' | 'ke']) && (
        <div className="fixed top-[57px] left-0 right-0 z-40 bg-white/5 border-b border-white/5 text-center py-1.5 text-xs text-white/40 tracking-wide">
          {dateInfo[city as 'ba' | 'ke']}
        </div>
      )}

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} yearCity={yearCity} ticketSaleEnabled={ticketSaleEnabled} locale={locale} availableYears={availableYears} />
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

function parseRoute(pathname: string): { year: string | null; city: string | null; section: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)(?:\/([^/]+))?/)
  if (!match) return { year: null, city: null, section: null }
  return { year: match[1], city: match[2], section: match[3] || null }
}
