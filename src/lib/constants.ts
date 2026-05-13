export const CITIES = {
  ba: { label: 'Bratislava', labelShort: 'BA' },
  ke: { label: 'Košice', labelShort: 'KE' },
} as const

export type CityCode = keyof typeof CITIES

export const DEFAULT_YEAR = 'y2025'
export const DEFAULT_CITY: CityCode = 'ba'

export const PARTNER_CATEGORIES = [
  { value: 'general', label: 'Generálny partner' },
  { value: 'main', label: 'Hlavný partner' },
  { value: 'partner', label: 'Partner' },
  { value: 'official', label: 'Oficiálny partner' },
  { value: 'support', label: 'Podpora' },
  { value: 'regional', label: 'Regionálny partner' },
  { value: 'it', label: 'IT Partner' },
  { value: 'delivery', label: 'Delivery partner' },
  { value: 'main-media', label: 'Hlavný mediálny partner' },
  { value: 'other-media', label: 'Mediálny partner' },
  { value: 'appreciation', label: 'Appreciation' },
] as const
