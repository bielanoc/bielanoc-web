import { getPayloadClient } from '@/lib/payload'
import { getLocale, UI_STRINGS } from '@/lib/locale'
import Image from 'next/image'

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: UI_STRINGS[locale].contact }
}

export default async function ContactPage() {
  const locale = await getLocale()
  const t = UI_STRINGS[locale]
  const payload = await getPayloadClient()
  const contacts = await payload.find({
    collection: 'contacts',
    sort: 'orderRank',
    limit: 50,
    depth: 1,
    locale,
  })

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.contact}</h1>

      {contacts.docs.length === 0 ? (
        <p className="text-white/40">Žiadne kontakty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contacts.docs.map((contact) => (
            <div key={contact.id} className="border border-white/10 rounded p-4 space-y-3">
              {contact.photo && typeof contact.photo === 'object' && (contact.photo.filename || contact.photo.url) ? (
                <Image
                  src={contact.photo.filename ? `${process.env.NEXT_PUBLIC_S3_URL}/${contact.photo.filename}` : contact.photo.url!}
                  alt={contact.name}
                  width={80}
                  height={80}
                  sizes="80px"
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
                  <a href={`mailto:${contact.email}`} className="text-sm text-accent hover:underline">
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
