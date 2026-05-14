'use client'

import { useEffect, useRef } from 'react'

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const offscreen = document.createElement('canvas')
    const offCtx = offscreen.getContext('2d')!

    let animationId: number
    let time = 0
    let lastFrame = 0
    const FPS = 30
    const FRAME_MS = 1000 / FPS
    const RENDER_W = 64
    const RENDER_H = 48

    const bands = [
      // Top aurora
      { y: 0.15, height: 0.3, hue: 130, speed: 0.15, waveAmp: 0.10, waveFreq: 2.4, alpha: 0.14 },
      { y: 0.22, height: 0.25, hue: 160, speed: 0.20, waveAmp: 0.08, waveFreq: 3.2, alpha: 0.11 },
      { y: 0.18, height: 0.28, hue: 100, speed: 0.18, waveAmp: 0.09, waveFreq: 2.8, alpha: 0.10 },
      // Middle
      { y: 0.42, height: 0.22, hue: 190, speed: 0.16, waveAmp: 0.12, waveFreq: 4.0, alpha: 0.10 },
      { y: 0.50, height: 0.2, hue: 145, speed: 0.19, waveAmp: 0.11, waveFreq: 2.2, alpha: 0.08 },
      { y: 0.46, height: 0.25, hue: 170, speed: 0.22, waveAmp: 0.10, waveFreq: 3.0, alpha: 0.07 },
      // Bottom aurora
      { y: 0.72, height: 0.25, hue: 200, speed: 0.18, waveAmp: 0.12, waveFreq: 2.6, alpha: 0.12 },
      { y: 0.80, height: 0.22, hue: 140, speed: 0.21, waveAmp: 0.11, waveFreq: 3.0, alpha: 0.09 },
      { y: 0.76, height: 0.28, hue: 165, speed: 0.16, waveAmp: 0.13, waveFreq: 1.8, alpha: 0.08 },
    ]

    type Star = {
      x: number; y: number; speed: number; length: number
      alpha: number; angle: number; hue: number; width: number
      decay: number; age: number
    }
    const stars: Star[] = []

    function spawnStar(w: number, h: number) {
      const brightness = Math.random()
      const isBright = brightness > 0.7
      stars.push({
        x: Math.random() * w,
        y: Math.random() * -50,
        speed: 4 + Math.random() * 8,
        length: isBright ? 80 + Math.random() * 120 : 30 + Math.random() * 60,
        alpha: isBright ? 0.8 + Math.random() * 0.2 : 0.4 + Math.random() * 0.3,
        angle: Math.PI * 0.52 + (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? 40 + Math.random() * 20 : 200 + Math.random() * 40,
        width: isBright ? 2 + Math.random() * 1.5 : 1 + Math.random() * 0.8,
        decay: 0.992 + Math.random() * 0.006,
        age: 0,
      })
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    offscreen.width = RENDER_W
    offscreen.height = RENDER_H

    function render(now: number) {
      animationId = requestAnimationFrame(render)

      const delta = now - lastFrame
      if (delta < FRAME_MS) return
      lastFrame = now - (delta % FRAME_MS)

      const w = canvas!.width
      const h = canvas!.height
      const t = time * 0.03

      // Render aurora at low resolution
      offCtx.fillStyle = '#000'
      offCtx.fillRect(0, 0, RENDER_W, RENDER_H)

      for (const band of bands) {
        const hueShift = Math.sin(t * band.speed * 0.4) * 15
        const breathe = 0.85 + 0.15 * Math.sin(t * band.speed * 0.6)

        for (let i = 0; i < RENDER_W; i++) {
          const xRatio = i / RENDER_W
          const wave = Math.sin(xRatio * Math.PI * band.waveFreq + t * band.speed) * band.waveAmp
          const wave2 = Math.sin(xRatio * Math.PI * band.waveFreq * 0.6 + t * band.speed * 1.3) * band.waveAmp * 0.5
          const wave3 = Math.sin(xRatio * Math.PI * band.waveFreq * 1.8 + t * band.speed * 0.5) * band.waveAmp * 0.3
          const localY = (band.y + wave + wave2 + wave3) * RENDER_H
          const localH = band.height * RENDER_H * (0.85 + 0.15 * Math.sin(xRatio * 5 + t * band.speed * 1.3))

          const gradient = offCtx.createLinearGradient(0, localY - localH * 0.5, 0, localY + localH * 0.5)
          const a = band.alpha * breathe * (0.7 + 0.3 * Math.sin(xRatio * 3 + t * band.speed * 0.8))
          const hue = band.hue + hueShift + Math.sin(xRatio * 4) * 8

          gradient.addColorStop(0, 'hsla(0, 0%, 0%, 0)')
          gradient.addColorStop(0.25, `hsla(${hue}, 12%, 50%, ${a * 0.2})`)
          gradient.addColorStop(0.4, `hsla(${hue}, 15%, 60%, ${a * 0.6})`)
          gradient.addColorStop(0.5, `hsla(${hue}, 18%, 68%, ${a})`)
          gradient.addColorStop(0.6, `hsla(${hue + 8}, 15%, 60%, ${a * 0.6})`)
          gradient.addColorStop(0.75, `hsla(${hue + 12}, 12%, 50%, ${a * 0.2})`)
          gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)')

          offCtx.fillStyle = gradient
          offCtx.fillRect(i, 0, 1, RENDER_H)
        }
      }

      // Scale up to full screen — bilinear interpolation smooths everything
      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'
      ctx!.drawImage(offscreen, 0, 0, w, h)

      // Perseids
      if (Math.random() < 0.035) spawnStar(w, h)

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.alpha *= s.decay
        s.age++

        const tailX = s.x - Math.cos(s.angle) * s.length
        const tailY = s.y - Math.sin(s.angle) * s.length

        // Fading tail gradient
        const tailGrad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y)
        tailGrad.addColorStop(0, 'hsla(0, 0%, 100%, 0)')
        tailGrad.addColorStop(0.6, `hsla(${s.hue}, 30%, 70%, ${s.alpha * 0.3})`)
        tailGrad.addColorStop(0.85, `hsla(${s.hue}, 20%, 85%, ${s.alpha * 0.7})`)
        tailGrad.addColorStop(1, `hsla(0, 0%, 100%, ${s.alpha})`)

        ctx!.strokeStyle = tailGrad
        ctx!.lineWidth = s.width
        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(s.x, s.y)
        ctx!.stroke()

        // Bright head
        if (s.alpha > 0.3) {
          ctx!.beginPath()
          ctx!.arc(s.x, s.y, s.width * 0.8, 0, Math.PI * 2)
          ctx!.fillStyle = `hsla(0, 0%, 100%, ${s.alpha})`
          ctx!.fill()
        }

        if (s.y > h + 50 || s.x > w + 50 || s.x < -50 || s.alpha < 0.05) {
          stars.splice(i, 1)
        }
      }

      time++
    }

    resize()
    animationId = requestAnimationFrame(render)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
