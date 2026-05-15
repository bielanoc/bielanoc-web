'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'bielanoc-debug'

type DebugSettings = {
  simulatedTime: string | null
  festivalActive: boolean
}

const CHANGE_EVENT = 'debug-settings-change'

function isoToLocalInput(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bratislava',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${get('year')}-${pad(Number(get('month')))}-${pad(Number(get('day')))}T${pad(Number(get('hour')))}:${pad(Number(get('minute')))}`
}

export function useDebugSettings(defaults: { debugTime: string | null; festivalActive: boolean }) {
  const [settings, setSettings] = useState<DebugSettings>({
    simulatedTime: isoToLocalInput(defaults.debugTime),
    festivalActive: defaults.festivalActive,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSettings(JSON.parse(stored))
    } catch { /* noop */ }
  }, [])

  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setSettings(JSON.parse(stored))
      } catch { /* noop */ }
    }
    window.addEventListener(CHANGE_EVENT, handler)
    return () => window.removeEventListener(CHANGE_EVENT, handler)
  }, [])

  const update = useCallback((patch: Partial<DebugSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(CHANGE_EVENT))
      } catch { /* noop */ }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const fresh: DebugSettings = { simulatedTime: null, festivalActive: defaults.festivalActive }
    setSettings(fresh)
    try {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event(CHANGE_EVENT))
    } catch { /* noop */ }
  }, [defaults.festivalActive])

  return { ...settings, update, reset }
}
