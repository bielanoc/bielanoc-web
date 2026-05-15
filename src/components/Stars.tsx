'use client'

import { useMemo } from 'react'

const COLORS = ['#F5E455', '#F5E455', '#F5E455', '#FF5555', '#FF5555', '#FF5555', '#FF2AC4', '#FF2AC4', '#FF2AC4', '#5555FF', '#5555FF', '#5555FF']

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function Stars() {
  const dots = useMemo(() => {
    return COLORS.map((color, i) => ({
      color,
      x: seededRandom(i * 7 + 1) * 100,
      y: seededRandom(i * 13 + 3) * 100,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full max-[450px]:w-1 max-[450px]:h-1"
          style={{
            backgroundColor: dot.color,
            left: `${dot.x}vw`,
            top: `${dot.y}vh`,
          }}
        />
      ))}
    </div>
  )
}
