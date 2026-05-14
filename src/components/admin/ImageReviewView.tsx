'use client'

import { useState, useEffect } from 'react'

type MediaItem = {
  id: number
  filename: string
  url: string
}

type Artist = {
  id: number
  name: string
  city: string
  year: string
  work: string | null
  hasImage: boolean
  currentImage: string | null
  adminUrl: string
}

type Suggestion = {
  artistId: number
  media: MediaItem[]
}

export function ImageReviewView() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [suggestions, setSuggestions] = useState<Record<number, MediaItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [linking, setLinking] = useState<number | null>(null)
  const [filter, setFilter] = useState<'missing' | 'all'>('missing')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/artists?limit=500&depth=1&sort=year')
      const data = await res.json()

      const processed: Artist[] = data.docs.map((a: Record<string, unknown>) => {
        const image = a.image as Record<string, unknown> | null
        const hasImage = !!(image && (image.filename || image.url))
        const currentImage = image?.filename
          ? `/api/media/file/${image.filename}`
          : (image?.url as string) || null

        return {
          id: a.id as number,
          name: a.name as string,
          city: a.city as string,
          year: a.year as string,
          work: (a.work as string) || null,
          hasImage,
          currentImage,
          adminUrl: `/admin/collections/artists/${a.id}`,
        }
      })

      setArtists(processed)

      const missing = processed.filter((a) => !a.hasImage)
      if (missing.length > 0) {
        await loadSuggestions(missing)
      }
    } catch (err) {
      console.error('Failed to load artists:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadSuggestions(missingArtists: Artist[]) {
    const newSuggestions: Record<number, MediaItem[]> = {}

    for (const artist of missingArtists) {
      const keywords = artist.name
        .replace(/[&,]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 3)

      const searchResults: MediaItem[] = []
      const seen = new Set<number>()

      for (const keyword of keywords) {
        try {
          const res = await fetch(
            `/api/media?where[filename][contains]=${encodeURIComponent(keyword)}&limit=10`
          )
          const data = await res.json()
          for (const doc of data.docs) {
            if (!seen.has(doc.id) && doc.mimeType?.startsWith('image/')) {
              seen.add(doc.id)
              searchResults.push({
                id: doc.id,
                filename: doc.filename,
                url: `/api/media/file/${doc.filename}`,
              })
            }
          }
        } catch {
          // skip
        }
      }

      if (artist.work) {
        const workKeywords = artist.work
          .replace(/[&,]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 3)
          .slice(0, 2)
        for (const keyword of workKeywords) {
          try {
            const res = await fetch(
              `/api/media?where[filename][contains]=${encodeURIComponent(keyword)}&limit=5`
            )
            const data = await res.json()
            for (const doc of data.docs) {
              if (!seen.has(doc.id) && doc.mimeType?.startsWith('image/')) {
                seen.add(doc.id)
                searchResults.push({
                  id: doc.id,
                  filename: doc.filename,
                  url: `/api/media/file/${doc.filename}`,
                })
              }
            }
          } catch {
            // skip
          }
        }
      }

      newSuggestions[artist.id] = searchResults.slice(0, 8)
    }

    setSuggestions(newSuggestions)
  }

  async function linkImage(artistId: number, mediaId: number) {
    setLinking(artistId)
    setMessage(null)
    try {
      const res = await fetch(`/api/artists/${artistId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: mediaId }),
      })
      if (res.ok) {
        setArtists((prev) =>
          prev.map((a) =>
            a.id === artistId ? { ...a, hasImage: true } : a
          )
        )
        setMessage(`Linked image to artist #${artistId}`)
      } else {
        const err = await res.json()
        setMessage(`Error: ${err.errors?.[0]?.message || 'Failed to link'}`)
      }
    } catch (err) {
      setMessage(`Error: ${err}`)
    } finally {
      setLinking(null)
    }
  }

  const years = [...new Set(artists.map((a) => a.year))].sort().reverse()

  const filtered = artists.filter((a) => {
    if (filter === 'missing' && a.hasImage) return false
    if (yearFilter !== 'all' && a.year !== yearFilter) return false
    if (cityFilter !== 'all' && a.city !== cityFilter) return false
    return true
  })

  const totalMissing = artists.filter((a) => !a.hasImage).length
  const totalWithImage = artists.filter((a) => a.hasImage).length

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Image Review
      </h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Artists missing images. Click a suggestion to link it, or edit the artist manually.
      </p>

      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '0.375rem',
          backgroundColor: message.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
          color: message.startsWith('Error') ? '#b91c1c' : '#15803d',
          fontSize: '0.875rem',
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading artists and searching for matching images...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <StatCard
              label="Have image"
              count={totalWithImage}
              color="#22c55e"
              active={filter === 'all'}
              onClick={() => setFilter(filter === 'all' ? 'missing' : 'all')}
            />
            <StatCard
              label="Missing image"
              count={totalMissing}
              color="#ef4444"
              active={filter === 'missing'}
              onClick={() => setFilter('missing')}
            />

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
              >
                <option value="all">All years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
              >
                <option value="all">All cities</option>
                <option value="ba">BA</option>
                <option value="ke">KE</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.length === 0 && (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                {filter === 'missing' ? 'All artists have images!' : 'No artists match the filter.'}
              </p>
            )}

            {filtered.map((artist) => (
              <div
                key={artist.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  backgroundColor: artist.hasImage ? '#f9fafb' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{artist.name}</span>
                    {artist.work && (
                      <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.8125rem' }}>
                        — {artist.work}
                      </span>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: artist.city === 'ba' ? '#dbeafe' : '#fce7f3',
                        color: artist.city === 'ba' ? '#1d4ed8' : '#be185d',
                      }}>
                        {artist.city.toUpperCase()}
                      </span>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                      }}>
                        {artist.year}
                      </span>
                      {artist.hasImage && (
                        <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>✓ Has image</span>
                      )}
                    </div>
                  </div>
                  <a
                    href={artist.adminUrl}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                      color: '#374151',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Edit →
                  </a>
                </div>

                {!artist.hasImage && suggestions[artist.id] && suggestions[artist.id].length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Suggested images ({suggestions[artist.id].length}):
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {suggestions[artist.id].map((media) => (
                        <button
                          key={media.id}
                          onClick={() => linkImage(artist.id, media.id)}
                          disabled={linking === artist.id}
                          style={{
                            border: '2px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            padding: '0.25rem',
                            cursor: linking === artist.id ? 'wait' : 'pointer',
                            backgroundColor: 'white',
                            transition: 'border-color 0.15s',
                            position: 'relative',
                          }}
                          title={media.filename}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                        >
                          <img
                            src={media.url}
                            alt={media.filename}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.25rem' }}
                          />
                          <div style={{
                            fontSize: '0.5625rem',
                            color: '#666',
                            maxWidth: '80px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginTop: '0.125rem',
                          }}>
                            {media.filename}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!artist.hasImage && suggestions[artist.id] && suggestions[artist.id].length === 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#999' }}>
                    No matching images found — upload one or link manually via Edit.
                  </div>
                )}
              </div>
            ))}
          </div>

          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.8rem' }}>
            Showing {filtered.length} of {artists.length} artists
          </p>
        </>
      )}
    </div>
  )
}

function StatCard({ label, count, color, active, onClick }: {
  label: string
  count: number
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: active ? `2px solid ${color}` : '2px solid #e5e7eb',
        backgroundColor: active ? `${color}11` : 'white',
        cursor: 'pointer',
        textAlign: 'left',
        minWidth: '140px',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>{count}</div>
      <div style={{ fontSize: '0.75rem', color: '#666' }}>{label}</div>
    </button>
  )
}
