'use client'

import { useState } from 'react'

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

type Props = {
  debugMode: boolean
  debugTime: string | null
  festivalActive: boolean
}

export function DebugTimePicker({ debugMode, debugTime, festivalActive }: Props) {
  const debugDate = debugMode && debugTime ? localToUTC(debugTime) : null
  const initialInput = debugDate ? toInputValue(debugDate) : toInputValue(new Date())
  const [simulatedInput, setSimulatedInput] = useState(initialInput)
  const [festivalOn, setFestivalOn] = useState(festivalActive)

  if (!debugMode) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-yellow-900/95 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Debug Mode</span>
        <span className="text-yellow-400/50 text-[10px]">from Festival Settings</span>
      </div>

      <div className="flex items-center justify-between mb-3 py-1.5 border-b border-yellow-500/20">
        <span className="text-yellow-400/80 text-xs">Festival mode</span>
        <button
          onClick={() => setFestivalOn((v) => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors ${festivalOn ? 'bg-[#8ebc35]' : 'bg-white/20'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${festivalOn ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>

      <input
        type="datetime-local"
        value={simulatedInput}
        onChange={(e) => setSimulatedInput(e.target.value)}
        className="w-full px-3 py-1.5 bg-black/50 border border-yellow-500/30 rounded text-sm text-white"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-yellow-400/60 text-xs">
          {simulatedInput.replace('T', ' ')}
        </p>
        <button
          onClick={() => setSimulatedInput(toInputValue(new Date()))}
          className="text-yellow-400/60 text-xs hover:text-yellow-400 underline"
        >
          Reset to now
        </button>
      </div>
    </div>
  )
}

export { localToUTC, toInputValue, getLocalParts, TZ }
