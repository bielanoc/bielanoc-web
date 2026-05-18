import Link from 'next/link'
import Image from 'next/image'
import { AuroraBackground } from '@/components/AuroraBackground'
import { getFestivalSettings } from '@/lib/payload'
import { getLocale, UI_STRINGS } from '@/lib/locale'

export default async function AuroraPage() {
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const settings = await getFestivalSettings(locale)
  const currentYear = settings?.currentYear ?? '2025'
  const dateDisplay = settings?.dateInfoBA || settings?.dateInfoKE || null

  return (
    <>
      <AuroraBackground />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 relative">
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white/90">
            BIELA NOC
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-md mx-auto">
            {t.festival}
          </p>
          {dateDisplay && (
            <p className="text-sm text-white/30">
              {dateDisplay}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-16">
          <CityLink href={`/y${currentYear}/ba/umelci`} city="Bratislava" />
          <CityLink href={`/y${currentYear}/ke/umelci`} city="Košice" />
        </div>

        <Image
          src="/cityline.png"
          alt=""
          width={1400}
          height={200}
          className="absolute bottom-8 left-0 w-full h-auto opacity-60 pointer-events-none"
          priority
        />
      </div>
    </>
  )
}

function CityLink({ href, city }: { href: string; city: string }) {
  return (
    <Link
      href={href}
      className="group relative px-10 py-5 border border-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-500 text-center min-w-[200px]"
    >
      <span className="text-lg uppercase tracking-widest text-white/70 group-hover:text-white transition-colors duration-500">
        {city}
      </span>
    </Link>
  )
}
