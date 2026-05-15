import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const NavigationSettings: GlobalConfig = {
  slug: 'navigation-settings',
  admin: {
    group: 'Appearance',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'menuItems',
      type: 'array',
      admin: { description: 'Navigation menu links. Drag to reorder.' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: { description: 'Display text for the link.' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Path (e.g. /umelci, /mapa). If "Use year/city prefix" is on, the current year/city is prepended.' },
        },
        {
          name: 'useYearCity',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Prepend /{year}/{city} to the URL automatically.' },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Search', value: 'search' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'dividerAfter',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show a separator line after this item.' },
        },
      ],
    },
    {
      name: 'socialInstagram',
      type: 'text',
      admin: { description: 'Instagram profile URL' },
    },
    {
      name: 'socialFacebook',
      type: 'text',
      admin: { description: 'Facebook page URL' },
    },
  ],
}
