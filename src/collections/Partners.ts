import type { CollectionConfig } from 'payload'
import { revalidatePartnerPages } from '@/lib/revalidate'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'year'],
    group: 'Content',
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        if (doc.bratislava) revalidatePartnerPages(doc.year, 'ba')
        if (doc.kosice) revalidatePartnerPages(doc.year, 'ke')
      },
    ],
    afterDelete: [
      ({ doc }) => {
        if (doc.bratislava) revalidatePartnerPages(doc.year, 'ba')
        if (doc.kosice) revalidatePartnerPages(doc.year, 'ke')
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'External URL' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Generálny partner', value: 'general' },
        { label: 'Hlavný partner', value: 'main' },
        { label: 'Partner', value: 'partner' },
        { label: 'Oficiálny partner', value: 'official' },
        { label: 'Podpora', value: 'support' },
        { label: 'Regionálny partner', value: 'regional' },
        { label: 'IT Partner', value: 'it' },
        { label: 'Delivery partner', value: 'delivery' },
        { label: 'Hlavný mediálny partner', value: 'main-media' },
        { label: 'Mediálny partner', value: 'other-media' },
        { label: 'Appreciation', value: 'appreciation' },
      ],
    },
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
    },
    {
      type: 'row',
      fields: [
        {
          name: 'bratislava',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'kosice',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
