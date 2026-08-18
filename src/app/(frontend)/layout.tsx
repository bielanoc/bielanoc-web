import type { Metadata } from 'next'
import React from 'react'
import { FloatingMenuButton } from '@/components/FloatingMenuButton'
import { ConditionalFooter } from '@/components/ConditionalFooter'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Analytics } from '@/components/Analytics'
import { getPayloadClient, getTicketSettings, getFestivalSettings, getBrandingSettings, getNavigationSettings } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
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
  const [ticketSettings, festivalSettings, branding, navigation, artistYears] = await Promise.all([
    getTicketSettings(),
    getFestivalSettings(locale),
    getBrandingSettings(locale),
    getNavigationSettings(locale),
    payload.find({ collection: 'artists', limit: 0, depth: 0 }).then((res) => {
      const years = [...new Set(res.docs.map((a) => a.year).filter(Boolean))]
      return years.sort((a, b) => Number(b) - Number(a))
    }).catch(() => ['2025']),
  ])

  // The year switcher options come from years that have seeded artists, but the
  // current festival edition (from FestivalSettings) may not have any artists
  // yet — include it so the menu offers the current year and the homepage links
  // to /y<currentYear>/… resolve to a valid, selectable option.
  const currentYear = festivalSettings?.currentYear
  const availableYears = [...new Set([currentYear, ...artistYears].filter(Boolean) as string[])].sort(
    (a, b) => Number(b) - Number(a),
  )

  const ticketSaleEnabled = ticketSettings?.saleEnabled ?? false
  const debugMode = festivalSettings?.debugMode ?? false
  const debugTime = festivalSettings?.debugTime ?? null
  const festivalActive = festivalSettings?.festivalActive ?? true

  const logoUrl = getMediaUrl(branding?.logo?.image) || '/logo-bn.svg'
  const accentColor = branding?.colors?.accent || '#ff6b4a'
  const menuGradientColor = branding?.colors?.menuGradient || '#0a1628'
  const footerText = branding?.footer?.text || null
  const footerLinks = branding?.footer?.links || []

  const socialLinks = {
    instagram: navigation?.socialInstagram || null,
    facebook: navigation?.socialFacebook || null,
  }
  const menuItems = navigation?.menuItems || []

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
        <main id="main-content" className="relative min-h-screen">
          <FloatingMenuButton
            ticketSaleEnabled={ticketSaleEnabled}
            locale={locale}
            availableYears={availableYears}
            socialLinks={socialLinks}
            menuItems={menuItems}
            debugMode={debugMode}
            debugTime={debugTime}
            festivalActive={festivalActive}
            logoUrl={logoUrl}
            menuGradientColor={menuGradientColor}
          />
          {children}
        </main>
        <ConditionalFooter text={footerText} links={footerLinks} />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
