import type { GlobalConfig } from 'payload'

export const PressKit: GlobalConfig = {
  slug: 'press-kit',
  admin: {
    group: 'Settings',
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
