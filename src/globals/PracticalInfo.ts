import type { GlobalConfig } from 'payload'

export const PracticalInfo: GlobalConfig = {
  slug: 'practical-info',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'sectionsBA',
      type: 'array',
      label: 'Sections — Bratislava',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'sectionsKE',
      type: 'array',
      label: 'Sections — Košice',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
