'use client'

import { useRef, useState, useEffect } from 'react'

type Props = {
  src: string
  title?: string
}

export function AudioPlayer({ src, title }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    audio.currentTime = ratio * duration
  }

  function formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded px-3 py-2">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8ebc35] text-black hover:bg-[#7aa82d] transition-colors shrink-0"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="1" width="3" height="10" rx="1" />
            <rect x="7" y="1" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 1.5v9l7.5-4.5L3 1.5z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-xs text-white/60 truncate mb-1">{title}</p>
        )}
        <div
          className="h-1.5 bg-white/10 rounded-full cursor-pointer relative"
          onClick={seek}
        >
          <div
            className="h-full bg-[#8ebc35] rounded-full transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="text-[10px] text-white/40 tabular-nums shrink-0">
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>
    </div>
  )
}
