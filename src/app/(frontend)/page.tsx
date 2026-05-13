import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          BIELA NOC
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto">
          Festival súčasného umenia
        </p>
        <p className="text-sm text-white/40">
          3. – 5. október 2025
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <CityLink href="/y2025/ba/umelci" city="Bratislava" />
        <CityLink href="/y2025/ke/umelci" city="Košice" />
      </div>
    </div>
  )
}

function CityLink({ href, city }: { href: string; city: string }) {
  return (
    <Link
      href={href}
      className="group relative px-10 py-5 border border-white/20 hover:border-[#8ebc35] transition-all duration-300 text-center min-w-[200px]"
    >
      <span className="text-lg uppercase tracking-widest group-hover:text-[#8ebc35] transition-colors">
        {city}
      </span>
    </Link>
  )
}
