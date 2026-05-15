import type { Metadata } from 'next'
import React from 'react'
import { FloatingMenuButton } from '@/components/FloatingMenuButton'
import { Stars } from '@/components/Stars'
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

function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as Record<string, unknown>
  if (m.filename) return `${process.env.NEXT_PUBLIC_S3_URL}/${m.filename}`
  if (m.url) return m.url as string
  return null
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const [ticketSettings, festivalSettings, brandingSettings, navigationSettings, artistYears] = await Promise.all([
    payload.findGlobal({ slug: 'ticket-settings' }).catch(() => null),
    payload.findGlobal({ slug: 'festival-settings', locale }).catch(() => null),
    payload.findGlobal({ slug: 'branding-settings' as 'festival-settings', locale, depth: 1 }).catch(() => null),
    payload.findGlobal({ slug: 'navigation-settings' as 'festival-settings', locale }).catch(() => null),
    payload.find({ collection: 'artists', limit: 0, depth: 0 }).then((res) => {
      const years = [...new Set(res.docs.map((a) => (a as unknown as { year?: string }).year as string).filter(Boolean))]
      return years.sort((a, b) => Number(b) - Number(a))
    }).catch(() => ['2025']),
  ])

  const ticketSaleEnabled = ticketSettings?.saleEnabled ?? false
  const settings = festivalSettings as Record<string, unknown> | null
  const branding = brandingSettings as Record<string, unknown> | null
  const navigation = navigationSettings as Record<string, unknown> | null

  const debugMode = (settings?.debugMode as boolean) ?? false
  const debugTime = (settings?.debugTime as string) ?? null
  const festivalActive = (settings?.festivalActive as boolean) ?? true
  const availableYears = artistYears as string[]

  // Branding
  const logoGroup = branding?.logo as Record<string, unknown> | null
  const logoUrl = getMediaUrl(logoGroup?.image) || '/logo-bn.svg'
  const colorsGroup = branding?.colors as Record<string, unknown> | null
  const accentColor = (colorsGroup?.accent as string) || '#8ebc35'
  const menuGradientColor = (colorsGroup?.menuGradient as string) || '#0500FF'
  const starsGroup = branding?.stars as Record<string, unknown> | null
  const starsEnabled = (starsGroup?.enabled as boolean) ?? true
  const starsColorsRaw = starsGroup?.colors as Array<{ color: string }> | null
  const starsColors = starsColorsRaw?.map((c) => c.color) || ['#F5E455', '#FF5555', '#FF2AC4', '#5555FF']
  const footerGroup = branding?.footer as Record<string, unknown> | null
  const footerText = (footerGroup?.text as string) || null
  const footerLinks = (footerGroup?.links as Array<{ label: string; url: string }>) || []

  // Navigation
  const socialLinks = {
    instagram: (navigation?.socialInstagram as string) || null,
    facebook: (navigation?.socialFacebook as string) || null,
  }
  const menuItems = (navigation?.menuItems as Array<{ label: string; url: string; useYearCity?: boolean; icon?: string; dividerAfter?: boolean }>) || []

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_S3_URL!} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_S3_URL!} />
      </head>
      <body
        className="bg-black text-white min-h-screen antialiased"
        style={{ '--accent-color': accentColor } as React.CSSProperties}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--accent-color)] focus:text-black focus:rounded focus:text-sm focus:font-medium"
        >
          {locale === 'en' ? 'Skip to content' : 'Preskočiť na obsah'}
        </a>
        <Stars enabled={starsEnabled} colors={starsColors} />
        <FloatingMenuButton
          ticketSaleEnabled={ticketSaleEnabled}
          locale={locale}
          availableYears={availableYears}
          socialLinks={socialLinks}
          debugMode={debugMode}
          debugTime={debugTime}
          festivalActive={festivalActive}
          logoUrl={logoUrl}
          menuGradientColor={menuGradientColor}
          menuItems={menuItems}
        />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer text={footerText} links={footerLinks} />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
