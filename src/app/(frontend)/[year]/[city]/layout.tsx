import React from 'react'

type Props = {
  children: React.ReactNode
  params: Promise<{ year: string; city: string }>
}

export default async function CityYearLayout({ children }: Props) {
  return <>{children}</>
}
