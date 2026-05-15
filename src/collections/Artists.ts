import type { CollectionConfig } from 'payload'
import { revalidateArtistPages } from '@/lib/revalidate'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'year', 'paid'],
    group: 'Content',
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateArtistPages(doc.year, doc.city)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateArtistPages(doc.year, doc.city)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'work',
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'place',
      type: 'text',
      localized: true,
    },
    {
      name: 'locationPicker',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/LocationPicker#LocationPicker',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          admin: { width: '50%', description: 'Auto-filled from map' },
        },
        {
          name: 'longitude',
          type: 'number',
          admin: { width: '50%', description: 'Auto-filled from map' },
        },
      ],
    },
    {
      name: 'performance',
      type: 'text',
      localized: true,
    },
    {
      name: 'genre',
      type: 'text',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'select',
          required: true,
          options: [
            { label: '2020', value: '2020' },
            { label: '2021', value: '2021' },
            { label: '2022', value: '2022' },
            { label: '2023', value: '2023' },
            { label: '2024', value: '2024' },
            { label: '2025', value: '2025' },
            { label: '2026', value: '2026' },
            { label: '2027', value: '2027' },
            { label: '2028', value: '2028' },
            { label: '2029', value: '2029' },
            { label: '2030', value: '2030' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'city',
          type: 'select',
          required: true,
          options: [
            { label: 'Bratislava', value: 'ba' },
            { label: 'Košice', value: 'ke' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'hierarchy',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', description: 'Display order (lower = first)' },
        },
      ],
    },
    {
      name: 'paid',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'filters',
      type: 'relationship',
      relationTo: 'filters',
      hasMany: true,
    },
    {
      name: 'routes',
      type: 'relationship',
      relationTo: 'routes',
      hasMany: true,
    },
    {
      name: 'dates',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'start',
              type: 'date',
              admin: {
                width: '50%',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'end',
              type: 'date',
              admin: {
                width: '50%',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
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
    },
    {
      name: 'records',
      type: 'relationship',
      relationTo: 'mp3-records',
      hasMany: true,
    },
  ],
}
