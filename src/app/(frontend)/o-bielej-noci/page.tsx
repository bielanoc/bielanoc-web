import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'O Bielej Noci' }

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'about-page' })

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">O Bielej Noci</h1>
      <RichText content={data.content} />
    </div>
  )
}
