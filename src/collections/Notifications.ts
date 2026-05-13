import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
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
