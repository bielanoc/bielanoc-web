import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@/components/RichText'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const article = await payload.findByID({ collection: 'articles', id, locale }).catch(() => null)
  if (!article) return { title: 'Article' }
  return { title: article.title }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const locale = await getLocale()
  const payload = await getPayloadClient()

  const article = await payload.findByID({
    collection: 'articles',
    id,
    locale,
  }).catch(() => null)

  if (!article) notFound()

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors mb-6 inline-block">
        ← Domov
      </Link>

      <article>
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-sm text-white/40 mb-8">
          {new Date(article.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'sk-SK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <RichText content={article.content} />
      </article>
    </div>
  )
}
