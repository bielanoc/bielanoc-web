'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { UI_STRINGS, type Locale } from '@/lib/i18n'
import { LanguageToggle } from './LanguageToggle'
import { useDebugSettings } from '@/lib/useDebugSettings'

type MenuItem = {
  label: string
  url: string
  useYearCity?: boolean | null
  icon?: string | null
  dividerAfter?: boolean | null
}

type Props = {
  open: boolean
  onClose: () => void
  yearCity: string | null
  ticketSaleEnabled?: boolean
  locale?: Locale
  availableYears?: string[]
  socialLinks?: { instagram: string | null; facebook: string | null }
  menuItems?: MenuItem[]
  debugMode?: boolean
  debugTime?: string | null
  festivalActive?: boolean
  menuGradientColor?: string
}

export function SideMenu({ open, onClose, yearCity, ticketSaleEnabled = false, locale = 'sk', availableYears = ['2025'], socialLinks, menuItems, debugMode = false, debugTime = null, festivalActive = true, menuGradientColor = '#0a1628' }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const debug = useDebugSettings({ debugTime, festivalActive })

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
        className={`fixed top-0 right-0 h-full w-[500px] max-w-[90vw] border-l border-white/10 z-50 transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: `linear-gradient(to bottom left, ${menuGradientColor}, #000 40%)` }}
      >
        <div className="flex justify-end p-6 shrink-0">
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-8 text-lg overflow-y-auto flex-1 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="flex border border-white/20 rounded overflow-hidden text-sm">
              <button
                onClick={() => switchCity('ba')}
                className={`px-3 py-2 transition-colors ${city === 'ba' ? 'bg-accent text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Bratislava
              </button>
              <button
                onClick={() => switchCity('ke')}
                className={`px-3 py-2 transition-colors ${city === 'ke' ? 'bg-accent text-black font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Košice
              </button>
            </div>

            <select
              value={year || availableYears[0]}
              onChange={(e) => switchYear(e.target.value)}
              className="bg-transparent border border-white/20 rounded text-sm text-white/70 px-3 py-2 cursor-pointer hover:border-white/40 transition-colors"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-black text-white">
                  {y}
                </option>
              ))}
            </select>

            <LanguageToggle current={locale} />
          </div>

          {ticketSaleEnabled && (
            <Link
              href={`${base}/predaj`}
              onClick={onClose}
              className="block text-center px-4 py-2.5 bg-accent text-black font-medium text-sm uppercase tracking-wide hover:bg-accent-hover transition-colors rounded"
            >
              {t.ticketSale}
            </Link>
          )}

          <div className="border-t border-white/10 my-2" />

          {menuItems && menuItems.length > 0 ? (
            menuItems.map((item, i) => (
              <React.Fragment key={i}>
                <MenuLink href={item.useYearCity ? `${base}${item.url}` : item.url} onClick={onClose}>
                  {item.icon === 'search' ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {item.label}
                    </span>
                  ) : item.label}
                </MenuLink>
                {item.dividerAfter && <div className="border-t border-white/10 my-2" />}
              </React.Fragment>
            ))
          ) : (
            <>
              <MenuLink href="/" onClick={onClose}>{t.home}</MenuLink>
              <MenuLink href="/search" onClick={onClose}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {locale === 'en' ? 'Search' : 'Vyhľadávanie'}
                </span>
              </MenuLink>
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
            </>
          )}

          <div className="border-t border-white/10 my-4" />

          <div className="flex gap-4 text-sm text-white/50">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
            )}
          </div>

          {debugMode && (
            <>
              <div className="border-t border-yellow-500/30 my-4" />
              <DebugPanel debug={debug} />
            </>
          )}
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
      <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function DebugPanel({ debug }: { debug: ReturnType<typeof useDebugSettings> }) {
  const parsed = parseDebugTime(debug.simulatedTime)

  function parseDebugTime(val: string | null) {
    if (!val) {
      const now = new Date()
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Bratislava',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(now)
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
      return { day: get('day'), month: get('month'), year: get('year'), hour: get('hour'), minute: get('minute') }
    }
    const [datePart, timePart] = val.split('T')
    const [y, m, d] = datePart.split('-')
    const [h, min] = (timePart || '00:00').split(':')
    return { day: d, month: m, year: y, hour: h, minute: min }
  }

  function commit(patch: Partial<typeof parsed>) {
    const merged = { ...parsed, ...patch }
    const iso = `${merged.year}-${merged.month.padStart(2, '0')}-${merged.day.padStart(2, '0')}T${merged.hour.padStart(2, '0')}:${merged.minute.padStart(2, '0')}`
    debug.update({ simulatedTime: iso })
  }

  return (
    <div className="bg-yellow-900/40 border border-yellow-500/30 rounded-lg p-4">
      <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Debug Mode</span>
      <p className="text-yellow-400/50 text-[10px] mt-0.5 mb-3">Simulates time for &quot;Today&quot; filter</p>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={parsed.day}
          onChange={(e) => commit({ day: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          className="w-9 px-1.5 py-1.5 bg-black/60 border border-yellow-500/30 rounded text-sm text-white text-center"
          placeholder="DD"
        />
        <span className="text-yellow-400/60 text-sm">.</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={parsed.month}
          onChange={(e) => commit({ month: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          className="w-9 px-1.5 py-1.5 bg-black/60 border border-yellow-500/30 rounded text-sm text-white text-center"
          placeholder="MM"
        />
        <span className="text-yellow-400/60 text-sm">.</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={parsed.year}
          onChange={(e) => commit({ year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          className="w-14 px-1.5 py-1.5 bg-black/60 border border-yellow-500/30 rounded text-sm text-white text-center"
          placeholder="YYYY"
        />
        <span className="text-yellow-400/40 text-sm mx-1">|</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={parsed.hour}
          onChange={(e) => commit({ hour: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          className="w-9 px-1.5 py-1.5 bg-black/60 border border-yellow-500/30 rounded text-sm text-white text-center"
          placeholder="HH"
        />
        <span className="text-yellow-400/60 text-sm">:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={parsed.minute}
          onChange={(e) => commit({ minute: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          className="w-9 px-1.5 py-1.5 bg-black/60 border border-yellow-500/30 rounded text-sm text-white text-center"
          placeholder="mm"
        />
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={() => debug.reset()}
          className="text-yellow-400/60 text-xs hover:text-yellow-400 underline"
        >
          Reset to now
        </button>
      </div>
    </div>
  )
}

function parseRoute(pathname: string): { year: string | null; city: string | null; section: string | null } {
  const match = pathname.match(/^\/y(\d{4})\/(ba|ke)(?:\/([^/]+))?/)
  if (!match) return { year: null, city: null, section: null }
  return { year: match[1], city: match[2], section: match[3] || null }
}
