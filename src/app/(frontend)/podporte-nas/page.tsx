import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Podporte nás' }

export default async function SupportUsPage() {
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'support-us' })

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Podporte nás</h1>
      <RichText content={data.content} />
    </div>
  )
}
