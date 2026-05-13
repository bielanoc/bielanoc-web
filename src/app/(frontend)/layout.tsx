import type { Metadata } from 'next'
import React from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Biela Noc',
    template: '%s | Biela Noc',
  },
  description: 'Festival súčasného umenia / Contemporary art festival',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className="bg-black text-white min-h-screen antialiased">
        <NavBar />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}
