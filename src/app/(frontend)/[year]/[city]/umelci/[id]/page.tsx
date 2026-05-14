import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/RichText'
import { getLocale, UI_STRINGS } from '@/lib/locale'

type Props = {
  params: Promise<{ year: string; city: string; id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const payload = await getPayloadClient()
  const artist = await payload.findByID({ collection: 'artists', id, depth: 0 }).catch(() => null)
  if (!artist) return { title: 'Umelec' }

  const image = artist.image && typeof artist.image === 'object' ? artist.image : null
  const imageUrl = image?.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${image.filename}` : image?.url

  return {
    title: artist.name,
    description: artist.work || `${artist.name} — Biela Noc`,
    openGraph: {
      title: artist.name,
      description: artist.work || `${artist.name} — Biela Noc`,
      ...(imageUrl && { images: [{ url: imageUrl }] }),
    },
  }
}

export default async function ArtistDetailPage({ params }: Props) {
  const { year, city, id } = await params
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const payload = await getPayloadClient()

  const artist = await payload.findByID({
    collection: 'artists',
    id,
    depth: 2,
    locale,
  }).catch(() => null)

  if (!artist) notFound()

  const dates = Array.isArray(artist.dates)
    ? artist.dates.filter((d): d is Exclude<typeof d, number> => typeof d !== 'number')
    : []

  const records = Array.isArray(artist.records)
    ? artist.records.filter((r): r is Exclude<typeof r, number> => typeof r !== 'number')
    : []

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Link
        href={`/${year}/${city}/umelci`}
        className="text-sm text-white/50 hover:text-white transition-colors mb-6 inline-block"
      >
        ← {t.backToList}
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {artist.image && typeof artist.image === 'object' && (artist.image.filename || artist.image.url) ? (
            <div className="relative w-full aspect-[3/4] border border-white/10 overflow-hidden">
              <Image
                src={artist.image.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${artist.image.filename}` : artist.image.url!}
                alt={artist.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-full aspect-[3/4] bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-white/20 text-6xl">{artist.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            {artist.work && (
              <p className="text-[#8ebc35] mt-1">{artist.work}</p>
            )}
          </div>

          {artist.genre && (
            <p className="text-sm text-white/50 uppercase tracking-wide">{artist.genre}</p>
          )}

          {artist.description && (
            <div>
              <RichText content={artist.description} />
            </div>
          )}

          {artist.place && (
            <div>
              <h3 className="text-sm text-white/50 uppercase tracking-wide mb-1">{t.place}</h3>
              <p>{artist.place}</p>
            </div>
          )}

          {dates.length > 0 && (
            <div>
              <h3 className="text-sm text-white/50 uppercase tracking-wide mb-2">{t.dates}</h3>
              <ul className="space-y-1">
                {dates.map((d) => (
                  <li key={d.id} className="text-sm">
                    {d.dateText || formatDateRange(d.start, d.end)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {artist.paid && (
            <p className="text-sm text-yellow-400">{t.paidEntry}</p>
          )}

          {records.length > 0 && (
            <div>
              <h3 className="text-sm text-white/50 uppercase tracking-wide mb-2">{t.audio}</h3>
              <ul className="space-y-2">
                {records.map((r) => (
                  <li key={r.id} className="text-sm">
                    <span className="text-white/70">{r.title}</span>
                    {r.file && typeof r.file === 'object' && (r.file.filename || r.file.url) && (
                      <audio controls className="mt-1 w-full h-8" preload="none">
                        <source src={r.file.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${r.file.filename}` : r.file.url!} />
                      </audio>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
  if (!start) return ''
  const s = new Date(start)
  const dateStr = s.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' })
  const timeStr = s.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
  if (end) {
    const e = new Date(end)
    const endTime = e.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
    return `${dateStr}, ${timeStr} – ${endTime}`
  }
  return `${dateStr}, ${timeStr}`
}
