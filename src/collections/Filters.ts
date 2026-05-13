import type { CollectionConfig } from 'payload'

export const Filters: CollectionConfig = {
  slug: 'filters',
  admin: {
    useAsTitle: 'title',
    group: 'Config',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: { description: 'Hex color code (e.g. #FF5555)' },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
