import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-4xl font-bold tracking-tight">Biela Noc</h1>
      <p className="text-lg text-gray-400">Festival súčasného umenia</p>
      <div className="flex gap-6">
        <Link
          href="/y2025/ba/umelci"
          className="px-6 py-3 border border-white/20 hover:border-white/60 transition-colors"
        >
          Bratislava
        </Link>
        <Link
          href="/y2025/ke/umelci"
          className="px-6 py-3 border border-white/20 hover:border-white/60 transition-colors"
        >
          Košice
        </Link>
      </div>
    </main>
  )
}
