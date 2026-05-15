import type { CollectionConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'orderRank'],
    group: 'Content',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
    afterDelete: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'orderRank',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
