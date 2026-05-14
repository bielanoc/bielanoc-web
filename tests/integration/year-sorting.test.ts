import { describe, it, expect } from 'vitest'

function deriveAvailableYears(artists: { year: string }[]): string[] {
  const years = [...new Set(artists.map((a) => a.year).filter(Boolean))]
  return years.sort((a, b) => Number(b) - Number(a))
}

describe('Available years derivation', () => {
  it('returns unique years sorted newest first', () => {
    const artists = [
      { year: '2023' },
      { year: '2025' },
      { year: '2024' },
      { year: '2025' },
      { year: '2023' },
    ]
    expect(deriveAvailableYears(artists)).toEqual(['2025', '2024', '2023'])
  })

  it('newest year is always first (default)', () => {
    const artists = [
      { year: '2020' },
      { year: '2026' },
      { year: '2024' },
    ]
    const years = deriveAvailableYears(artists)
    expect(years[0]).toBe('2026')
  })

  it('handles single year', () => {
    const artists = [{ year: '2025' }, { year: '2025' }]
    expect(deriveAvailableYears(artists)).toEqual(['2025'])
  })

  it('handles empty array', () => {
    expect(deriveAvailableYears([])).toEqual([])
  })

  it('filters out falsy year values', () => {
    const artists = [
      { year: '2025' },
      { year: '' },
      { year: '2024' },
    ] as any
    expect(deriveAvailableYears(artists)).toEqual(['2025', '2024'])
  })
})
