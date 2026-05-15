import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const Volunteers: GlobalConfig = {
  slug: 'volunteers',
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'contentBA',
      type: 'richText',
      label: 'Content — Bratislava',
      localized: true,
    },
    {
      name: 'contentKE',
      type: 'richText',
      label: 'Content — Košice',
      localized: true,
    },
  ],
}
