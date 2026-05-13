import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bielanoc.sk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const settings = await payload.findGlobal({ slug: 'festival-settings' })
  const currentYear = settings.currentYear || '2025'

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/o-bielej-noci`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/podporte-nas`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/press`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/archive`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/app`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const cities = ['ba', 'ke'] as const
  const cityPages: MetadataRoute.Sitemap = cities.flatMap((city) => [
    { url: `${BASE_URL}/y${currentYear}/${city}/umelci`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/y${currentYear}/${city}/mapa`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/y${currentYear}/${city}/partneri`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/y${currentYear}/${city}/predaj`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/y${currentYear}/${city}/info`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/y${currentYear}/${city}/dobrovolnici`, changeFrequency: 'monthly' as const, priority: 0.4 },
  ])

  const artists = await payload.find({
    collection: 'artists',
    where: { year: { equals: currentYear } },
    limit: 500,
    depth: 0,
  })

  const artistPages: MetadataRoute.Sitemap = artists.docs.map((artist) => ({
    url: `${BASE_URL}/y${currentYear}/${artist.city}/umelci/${artist.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const articles = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    limit: 100,
    depth: 0,
  })

  const articlePages: MetadataRoute.Sitemap = articles.docs.map((article) => ({
    url: `${BASE_URL}/articles/${article.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    lastModified: article.updatedAt,
  }))

  return [...staticPages, ...cityPages, ...artistPages, ...articlePages]
}
