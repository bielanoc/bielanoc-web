'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'

type Event = {
  id: string
  artistId: string
  name: string
  work: string | null
  place: string | null
  start: string | null
  end: string | null
}

type Props = {
  events: Event[]
  city: string
  year: string
  locale: string
  debugMode: boolean
  debugTime: string | null
}

const FESTIVAL_DAYS: Record<string, string[]> = {
  ba: ['2025-10-03', '2025-10-04', '2025-10-05'],
  ke: ['2025-10-10', '2025-10-11', '2025-10-12'],
}

const DAY_LABELS_SK: Record<string, string> = {
  '2025-10-03': 'Piatok 3.10.',
  '2025-10-04': 'Sobota 4.10.',
  '2025-10-05': 'Nedeľa 5.10.',
  '2025-10-10': 'Piatok 10.10.',
  '2025-10-11': 'Sobota 11.10.',
  '2025-10-12': 'Nedeľa 12.10.',
}

const DAY_LABELS_EN: Record<string, string> = {
  '2025-10-03': 'Friday Oct 3',
  '2025-10-04': 'Saturday Oct 4',
  '2025-10-05': 'Sunday Oct 5',
  '2025-10-10': 'Friday Oct 10',
  '2025-10-11': 'Saturday Oct 11',
  '2025-10-12': 'Sunday Oct 12',
}

const TZ = 'Europe/Bratislava'

function getLocalParts(date: Date): { year: number; month: number; day: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') }
}

