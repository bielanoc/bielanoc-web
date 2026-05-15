import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const FestivalSettings: GlobalConfig = {
  slug: 'festival-settings',
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'currentYear',
      type: 'select',
      required: true,
      defaultValue: '2025',
      options: [
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' },
        { label: '2026', value: '2026' },
        { label: '2027', value: '2027' },
        { label: '2028', value: '2028' },
        { label: '2029', value: '2029' },
        { label: '2030', value: '2030' },
      ],
    },
    {
      name: 'dateInfoBA',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "3. – 5. október 2025 Bratislava"' },
    },
    {
      name: 'dateInfoKE',
      type: 'text',
      localized: true,
      admin: { description: 'e.g. "10. – 12. október 2025 Košice"' },
    },
    {
      name: 'socialInstagram',
      type: 'text',
    },
    {
      name: 'socialFacebook',
      type: 'text',
    },
    {
      name: 'festivalActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'When enabled, shows festival mode (artists/map/program). When off, shows off-festival landing page.' },
    },
    {
      name: 'debugMode',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Enable debug time override on frontend (shows time picker bar)' },
    },
    {
      name: 'debugTime',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Simulated current time (only used when debug mode is on)',
        condition: (data) => data?.debugMode === true,
      },
    },
  ],
}
