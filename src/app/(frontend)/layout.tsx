import type { Metadata } from 'next'
import React from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Analytics } from '@/components/Analytics'
import '../globals.css'

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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className="bg-black text-white min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#8ebc35] focus:text-black focus:rounded focus:text-sm focus:font-medium"
        >
          Preskočiť na obsah
        </a>
        <NavBar />
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
