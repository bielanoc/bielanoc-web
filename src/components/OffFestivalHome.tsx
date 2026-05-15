import { ArticleCarousel } from './ArticleCarousel'

type Article = {
  id: string
  title: string
  excerpt: string
  createdAt: string
}

type Props = {
  articles: Article[]
  locale: string
}

export function OffFestivalHome({ articles, locale }: Props) {
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