function formatTime(date: Date): string {
  const { hour, minute } = getLocalParts(date)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

function getLocalMinutes(date: Date): number {
  const { hour, minute } = getLocalParts(date)
  return hour * 60 + minute
}

function getEventDay(event: Event): string | null {
  if (!event.start) return null
  const { year, month, day, hour } = getLocalParts(new Date(event.start))
  if (hour < 5) {
    const prev = new Date(Date.UTC(year, month - 1, day - 1))
    return prev.toISOString().slice(0, 10)
  }
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

function getCurrentWallDate(now: Date): string {
  const { year, month, day, hour } = getLocalParts(now)
  if (hour < 5) {
    const prev = new Date(Date.UTC(year, month - 1, day - 1))
    return prev.toISOString().slice(0, 10)
  }
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

function getCurrentLocalMinutes(now: Date): number {
  return getLocalMinutes(now)
}

function localToUTC(iso: string): Date {
  const stripped = iso.replace('Z', '').slice(0, 16)
  const [datePart, timePart] = stripped.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [h, min] = timePart.split(':').map(Number)
  const guess = new Date(Date.UTC(y, m - 1, d, h, min))
  const parts = getLocalParts(guess)
  const diffMin = (parts.hour * 60 + parts.minute) - (h * 60 + min)
  return new Date(guess.getTime() - diffMin * 60000)
}

function toInputValue(date: Date): string {
  const { year, month, day, hour, minute } = getLocalParts(date)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function fromInputValue(val: string): Date {
  return localToUTC(val)
}

export function ProgramTimeline({ events, city, year, locale, debugMode, debugTime }: Props) {
  const debugDate = debugMode && debugTime ? localToUTC(debugTime) : null
  const initialInput = debugDate ? toInputValue(debugDate) : toInputValue(new Date())
  const [simulatedInput, setSimulatedInput] = useState<string>(initialInput)
  const [currentTime, setCurrentTime] = useState<Date>(debugDate ?? new Date())
  const nowRef = useRef<HTMLDivElement>(null)
  const scrolledRef = useRef(false)

  useEffect(() => {
    if (debugMode) {
      setCurrentTime(fromInputValue(simulatedInput))
    } else {
      setCurrentTime(new Date())
      const interval = setInterval(() => setCurrentTime(new Date()), 60000)
      return () => clearInterval(interval)
    }
  }, [debugMode, simulatedInput])

  useEffect(() => {
    if (nowRef.current && !scrolledRef.current) {
      scrolledRef.current = true
      setTimeout(() => {
        nowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  })

  const days = FESTIVAL_DAYS[city] || FESTIVAL_DAYS.ba
  const dayLabels = locale === 'en' ? DAY_LABELS_EN : DAY_LABELS_SK

  const currentDay = useMemo(() => {
    return getCurrentWallDate(currentTime)
  }, [currentTime])

  const [activeDay, setActiveDay] = useState<string>(
    days.includes(currentDay) ? currentDay : days[0]
  )

  useEffect(() => {
    if (days.includes(currentDay)) {
      setActiveDay(currentDay)
    }
  }, [currentDay, days])

  const dayEvents = useMemo(() => {
    return events
      .filter((e) => {
        const day = getEventDay(e)
        return day === activeDay
      })
      .sort((a, b) => {
        const aStart = a.start ? new Date(a.start).getTime() : 0
        const bStart = b.start ? new Date(b.start).getTime() : 0
        return aStart - bStart
      })
  }, [events, activeDay])

  const eventsWithoutStart = events.filter((e) => !e.start)

  function isLive(event: Event): boolean {
    if (!event.start || !event.end) return false
    const eventDay = getEventDay(event)
    if (eventDay !== currentDay) return false

    const startMin = getLocalMinutes(new Date(event.start))
    const endMin = getLocalMinutes(new Date(event.end))
    const nowMin = getCurrentLocalMinutes(currentTime)

    if (endMin <= startMin) {
      return nowMin >= startMin || nowMin <= endMin
    }
    return nowMin >= startMin && nowMin <= endMin
  }

  function isPast(event: Event): boolean {
    if (!event.end) return false
    const eventDay = getEventDay(event)
    if (!eventDay) return false

    if (eventDay < currentDay) return true
    if (eventDay > currentDay) return false

    const endMin = getLocalMinutes(new Date(event.end))
    const startMin = getLocalMinutes(new Date(event.start!))
    const nowMin = getCurrentLocalMinutes(currentTime)

    if (endMin <= startMin) {
      return nowMin > endMin && nowMin < startMin
    }
    return nowMin > endMin
  }

  return (
    <div>
      {debugMode && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-yellow-900/95 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Debug Mode</span>
            <span className="text-yellow-400/50 text-[10px]">from Festival Settings</span>
          </div>
          <input
            type="datetime-local"
            value={simulatedInput}
            onChange={(e) => {
              setSimulatedInput(e.target.value)
              scrolledRef.current = false
            }}
            className="w-full px-3 py-1.5 bg-black/50 border border-yellow-500/30 rounded text-sm text-white"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-yellow-400/60 text-xs">
              {simulatedInput.replace('T', ' ')}
            </p>
            <button
              onClick={() => {
                setSimulatedInput(toInputValue(new Date()))
                scrolledRef.current = false
              }}
              className="text-yellow-400/60 text-xs hover:text-yellow-400 underline"
            >
              Reset to now
            </button>
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeDay === day
                ? 'bg-[#8ebc35] text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {dayLabels[day] || day}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="space-y-4">
        {dayEvents.length === 0 && (
          <p className="text-white/40 text-center py-12">
            {locale === 'en' ? 'No events scheduled for this day.' : 'Na tento deň nie sú naplánované žiadne udalosti.'}
          </p>
        )}

        {dayEvents.map((event) => {
          const live = isLive(event)
          const past = isPast(event)
          const displayStart = event.start ? formatTime(new Date(event.start)) : null
          const displayEnd = event.end ? formatTime(new Date(event.end)) : null

          return (
            <div key={event.id} ref={live ? nowRef : undefined}>
            <Link
              href={`/y${year}/${city}/umelci/${event.artistId}`}
              className={`group relative flex overflow-hidden rounded-xl transition-all duration-300 ${
                live
                  ? 'bg-gradient-to-r from-[#8ebc35]/15 to-[#8ebc35]/5 border border-[#8ebc35]/40 shadow-lg shadow-[#8ebc35]/10'
                  : past
                    ? 'bg-white/[0.02] border border-white/5 opacity-40'
                    : 'bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {/* Left time strip */}
              <div className={`flex flex-col items-center justify-center w-20 shrink-0 py-4 border-r ${
                live
                  ? 'border-[#8ebc35]/30 bg-[#8ebc35]/10'
                  : 'border-white/5 bg-white/[0.02]'
              }`}>
                {displayStart ? (
                  <>
                    <span className={`text-lg font-bold tabular-nums ${live ? 'text-[#8ebc35]' : 'text-white/80'}`}>
                      {displayStart}
                    </span>
                    {displayEnd && (
                      <span className="text-[10px] text-white/30 mt-0.5">
                        {displayEnd}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-white/30">—</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className={`font-semibold truncate ${live ? 'text-white' : 'text-white/90 group-hover:text-white'} transition-colors`}>
                      {event.name}
                    </h3>
                    {event.work && (
                      <p className="text-white/50 text-sm mt-0.5 truncate">{event.work}</p>
                    )}
                  </div>

                  {live && (
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-full bg-[#8ebc35]/20">
                      <span className="w-1.5 h-1.5 bg-[#8ebc35] rounded-full animate-pulse" />
                      <span className="text-[#8ebc35] text-[10px] font-bold uppercase tracking-wider">
                        {locale === 'en' ? 'Live' : 'Live'}
                      </span>
                    </div>
                  )}
                  {past && !live && (
                    <div className="shrink-0 px-2 py-1 rounded-full bg-white/5">
                      <span className="text-white/30 text-[10px] font-medium uppercase tracking-wider">
                        {locale === 'en' ? 'Finished' : 'Ukončené'}
                      </span>
                    </div>
                  )}
                  {!live && !past && (
                    <div className="shrink-0 px-2 py-1 rounded-full bg-blue-500/10">
                      <span className="text-blue-400/70 text-[10px] font-medium uppercase tracking-wider">
                        {locale === 'en' ? 'Upcoming' : 'Plánované'}
                      </span>
                    </div>
                  )}
                </div>

                {event.place && (
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-white/40 truncate">{event.place}</span>
                  </div>
                )}

              </div>

              {/* Right arrow */}
              <div className="flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            </div>
          )
        })}
      </div>

      {/* Events with only dateText (no structured start/end) */}
      {eventsWithoutStart.length > 0 && activeDay === days[0] && (
        <div className="mt-10 border-t border-white/10 pt-8">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            {locale === 'en' ? 'All festival days' : 'Všetky festivalové dni'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {eventsWithoutStart.map((event) => (
              <Link
                key={event.id}
                href={`/y${year}/${city}/umelci/${event.artistId}`}
                className="group flex items-center gap-3 border border-white/5 rounded-lg p-3 hover:border-white/15 hover:bg-white/[0.03] transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#8ebc35] transition-colors shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-sm text-white/80 group-hover:text-white truncate transition-colors">{event.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
