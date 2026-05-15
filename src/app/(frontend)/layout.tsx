import type { Metadata } from 'next'
import React from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Analytics } from '@/components/Analytics'
import { getPayloadClient } from '@/lib/payload'
import { getLocale } from '@/lib/locale'
import '../globals.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    default: 'Biela Noc',
    template: '%s | Biela Noc',
  },
  description: 'Festival súčasného umenia / Contemporary art festival',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bielanoc.sk'),
  openGraph: {
    type: 'website',
    siteName: 'Biela Noc',
    title: 'Biela Noc — Festival súčasného umenia',
    description: 'Festival súčasného umenia v Bratislave a Košiciach / Contemporary art festival in Bratislava and Košice',
    locale: 'sk_SK',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const [ticketSettings, festivalSettings, artistYears] = await Promise.all([
    payload.findGlobal({ slug: 'ticket-settings' }).catch(() => null),
    payload.findGlobal({ slug: 'festival-settings', locale }).catch(() => null),
    payload.find({ collection: 'artists', limit: 0, depth: 0 }).then((res) => {
      const years = [...new Set(res.docs.map((a) => (a as unknown as { year?: string }).year as string).filter(Boolean))]
      return years.sort((a, b) => Number(b) - Number(a))
    }).catch(() => ['2025']),
  ])
  const ticketSaleEnabled = ticketSettings?.saleEnabled ?? false
  const settings = festivalSettings as Record<string, unknown> | null
  const dateInfo = {
    ba: (settings?.dateInfoBA as string) ?? null,
    ke: (settings?.dateInfoKE as string) ?? null,
  }
  const socialLinks = {
    instagram: (settings?.socialInstagram as string) || null,
    facebook: (settings?.socialFacebook as string) || null,
  }
  const availableYears = artistYears as string[]

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_S3_URL!} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_S3_URL!} />
      </head>
      <body className="bg-black text-white min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#8ebc35] focus:text-black focus:rounded focus:text-sm focus:font-medium"
        >
          {locale === 'en' ? 'Skip to content' : 'Preskočiť na obsah'}
        </a>
        <NavBar ticketSaleEnabled={ticketSaleEnabled} dateInfo={dateInfo} locale={locale} availableYears={availableYears} socialLinks={socialLinks} />
        <main id="main-content" className="pt-16 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
