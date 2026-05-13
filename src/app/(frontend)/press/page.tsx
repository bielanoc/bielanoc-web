import { getPayloadClient } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pre médiá' }

export default async function PressPage() {
  const payload = await getPayloadClient()
  const data = await payload.findGlobal({ slug: 'press-kit' })

  const archive = typeof data.archive === 'object' ? data.archive : null

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pre médiá</h1>

      <div className="border border-white/10 rounded p-8 text-center space-y-4">
        <p className="text-white/70">
          Stiahnite si kompletný press kit s logami, fotkami a ďalšími materiálmi.
        </p>
        {archive?.url ? (
          <a
            href={archive.url}
            download
            className="inline-block px-8 py-3 bg-[#8ebc35] text-black font-medium hover:bg-[#7aa82d] transition-colors"
          >
            Stiahnuť press kit (ZIP)
          </a>
        ) : (
          <p className="text-white/40">Press kit nie je momentálne dostupný.</p>
        )}
      </div>
    </div>
  )
}
