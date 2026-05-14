'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setLocale } from '@/app/(frontend)/actions'
import type { Locale } from '@/lib/locale'

type Props = {
  current: Locale
}

export function LanguageToggle({ current }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function toggle() {
    const next: Locale = current === 'sk' ? 'en' : 'sk'
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="text-xs border border-white/20 rounded px-2 py-1 text-white/60 hover:text-white hover:border-white/40 transition-colors disabled:opacity-50"
      aria-label={current === 'sk' ? 'Switch to English' : 'Prepnúť na slovenčinu'}
    >
      {current === 'sk' ? 'EN' : 'SK'}
    </button>
  )
}
