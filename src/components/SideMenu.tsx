'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  yearCity: string | null
}

export function SideMenu({ open, onClose, yearCity }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

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

  const base = yearCity ? `/${yearCity}` : '/y2025/ba'

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
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-white/10 z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-8 text-lg">
          <MenuLink href={`${base}/umelci`} onClick={onClose}>Umelci</MenuLink>
          <MenuLink href={`${base}/mapa`} onClick={onClose}>Mapa</MenuLink>
          <MenuLink href={`${base}/partneri`} onClick={onClose}>Partneri</MenuLink>
          <MenuLink href={`${base}/info`} onClick={onClose}>Info</MenuLink>
          <MenuLink href={`${base}/predaj`} onClick={onClose}>Vstupenky</MenuLink>
          <MenuLink href={`${base}/dobrovolnici`} onClick={onClose}>Dobrovoľníci</MenuLink>

          <div className="border-t border-white/10 my-4" />

          <MenuLink href="/o-bielej-noci" onClick={onClose}>O Bielej Noci</MenuLink>
          <MenuLink href="/kontakt" onClick={onClose}>Kontakt</MenuLink>
          <MenuLink href="/podporte-nas" onClick={onClose}>Podporte nás</MenuLink>
          <MenuLink href="/press" onClick={onClose}>Pre médiá</MenuLink>
          <MenuLink href="/archive" onClick={onClose}>Archív</MenuLink>
          <MenuLink href="/app" onClick={onClose}>Aplikácia</MenuLink>

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
    <Link href={href} onClick={onClick} className="text-white/80 hover:text-[#8ebc35] transition-colors uppercase tracking-wide">
      {children}
    </Link>
  )
}
