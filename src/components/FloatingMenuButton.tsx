'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SideMenu } from './SideMenu'
import { LanguageToggle } from './LanguageToggle'
import type { Locale } from '@/lib/i18n'

type Props = {
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
  socialLinks?: { instagram: string | null; facebook: string | null }
}

function parseRoute(pathname: string): { year: string | null; city: string | null; section: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)(?:\/([^/]+))?/)
  if (!match) return { year: null, city: null, section: null }
  return { year: match[1], city: match[2], section: match[3] || null }
}

export function FloatingMenuButton({ ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'], socialLinks }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { year, city, section } = parseRoute(pathname)

  function switchCity(newCity: string) {
    const y = year || availableYears[0]
    const s = section || 'umelci'
    router.push(`/y${y}/${newCity}/${s}`)
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {year && (
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
        )}
        <LanguageToggle current={locale} />
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-1.5 p-2.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-black/90 transition-colors"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        yearCity={year && city ? `y${year}/${city}` : null}
        ticketSaleEnabled={ticketSaleEnabled}
        locale={locale}
        availableYears={availableYears}
        socialLinks={socialLinks}
      />
    </>
  )
}
