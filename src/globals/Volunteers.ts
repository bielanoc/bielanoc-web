import type { GlobalConfig } from 'payload'

export const Volunteers: GlobalConfig = {
  slug: 'volunteers',
  admin: {
    group: 'Settings',
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
