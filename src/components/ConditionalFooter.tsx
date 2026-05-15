'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

type Props = {
  text?: string | null
  links?: Array<{ label: string; url: string }>
}

export function ConditionalFooter({ text, links }: Props) {
  const pathname = usePathname()
  if (pathname === '/' || pathname === '') return null
  return <Footer text={text} links={links} />
}
