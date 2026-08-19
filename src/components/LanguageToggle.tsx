'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { setLocale } from '@/app/(frontend)/actions'
import type { Locale } from '@/lib/i18n'

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
      className="text-sm font-medium bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2.5 text-white/80 hover:text-white hover:bg-black/90 transition-colors disabled:opacity-50"
      aria-label={current === 'sk' ? 'Switch to English' : 'Prepnúť na slovenčinu'}
    >
      {current === 'sk' ? 'EN' : 'SK'}
    </button>
  )
}
