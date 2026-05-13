import { getPayloadClient } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kontakt' }

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const contacts = await payload.find({
    collection: 'contacts',
    sort: 'orderRank',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kontakt</h1>

      {contacts.docs.length === 0 ? (
        <p className="text-white/40">Žiadne kontakty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contacts.docs.map((contact) => (
            <div key={contact.id} className="border border-white/10 rounded p-4 space-y-3">
              {contact.photo && typeof contact.photo === 'object' && contact.photo.url ? (
                <img
                  src={contact.photo.url}
                  alt={contact.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                  <span className="text-white/30 text-xl">{contact.name.charAt(0)}</span>
                </div>
              )}
              <div className="text-center">
                <p className="font-medium">{contact.name}</p>
                {contact.role && <p className="text-sm text-white/50">{contact.role}</p>}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-sm text-[#8ebc35] hover:underline">
                    {contact.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
