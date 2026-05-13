import type { Metadata } from 'next'
import React from 'react'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Biela Noc',
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
        {children}
      </body>
    </html>
  )
}
