'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SideMenu } from './SideMenu'
import type { Locale } from '@/lib/i18n'

export type MenuItem = {
  label: string
  url: string
  useYearCity?: boolean
  icon?: string
  dividerAfter?: boolean
}

type Props = {
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
  socialLinks?: { instagram: string | null; facebook: string | null }
  debugMode?: boolean
  debugTime?: string | null
  festivalActive?: boolean
  logoUrl?: string
  menuGradientColor?: string
  menuItems?: MenuItem[]
}

function parseRoute(pathname: string): { year: string | null; city: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)/)
  if (!match) return { year: null, city: null }
  return { year: match[1], city: match[2] }
}

export function FloatingMenuButton({ ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'], socialLinks, debugMode = false, debugTime = null, festivalActive = true, logoUrl = '/logo-bn.svg', menuGradientColor = '#0500FF', menuItems = [] }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { year, city } = parseRoute(pathname)

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Link href="/" aria-label="Biela Noc">
          <Image src={logoUrl} alt="Biela Noc" width={60} height={48} priority />
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50">
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
        debugMode={debugMode}
        debugTime={debugTime}
        festivalActive={festivalActive}
        menuGradientColor={menuGradientColor}
        menuItems={menuItems}
      />
    </>
  )
}
