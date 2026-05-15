import Link from 'next/link'
import { OffFestivalHome } from '@/components/OffFestivalHome'
import { getPayloadClient } from '@/lib/payload'
import { getLocale } from '@/lib/locale'

export default async function HomePage() {
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'festival-settings' }).catch(() => null) as Record<string, unknown> | null
  const festivalActive = (settings?.festivalActive as boolean) ?? true
  const currentYear = (settings?.currentYear as string) ?? '2025'

  if (!festivalActive) {
    const articlesResult = await payload.find({
      collection: 'articles',
      limit: 20,
      sort: '-createdAt',
      locale,
    }).catch(() => null)

    const articles = (articlesResult?.docs ?? []).map((a) => ({
      id: String(a.id),
      title: (a.title as string) || '',
      excerpt: '',
      createdAt: (a as unknown as { createdAt: string }).createdAt,
    }))

    return <OffFestivalHome articles={articles} locale={locale} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen w-full">
      <Link
        href={`/y${currentYear}/ba/umelci`}
        className="relative flex items-start p-10 sm:p-10 bg-[#8094F7] group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
      >
        <div className="w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)] grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homepage/2025/ba.png"
            alt="Bratislava"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homepage/2025/ba_hover.png"
            alt="Bratislava"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </Link>

      <Link
        href={`/y${currentYear}/ke/umelci`}
        className="relative flex items-start p-10 sm:p-10 bg-[#B2BCAC] group focus-visible:shadow-[inset_0_0_0_5px_#ffffff] focus-visible:outline-none"
      >
        <div className="w-full h-[min(35vh,30vw)] lg:h-[min(35vh,30vw)] grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homepage/2025/ke.png"
            alt="Košice"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease group-hover:opacity-0 group-focus:opacity-0"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homepage/2025/ke_hover.png"
            alt="Košice"
            className="w-full h-full object-contain object-top-left col-start-1 row-start-1 transition-opacity duration-300 ease opacity-0 group-hover:opacity-100 group-focus:opacity-100"
          />
        </div>
      </Link>
    </div>
  )
}
