import type { CollectionConfig } from 'payload'

export const DateEntries: CollectionConfig = {
  slug: 'date-entries',
  admin: {
    useAsTitle: 'dateText',
    group: 'Content',
  },
  fields: [
    {
      name: 'dateText',
      type: 'text',
      admin: { description: 'Human-readable date label' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'start',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'end',
          type: 'date',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },
    {
      name: 'display',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
