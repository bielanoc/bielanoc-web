'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'

type Event = {
  id: string
  name: string
  work: string | null
  place: string | null
  dateText: string | null
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

function parseTime(iso: string | null): Date | null {
  if (!iso) return null
  return new Date(iso)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('sk', { hour: '2-digit', minute: '2-digit' })
}

function getEventDay(event: Event): string | null {
  if (!event.start) return null
  const d = new Date(event.start)
  const hour = d.getUTCHours()
  // Events after midnight (00:00-05:00) belong to previous day
  if (hour < 5) {
    d.setUTCDate(d.getUTCDate() - 1)
  }
  return d.toISOString().slice(0, 10)
}

export function ProgramTimeline({ events, city, year, locale, debugMode, debugTime }: Props) {
  const [simulatedTime, setSimulatedTime] = useState<string>(
    debugTime || new Date().toISOString().slice(0, 16)
  )
  const [currentTime, setCurrentTime] = useState<Date>(
    debugMode && debugTime ? new Date(debugTime) : new Date()
  )
  const nowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debugMode) {
      setCurrentTime(new Date(simulatedTime))
    } else {
      setCurrentTime(new Date())
      const interval = setInterval(() => setCurrentTime(new Date()), 60000)
      return () => clearInterval(interval)
    }
  }, [debugMode, simulatedTime])

  useEffect(() => {
    if (nowRef.current) {
      nowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentTime])

  const days = FESTIVAL_DAYS[city] || FESTIVAL_DAYS.ba
  const dayLabels = locale === 'en' ? DAY_LABELS_EN : DAY_LABELS_SK

  const currentDay = useMemo(() => {
    const dateStr = currentTime.toISOString().slice(0, 10)
    const hour = currentTime.getHours()
    if (hour < 5) {
      const prev = new Date(currentTime)
      prev.setDate(prev.getDate() - 1)
      return prev.toISOString().slice(0, 10)
    }
    return dateStr
  }, [currentTime])

  const [activeDay, setActiveDay] = useState<string>(
    days.includes(currentDay) ? currentDay : days[0]
  )

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

  const eventsWithoutStart = events.filter((e) => !e.start && e.dateText)

  function isLive(event: Event): boolean {
    if (!event.start || !event.end) return false
    const start = new Date(event.start).getTime()
    const end = new Date(event.end).getTime()
    const now = currentTime.getTime()
    return now >= start && now <= end
  }

  function isPast(event: Event): boolean {
    if (!event.end) return false
    return currentTime.getTime() > new Date(event.end).getTime()
  }

  return (
    <div>
      {debugMode && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-yellow-900/95 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Debug Mode</span>
          </div>
          <input
            type="datetime-local"
            value={simulatedTime}
            onChange={(e) => setSimulatedTime(e.target.value)}
            className="w-full px-3 py-1.5 bg-black/50 border border-yellow-500/30 rounded text-sm text-white"
          />
          <p className="text-yellow-400/60 text-xs mt-1">
            Simulated: {currentTime.toLocaleString('sk')}
          </p>
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
      <div className="space-y-3">
        {dayEvents.length === 0 && (
          <p className="text-white/40 text-center py-8">
            {locale === 'en' ? 'No events scheduled for this day.' : 'Na tento deň nie sú naplánované žiadne udalosti.'}
          </p>
        )}

        {dayEvents.map((event) => {
          const live = isLive(event)
          const past = isPast(event)
          const startDate = parseTime(event.start)
          const endDate = parseTime(event.end)

          return (
            <div
              key={event.id}
              ref={live ? nowRef : undefined}
              className={`relative border rounded-lg p-4 transition-all ${
                live
                  ? 'border-[#8ebc35] bg-[#8ebc35]/10'
                  : past
                    ? 'border-white/5 bg-white/2 opacity-50'
                    : 'border-white/10 bg-white/5'
              }`}
            >
              {live && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#8ebc35] rounded-full animate-pulse" />
                  <span className="text-[#8ebc35] text-xs font-bold uppercase">
                    {locale === 'en' ? 'Live' : 'Práve teraz'}
                  </span>
                </div>
              )}

              <Link
                href={`/${year}/${city}/umelci/${event.id}`}
                className="block hover:opacity-80 transition-opacity"
              >
                <h3 className="font-semibold text-lg pr-24">{event.name}</h3>
                {event.work && (
                  <p className="text-white/60 text-sm mt-0.5">{event.work}</p>
                )}
              </Link>

              <div className="flex items-center gap-3 mt-2 text-sm text-white/40">
                {startDate && endDate && (
                  <span>{formatTime(startDate)} – {formatTime(endDate)}</span>
                )}
                {event.place && (
                  <>
                    <span>·</span>
                    <span>{event.place}</span>
                  </>
                )}
              </div>

              {event.dateText && !startDate && (
                <p className="text-white/40 text-xs mt-1">{event.dateText}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Events with only dateText (no structured start/end) */}
      {eventsWithoutStart.length > 0 && activeDay === days[0] && (
        <div className="mt-8 border-t border-white/10 pt-6">
          <h2 className="text-sm font-medium text-white/50 uppercase tracking-wide mb-4">
            {locale === 'en' ? 'All days' : 'Všetky dni'}
          </h2>
          <div className="space-y-2">
            {eventsWithoutStart.map((event) => (
              <Link
                key={event.id}
                href={`/${year}/${city}/umelci/${event.id}`}
                className="block border border-white/5 rounded-lg p-3 hover:border-white/20 transition-colors"
              >
                <h3 className="font-medium">{event.name}</h3>
                <p className="text-white/40 text-xs mt-0.5">{event.dateText}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
