'use client'

import Link from 'next/link'
import Image from 'next/image'

type Article = {
  id: string
  title: string
  excerpt: string
  coverImage?: string | null
  createdAt: string
}

type Props = {
  articles: Article[]
  heading: string
}

export function ArticleCarousel({ articles, heading }: Props) {
  if (articles.length === 0) return null

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6 px-6">{heading}</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="snap-start shrink-0 w-72 sm:w-80 bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#8ebc35]/50 transition-colors group"
          >
            {article.coverImage && (
              <div className="relative w-full h-40">
                <Image
                  src={article.coverImage}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <time className="text-xs text-white/40 block mb-2">
                {new Date(article.createdAt).toLocaleDateString('sk-SK')}
              </time>
              <h3 className="text-sm font-medium text-white group-hover:text-[#8ebc35] transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-white/50 mt-2 line-clamp-3">{article.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
