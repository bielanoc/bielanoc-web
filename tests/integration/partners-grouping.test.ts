import { describe, it, expect } from 'vitest'
import { PARTNER_CATEGORIES } from '@/lib/constants'

function groupPartners(partners: any[]) {
  return PARTNER_CATEGORIES.map((cat) => ({
    ...cat,
    partners: partners.filter((p) => p.category === cat.value),
  })).filter((g) => g.partners.length > 0)
}

describe('Partner grouping logic', () => {
  const partners = [
    { id: 1, name: 'General Corp', category: 'general' },
    { id: 2, name: 'Main Inc', category: 'main' },
    { id: 3, name: 'Partner A', category: 'partner' },
    { id: 4, name: 'Partner B', category: 'partner' },
    { id: 5, name: 'Media One', category: 'main-media' },
  ]

  it('groups partners by category', () => {
    const grouped = groupPartners(partners)
    expect(grouped).toHaveLength(4)
  })

  it('preserves category order from PARTNER_CATEGORIES', () => {
    const grouped = groupPartners(partners)
    const order = grouped.map((g) => g.value)
    expect(order).toEqual(['general', 'main', 'partner', 'main-media'])
  })

  it('puts multiple partners in the same group', () => {
    const grouped = groupPartners(partners)
    const partnerGroup = grouped.find((g) => g.value === 'partner')
    expect(partnerGroup?.partners).toHaveLength(2)
  })

  it('excludes empty categories', () => {
    const grouped = groupPartners(partners)
    const values = grouped.map((g) => g.value)
    expect(values).not.toContain('support')
    expect(values).not.toContain('it')
  })

  it('returns empty array for no partners', () => {
    const grouped = groupPartners([])
    expect(grouped).toHaveLength(0)
  })
})
