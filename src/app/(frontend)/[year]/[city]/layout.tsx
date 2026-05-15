import React from 'react'
import { getPayloadClient } from '@/lib/payload'

type Props = {
  children: React.ReactNode
  params: Promise<{ year: string; city: string }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const artists = await payload.find({ collection: 'artists', limit: 0, depth: 0 })
  const combos = new Set(
    artists.docs.map((a) => `${(a as unknown as { year: string }).year}|${(a as unknown as { city: string }).city}`)
  )
  return [...combos].map((c) => {
    const [year, city] = c.split('|')
    return { year: `y${year}`, city }
  })
}

export const revalidate = 3600

export default async function CityYearLayout({ children }: Props) {
  return <>{children}</>
}
