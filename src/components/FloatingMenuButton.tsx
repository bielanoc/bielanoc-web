'use client'

import { useState } from 'react'
import { SideMenu } from './SideMenu'
import { LanguageToggle } from './LanguageToggle'
import type { Locale } from '@/lib/i18n'

type Props = {
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
  socialLinks?: { instagram: string | null; facebook: string | null }
}

export function FloatingMenuButton({ ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'], socialLinks }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
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
        yearCity={null}
        ticketSaleEnabled={ticketSaleEnabled}
        locale={locale}
        availableYears={availableYears}
        socialLinks={socialLinks}
      />
    </>
  )
}
