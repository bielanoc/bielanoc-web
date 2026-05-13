type Props = {
  params: Promise<{ year: string; city: string }>
}

export default async function ArtistsPage({ params }: Props) {
  const { year, city } = await params

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Umelci — {city.toUpperCase()} {year.replace('y', '')}
      </h1>
      <p className="text-gray-400">Artist grid will be implemented here.</p>
    </div>
  )
}
