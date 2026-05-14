import { describe, it, expect } from 'vitest'
import { UI_STRINGS, DEFAULT_LOCALE } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

describe('i18n', () => {
  it('has sk as default locale', () => {
    expect(DEFAULT_LOCALE).toBe('sk')
  })

  it('has both sk and en locales defined', () => {
    expect(UI_STRINGS).toHaveProperty('sk')
    expect(UI_STRINGS).toHaveProperty('en')
  })

  it('sk and en have the same keys', () => {
    const skKeys = Object.keys(UI_STRINGS.sk).sort()
    const enKeys = Object.keys(UI_STRINGS.en).sort()
    expect(skKeys).toEqual(enKeys)
  })

  it('no empty string values in sk', () => {
    for (const [key, value] of Object.entries(UI_STRINGS.sk)) {
      expect(value, `sk.${key} should not be empty`).not.toBe('')
    }
  })

  it('no empty string values in en', () => {
    for (const [key, value] of Object.entries(UI_STRINGS.en)) {
      expect(value, `en.${key} should not be empty`).not.toBe('')
    }
  })
})
