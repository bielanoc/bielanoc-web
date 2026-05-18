import { getPayloadClient } from '@/lib/payload'
import { getMediaSrc } from '@/lib/media'
import { getLocale, UI_STRINGS } from '@/lib/locale'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].press }
}

export default async function PressPage() {
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'press-kit' })

  const archive = typeof data.archive === 'object' ? data.archive : null

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.press}</h1>

      <div className="border border-white/10 rounded p-8 text-center space-y-4">
        <p className="text-white/70">
          {locale === 'en'
            ? 'Download the complete press kit with logos, photos and other materials.'
            : 'Stiahnite si kompletný press kit s logami, fotkami a ďalšími materiálmi.'}
        </p>
        {getMediaSrc(archive) ? (
          <a
            href={getMediaSrc(archive)!}
            download
            className="inline-block px-8 py-3 bg-accent text-black font-medium hover:bg-accent-hover transition-colors"
          >
            {locale === 'en' ? 'Download press kit (ZIP)' : 'Stiahnuť press kit (ZIP)'}
          </a>
        ) : (
          <p className="text-white/40">
            {locale === 'en' ? 'Press kit is not currently available.' : 'Press kit nie je momentálne dostupný.'}
          </p>
        )}
      </div>
    </div>
  )
}
