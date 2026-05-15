import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const BrandingSettings: GlobalConfig = {
  slug: 'branding-settings',
  admin: {
    group: 'Appearance',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      type: 'group',
      name: 'logo',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Site logo (SVG or PNG). Falls back to default if empty.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'colors',
      fields: [
        {
          name: 'accent',
          type: 'text',
          defaultValue: '#8ebc35',
          admin: { description: 'Primary accent color (hex). Used for CTAs, highlights, active states.' },
        },
        {
          name: 'bratislavaBackground',
          type: 'text',
          defaultValue: '#8094F7',
          admin: { description: 'Bratislava section background color (homepage).' },
        },
        {
          name: 'kosiceBackground',
          type: 'text',
          defaultValue: '#B2BCAC',
          admin: { description: 'Košice section background color (homepage).' },
        },
        {
          name: 'menuGradient',
          type: 'text',
          defaultValue: '#0500FF',
          admin: { description: 'Side menu gradient top color. Bottom is always black.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'homepage',
      fields: [
        {
          name: 'imageBA',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Bratislava main homepage image.' },
        },
        {
          name: 'imageBAHover',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Bratislava hover image.' },
        },
        {
          name: 'imageKE',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Košice main homepage image.' },
        },
        {
          name: 'imageKEHover',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Košice hover image.' },
        },
      ],
    },
    {
      type: 'group',
      name: 'stars',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show decorative star dots in background.' },
        },
        {
          name: 'colors',
          type: 'array',
          admin: { description: 'Colors for star dots. Each color produces 3 dots.' },
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              admin: { description: 'Hex color (e.g. #F5E455)' },
            },
          ],
          defaultValue: [
            { color: '#F5E455' },
            { color: '#FF5555' },
            { color: '#FF2AC4' },
            { color: '#5555FF' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'footer',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          admin: { description: 'Footer copyright text. Falls back to "© {year} Biela Noc".' },
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
