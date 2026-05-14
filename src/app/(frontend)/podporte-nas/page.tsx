import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { getLocale, UI_STRINGS } from '@/lib/locale'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].support }
}

export default async function SupportUsPage() {
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'support-us', locale })

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.support}</h1>
      <RichText content={data.content} />
    </div>
  )
}
