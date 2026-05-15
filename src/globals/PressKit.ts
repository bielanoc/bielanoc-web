import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const PressKit: GlobalConfig = {
  slug: 'press-kit',
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'archive',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'ZIP archive for press download' },
    },
  ],
}
