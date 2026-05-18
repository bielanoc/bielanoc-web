'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SideMenu } from './SideMenu'
import type { Locale } from '@/lib/i18n'

type MenuItem = {
  label: string
  url: string
  useYearCity?: boolean | null
  icon?: string | null
  dividerAfter?: boolean | null
}

type Props = {
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
  socialLinks?: { instagram: string | null; facebook: string | null }
  menuItems?: MenuItem[]
  debugMode?: boolean
  debugTime?: string | null
  festivalActive?: boolean
  logoUrl?: string
  menuGradientColor?: string
}

function parseRoute(pathname: string): { year: string | null; city: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)/)
  if (!match) return { year: null, city: null }
  return { year: match[1], city: match[2] }
}

export function FloatingMenuButton({ ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'], socialLinks, menuItems, debugMode = false, debugTime = null, festivalActive = true, logoUrl = '/logo-bn.svg', menuGradientColor = '#0a1628' }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { year, city } = parseRoute(pathname)

  return (
    <>
      <div className="absolute top-3 left-3 z-50 sm:top-4 sm:left-4">
        <Link href="/" aria-label="Biela Noc" className="block bg-black/60 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 border border-white/10">
          <Image src={logoUrl} alt="Biela Noc" width={60} height={48} priority className="w-[36px] h-[29px] sm:w-[60px] sm:h-[48px]" />
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-50">
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
        menuItems={menuItems}
        debugMode={debugMode}
        debugTime={debugTime}
        festivalActive={festivalActive}
        menuGradientColor={menuGradientColor}
      />
    </>
  )
}
