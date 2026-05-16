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
  return (
    <div className="min-h-screen flex flex-col">
      {bannerUrl && (
        <div className="relative w-full h-[40vh] sm:h-[50vh]">
          <Image
            src={bannerUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <section className={`flex flex-col items-center justify-center px-6 text-center ${bannerUrl ? 'py-12' : 'flex-1 py-20'}`}>
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-4">
          {heading || 'BIELA NOC'}
        </h1>
        {richText ? (
          <div className="max-w-2xl">
            <RichText content={richText} />
          </div>
        ) : (
          <p className="text-white/60 text-lg max-w-md">
            {locale === 'en'
              ? 'Contemporary art festival in Bratislava and Košice'
              : 'Festival súčasného umenia v Bratislave a Košiciach'}
          </p>
        )}
      </section>

      <ArticleCarousel
        articles={articles}
        heading={locale === 'en' ? 'Articles' : 'Články'}
      />
    </div>
  )
}
