import type { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'year', 'paid'],
    group: 'Content',
  },
  versions: { drafts: true },
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
      type: 'row',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          admin: { width: '50%' },
        },
        {
          name: 'longitude',
          type: 'number',
          admin: { width: '50%' },
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
      type: 'relationship',
      relationTo: 'date-entries',
      hasMany: true,
    },
    {
      name: 'records',
      type: 'relationship',
      relationTo: 'mp3-records',
      hasMany: true,
    },
  ],
}
