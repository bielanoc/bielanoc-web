'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { UI_STRINGS, type Locale } from '@/lib/i18n'

type Props = {
  open: boolean
  onClose: () => void
  yearCity: string | null
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
}

export function SideMenu({ open, onClose, yearCity, ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'] }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const { year, city, section } = parseRoute(pathname)
  const t = UI_STRINGS[locale]

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const base = yearCity ? `/${yearCity}` : `/y${availableYears[0]}/ba`

  function switchCity(newCity: string) {
    const y = year || availableYears[0]
    const s = section || 'umelci'
    router.push(`/y${y}/${newCity}/${s}`)
    onClose()
  }

  function switchYear(newYear: string) {
    const c = city || 'ba'
    const s = section || 'umelci'
    router.push(`/y${newYear}/${c}/${s}`)
    onClose()
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} aria-hidden="true" />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigácia"
        className={`fixed top-0 right-0 h-full w-[500px] max-w-[90vw] bg-gradient-to-bl from-black via-black to-[#0a1628] border-l border-white/10 z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-8 text-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex border border-white/20 rounded overflow-hidden text-sm">
              <button
                onClick={() => switchCity('ba')}
                className={`px-3 py-1.5 transition-colors ${city === 'ba' ? 'bg-[#8ebc35] text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Bratislava
              </button>
              <button
                onClick={() => switchCity('ke')}
                className={`px-3 py-1.5 transition-colors ${city === 'ke' ? 'bg-[#8ebc35] text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Košice
              </button>
            </div>

            <select
              value={year || availableYears[0]}
              onChange={(e) => switchYear(e.target.value)}
              className="bg-transparent border border-white/20 rounded text-sm text-white/70 px-2 py-1.5 cursor-pointer hover:border-white/40 transition-colors"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-black text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {ticketSaleEnabled && (
            <Link
              href={`${base}/predaj`}
              onClick={onClose}
              className="block text-center px-4 py-2.5 bg-[#8ebc35] text-black font-medium text-sm uppercase tracking-wide hover:bg-[#7aa82d] transition-colors rounded"
            >
              {t.ticketSale}
            </Link>
          )}

          <div className="border-t border-white/10 my-2" />

          <MenuLink href={`${base}/umelci`} onClick={onClose}>{t.artists}</MenuLink>
          <MenuLink href={`${base}/mapa`} onClick={onClose}>{t.map}</MenuLink>
          <MenuLink href={`${base}/partneri`} onClick={onClose}>{t.partners}</MenuLink>
          <MenuLink href={`${base}/info`} onClick={onClose}>{t.info}</MenuLink>
          <MenuLink href={`${base}/predaj`} onClick={onClose}>{t.tickets}</MenuLink>
          <MenuLink href={`${base}/dobrovolnici`} onClick={onClose}>{t.volunteers}</MenuLink>

          <div className="border-t border-white/10 my-4" />

          <MenuLink href="/o-bielej-noci" onClick={onClose}>{t.about}</MenuLink>
          <MenuLink href="/kontakt" onClick={onClose}>{t.contact}</MenuLink>
          <MenuLink href="/podporte-nas" onClick={onClose}>{t.support}</MenuLink>
          <MenuLink href="/press" onClick={onClose}>{t.press}</MenuLink>
          <MenuLink href="/archive" onClick={onClose}>{t.archive}</MenuLink>
          <MenuLink href="/app" onClick={onClose}>{t.app}</MenuLink>

          <div className="border-t border-white/10 my-4" />

          <div className="flex gap-4 text-sm text-white/50">
            <a href="https://instagram.com/bielanoc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://facebook.com/bielanoc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Facebook
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}

function MenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-white/80 hover:text-white transition-colors uppercase tracking-wide group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#8ebc35] transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function parseRoute(pathname: string): { year: string | null; city: string | null; section: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)(?:\/([^/]+))?/)
  if (!match) return { year: null, city: null, section: null }
  return { year: match[1], city: match[2], section: match[3] || null }
}
