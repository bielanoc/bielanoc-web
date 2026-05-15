'use client'

import { useFavorites } from '@/lib/useFavorites'

type Props = {
  artistId: string
}

export function FavoriteButton({ artistId }: Props) {
  const { toggle, isFavorite } = useFavorites()
  const active = isFavorite(artistId)

  return (
    <button
      onClick={() => toggle(artistId)}
      className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`w-5 h-5 transition-colors ${active ? 'text-red-500 fill-red-500' : 'text-white/60 fill-none'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}
