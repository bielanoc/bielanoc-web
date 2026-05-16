import Image from 'next/image'
import { ArticleCarousel } from './ArticleCarousel'
import { RichText } from './RichText'

type Article = {
  id: string
  title: string
  excerpt: string
  coverImage?: string | null
  createdAt: string
}

type Props = {
  articles: Article[]
  locale: string
  bannerUrl?: string | null
  heading?: string | null
  richText?: unknown
}

export function OffFestivalHome({ articles, locale, bannerUrl, heading, richText }: Props) {
  const hasText = richText || heading

  if (bannerUrl) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10">
          <Image
            src={bannerUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative flex flex-col min-h-screen">
          <div className="flex-1" />

          {hasText && (
            <section className="flex flex-col items-center justify-center px-6 text-center py-8">
              {heading && (
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4 drop-shadow-lg">
                  {heading}
                </h1>
              )}
              {richText ? (
                <div className="max-w-2xl drop-shadow-lg">
                  <RichText content={richText} />
                </div>
              ) : null}
            </section>
          )}

          <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-16 pb-8">
            <ArticleCarousel
              articles={articles}
              heading={locale === 'en' ? 'Articles' : 'Články'}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4">BIELA NOC</h1>
        <p className="text-white/60 text-lg max-w-md">
          {locale === 'en'
            ? 'Contemporary art festival in Bratislava and Košice'
            : 'Festival súčasného umenia v Bratislave a Košiciach'}
        </p>
      </section>
      <ArticleCarousel
        articles={articles}
        heading={locale === 'en' ? 'Articles' : 'Články'}
      />
    </div>
  )
}
