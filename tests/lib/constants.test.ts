import { describe, it, expect } from 'vitest'
import { CITIES, PARTNER_CATEGORIES } from '@/lib/constants'

describe('constants', () => {
  describe('CITIES', () => {
    it('has ba and ke entries', () => {
      expect(CITIES.ba).toBeDefined()
      expect(CITIES.ke).toBeDefined()
    })

    it('ba is Bratislava', () => {
      expect(CITIES.ba.label).toBe('Bratislava')
      expect(CITIES.ba.labelShort).toBe('BA')
    })

    it('ke is Košice', () => {
      expect(CITIES.ke.label).toBe('Košice')
      expect(CITIES.ke.labelShort).toBe('KE')
    })
  })

  describe('PARTNER_CATEGORIES', () => {
    it('has at least 5 categories', () => {
      expect(PARTNER_CATEGORIES.length).toBeGreaterThanOrEqual(5)
    })

    it('each category has value and label', () => {
      for (const cat of PARTNER_CATEGORIES) {
        expect(cat.value).toBeTruthy()
        expect(cat.label).toBeTruthy()
      }
    })

    it('has no duplicate values', () => {
      const values = PARTNER_CATEGORIES.map((c) => c.value)
      expect(new Set(values).size).toBe(values.length)
    })

    it('general is first category', () => {
      expect(PARTNER_CATEGORIES[0].value).toBe('general')
    })
  })
})
