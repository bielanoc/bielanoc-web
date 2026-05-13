'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const COLS = 128
    const bands = [
      // Top aurora
      { y: 0.18, height: 0.6, hue: 130, speed: 0.15, waveAmp: 0.10, waveFreq: 2.4, alpha: 0.13 },
      { y: 0.30, height: 0.5, hue: 160, speed: 0.20, waveAmp: 0.08, waveFreq: 3.2, alpha: 0.10 },
      { y: 0.22, height: 0.55, hue: 100, speed: 0.18, waveAmp: 0.09, waveFreq: 2.8, alpha: 0.09 },
      { y: 0.38, height: 0.45, hue: 190, speed: 0.12, waveAmp: 0.07, waveFreq: 4.0, alpha: 0.08 },
      { y: 0.12, height: 0.65, hue: 145, speed: 0.10, waveAmp: 0.11, waveFreq: 1.6, alpha: 0.07 },
      { y: 0.28, height: 0.5, hue: 120, speed: 0.22, waveAmp: 0.06, waveFreq: 3.6, alpha: 0.06 },
      { y: 0.40, height: 0.4, hue: 170, speed: 0.16, waveAmp: 0.09, waveFreq: 2.0, alpha: 0.07 },
      // Bottom aurora
      { y: 0.75, height: 0.5, hue: 200, speed: 0.13, waveAmp: 0.08, waveFreq: 2.6, alpha: 0.10 },
      { y: 0.82, height: 0.45, hue: 140, speed: 0.17, waveAmp: 0.07, waveFreq: 3.0, alpha: 0.08 },
      { y: 0.70, height: 0.55, hue: 165, speed: 0.11, waveAmp: 0.10, waveFreq: 1.8, alpha: 0.07 },
      { y: 0.85, height: 0.4, hue: 110, speed: 0.19, waveAmp: 0.06, waveFreq: 3.4, alpha: 0.06 },
    ]

    type Star = { x: number; y: number; speed: number; length: number; alpha: number; angle: number }
    const stars: Star[] = []

    function spawnStar(w: number, h: number) {
      const fast = Math.random() > 0.6
      stars.push({
        x: Math.random() * w,
        y: -10,
        speed: fast ? 3 + Math.random() * 4 : 0.8 + Math.random() * 1.5,
        length: fast ? 40 + Math.random() * 60 : 15 + Math.random() * 25,
        alpha: 0.5 + Math.random() * 0.4,
        angle: Math.PI * 0.52 + (Math.random() - 0.5) * 0.3,
      })
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function render() {
      const w = canvas!.width
      const h = canvas!.height
      const t = time * 0.001

      ctx!.fillStyle = '#000'
      ctx!.fillRect(0, 0, w, h)

      const colW = w / COLS

      for (const band of bands) {
        const hueShift = Math.sin(t * band.speed * 0.4) * 15
        const breathe = 0.85 + 0.15 * Math.sin(t * band.speed * 0.6)

        for (let i = 0; i < COLS; i++) {
          const xRatio = i / COLS
          const wave = Math.sin(xRatio * Math.PI * band.waveFreq + t * band.speed) * band.waveAmp
          const wave2 = Math.sin(xRatio * Math.PI * band.waveFreq * 0.6 + t * band.speed * 1.3) * band.waveAmp * 0.5
          const wave3 = Math.sin(xRatio * Math.PI * band.waveFreq * 1.8 + t * band.speed * 0.5) * band.waveAmp * 0.3
          const localY = (band.y + wave + wave2 + wave3) * h
          const localH = band.height * h * (0.85 + 0.15 * Math.sin(xRatio * 5 + t * band.speed * 1.3))

          const gradient = ctx!.createLinearGradient(0, localY - localH * 0.5, 0, localY + localH * 0.5)
          const a = band.alpha * breathe * (0.7 + 0.3 * Math.sin(xRatio * 3 + t * band.speed * 0.8))
          const hue = band.hue + hueShift + Math.sin(xRatio * 4) * 8

          gradient.addColorStop(0, 'hsla(0, 0%, 0%, 0)')
          gradient.addColorStop(0.25, `hsla(${hue}, 35%, 28%, ${a * 0.2})`)
          gradient.addColorStop(0.4, `hsla(${hue}, 40%, 38%, ${a * 0.6})`)
          gradient.addColorStop(0.5, `hsla(${hue}, 45%, 45%, ${a})`)
          gradient.addColorStop(0.6, `hsla(${hue + 8}, 40%, 38%, ${a * 0.6})`)
          gradient.addColorStop(0.75, `hsla(${hue + 12}, 35%, 28%, ${a * 0.2})`)
          gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

          ctx!.fillStyle = gradient
          ctx!.fillRect(i * colW, 0, colW + 1, h)
        }
      }

      // Falling stars
      if (Math.random() < 0.008) spawnStar(w, h)

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        const dx = Math.cos(s.angle) * s.speed
        const dy = Math.sin(s.angle) * s.speed
        s.x += dx
        s.y += dy

        const tailX = s.x - Math.cos(s.angle) * s.length
        const tailY = s.y - Math.sin(s.angle) * s.length

        const gradient = ctx!.createLinearGradient(tailX, tailY, s.x, s.y)
        gradient.addColorStop(0, 'hsla(0, 0%, 100%, 0)')
        gradient.addColorStop(1, `hsla(0, 0%, 100%, ${s.alpha})`)

        ctx!.strokeStyle = gradient
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(s.x, s.y)
        ctx!.stroke()

        if (s.y > h + 50 || s.x > w + 50 || s.x < -50) {
          stars.splice(i, 1)
        }
      }

      time++
      animationId = requestAnimationFrame(render)
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 blur-[2px]"
      aria-hidden="true"
    />
  )
}
