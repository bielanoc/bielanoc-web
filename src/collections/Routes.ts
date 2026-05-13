import type { CollectionConfig } from 'payload'

export const Routes: CollectionConfig = {
  slug: 'routes',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        { label: 'Bratislava', value: 'ba' },
        { label: 'Košice', value: 'ke' },
      ],
    },
  ],
}
