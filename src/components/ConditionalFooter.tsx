'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'
import type { Locale } from '@/lib/i18n'

type Props = {
  text?: string | null
  links?: Array<{ label: string; url: string }>
  locale?: Locale
}

export function ConditionalFooter({ text, links, locale }: Props) {
  const pathname = usePathname()
  if (pathname === '/' || pathname === '') return null
  return <Footer text={text} links={links} locale={locale} />
}
