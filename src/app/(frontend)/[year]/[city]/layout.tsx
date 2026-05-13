import React from 'react'

type Props = {
  children: React.ReactNode
  params: Promise<{ year: string; city: string }>
}

export default async function CityYearLayout({ children, params }: Props) {
  const { year, city } = await params

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <a href="/" className="text-xl font-bold">
          Biela Noc
        </a>
        <nav className="flex gap-4 text-sm">
          <a href={`/${year}/${city}/umelci`} className="hover:text-[#8ebc35] transition-colors">
            Umelci
          </a>
          <a href={`/${year}/${city}/mapa`} className="hover:text-[#8ebc35] transition-colors">
            Mapa
          </a>
          <a href={`/${year}/${city}/partneri`} className="hover:text-[#8ebc35] transition-colors">
            Partneri
          </a>
          <a href={`/${year}/${city}/info`} className="hover:text-[#8ebc35] transition-colors">
            Info
          </a>
        </nav>
      </header>
      <main className="pt-16">{children}</main>
    </div>
  )
}
