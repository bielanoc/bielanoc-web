'use client'

import { useState, useEffect } from 'react'

type Artist = {
  id: number
  name: string
  city: string
  hasDates: boolean
  timeMatches: { match: string; context: string }[]
  adminUrl: string
}

const TIME_PATTERNS = [
  /\d{1,2}[.:]\d{2}\s*[-–]\s*\d{1,2}[.:]\d{2}/g,
  /(?:od?|do)\s+\d{1,2}[.:]\d{2}\s*h?o?d?\.?/gi,
  /[Čč]as:\s*\d{1,2}[.:]\d{2}/g,
  /[Zz]ačiatok[^.]*?\d{1,2}[.:]\d{2}\s*h?o?d?\.?/g,
  /\b\d{1,2}[.:]\d{2}\s*h(?:od)?\.?/g,
  /\d{1,2}\.?\s*[-–]?\s*(?:\d{1,2}\.)?\s*\d{1,2}\.\s*2025/g,
  /(?:Piatok|Sobota|Nedeľa|Pondelok|Utorok|Streda|Štvrtok)[,\s]+\d{1,2}\.\s*\d{1,2}\.\s*2025/gi,
  /[Pp]osledný\s+vstup\s+\d{1,2}[.:]\d{2}/g,
]

function findTimeInfo(text: string): { match: string; context: string }[] {
  const results: { match: string; context: string }[] = []
  const seen = new Set<string>()

  for (const pattern of TIME_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags)
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      const key = `${m.index}:${m[0]}`
      if (seen.has(key)) continue
      seen.add(key)
      const start = Math.max(0, m.index - 30)
      const end = Math.min(text.length, m.index + m[0].length + 30)
      results.push({
        match: m[0],
        context: text.substring(start, end),
      })
    }
  }
  return results
}

function extractText(description: unknown): string {
  const desc = description as { root?: { children?: { children?: { text?: string }[] }[] } }
  if (!desc?.root?.children) return ''
  return desc.root.children
    .map((p) => (p.children || []).map((c) => c.text || '').join(''))
    .join(' ')
}

export function DateReviewView() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'with-times' | 'no-times' | 'has-dates'>('all')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/artists?where[year][equals]=2025&limit=200&depth=1&locale=sk')
        const data = await res.json()

        const processed: Artist[] = data.docs.map((a: Record<string, unknown>) => {
          const hasDates = Array.isArray(a.dates) && a.dates.length > 0
          const text = extractText(a.description)
          const timeMatches = hasDates ? [] : findTimeInfo(text)

          return {
            id: a.id as number,
            name: a.name as string,
            city: a.city as string,
            hasDates,
            timeMatches,
            adminUrl: `/admin/collections/artists/${a.id}`,
          }
        })

        setArtists(processed)
      } catch (err) {
        console.error('Failed to load artists:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = artists.filter((a) => {
    if (filter === 'has-dates') return a.hasDates
    if (filter === 'with-times') return !a.hasDates && a.timeMatches.length > 0
    if (filter === 'no-times') return !a.hasDates && a.timeMatches.length === 0
    return true
  })

  const withDates = artists.filter((a) => a.hasDates).length
  const withTimes = artists.filter((a) => !a.hasDates && a.timeMatches.length > 0).length
  const noInfo = artists.filter((a) => !a.hasDates && a.timeMatches.length === 0).length

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        2025 Date Review
      </h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Review artists missing date entries. Artists with time info in descriptions can be updated manually.
      </p>

      {loading ? (
        <p>Loading artists...</p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <StatCard
              label="Have DateEntry"
              count={withDates}
              color="#22c55e"
              active={filter === 'has-dates'}
              onClick={() => setFilter(filter === 'has-dates' ? 'all' : 'has-dates')}
            />
            <StatCard
              label="Time in description"
              count={withTimes}
              color="#f59e0b"
              active={filter === 'with-times'}
              onClick={() => setFilter(filter === 'with-times' ? 'all' : 'with-times')}
            />
            <StatCard
              label="No time info"
              count={noInfo}
              color="#ef4444"
              active={filter === 'no-times'}
              onClick={() => setFilter(filter === 'no-times' ? 'all' : 'no-times')}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th style={{ padding: '0.5rem' }}>Artist</th>
                <th style={{ padding: '0.5rem' }}>City</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Time Info</th>
                <th style={{ padding: '0.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem', color: '#666' }}>{a.id}</td>
                  <td style={{ padding: '0.5rem', fontWeight: 500 }}>{a.name}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: a.city === 'ba' ? '#dbeafe' : '#fce7f3',
                      color: a.city === 'ba' ? '#1d4ed8' : '#be185d',
                    }}>
                      {a.city.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {a.hasDates ? (
                      <span style={{ color: '#22c55e' }}>✓ Has dates</span>
                    ) : a.timeMatches.length > 0 ? (
                      <span style={{ color: '#f59e0b' }}>⏱ Time found</span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>✗ No info</span>
                    )}
                  </td>
                  <td style={{ padding: '0.5rem', maxWidth: '300px' }}>
                    {a.timeMatches.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {a.timeMatches.map((t, i) => (
                          <div key={i} style={{ marginBottom: '0.25rem' }}>
                            <strong>{t.match}</strong>
                            <span style={{ color: '#999' }}> — ...{t.context}...</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <a
                      href={a.adminUrl}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        color: '#374151',
                      }}
                    >
                      Edit →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
