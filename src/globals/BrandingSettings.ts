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
          defaultValue: '#ff6b4a',
          admin: {
            description: 'Primary accent color (hex). Used for CTAs, highlights, active states.',
            components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
          },
        },
        {
          name: 'bratislavaBackground',
          type: 'text',
          defaultValue: '#8094F7',
          admin: {
            description: 'Bratislava section background color (homepage).',
            components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
          },
        },
        {
          name: 'kosiceBackground',
          type: 'text',
          defaultValue: '#B2BCAC',
          admin: {
            description: 'Košice section background color (homepage).',
            components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
          },
        },
        {
          name: 'menuGradient',
          type: 'text',
          defaultValue: '#0500FF',
          admin: {
            description: 'Side menu gradient top color. Bottom is always black.',
            components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'homepage',
      fields: [
        {
          name: 'imageBA',
          label: 'Bratislava — Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Main homepage image for Bratislava section. Also used as the poster/fallback when a video is set.' },
        },
        {
          name: 'imageBAHover',
          label: 'Bratislava — Hover Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image shown on hover for Bratislava section (ignored when a video is set).' },
        },
        {
          name: 'videoBA',
          label: 'Bratislava — Video',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional looping background video (MP4/WebM). Takes precedence over the image. Should be muted; audio is not played.' },
        },
        {
          name: 'imageKE',
          label: 'Košice — Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Main homepage image for Košice section. Also used as the poster/fallback when a video is set.' },
        },
        {
          name: 'imageKEHover',
          label: 'Košice — Hover Image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image shown on hover for Košice section (ignored when a video is set).' },
        },
        {
          name: 'videoKE',
          label: 'Košice — Video',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional looping background video (MP4/WebM). Takes precedence over the image. Should be muted; audio is not played.' },
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
              admin: {
                description: 'Hex color (e.g. #F5E455)',
                components: { Field: '@/components/admin/ColorPicker#ColorPicker' },
              },
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
      name: 'offSeason',
      label: 'Off-Season Homepage',
      fields: [
        {
          name: 'banner',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero banner image shown on the off-season homepage.' },
        },
        {
          name: 'heading',
          type: 'text',
          localized: true,
          admin: { description: 'Main heading. Falls back to "BIELA NOC" if empty.' },
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
          admin: { description: 'Announcement or description text below the heading.' },
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
