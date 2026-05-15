'use client'

import { useMemo } from 'react'

type Props = {
  enabled?: boolean
  colors?: string[]
}

const DEFAULT_COLORS = ['#F5E455', '#FF5555', '#FF2AC4', '#5555FF']
const DOTS_PER_COLOR = 3

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function Stars({ enabled = true, colors = DEFAULT_COLORS }: Props) {
  const dots = useMemo(() => {
    const allColors = colors.flatMap((c) => Array(DOTS_PER_COLOR).fill(c) as string[])
    return allColors.map((color, i) => ({
      color,
      x: seededRandom(i * 7 + 1) * 100,
      y: seededRandom(i * 13 + 3) * 100,
    }))
  }, [colors])

  if (!enabled) return null

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
