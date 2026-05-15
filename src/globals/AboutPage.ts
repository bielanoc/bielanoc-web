import type { GlobalConfig } from 'payload'
import { revalidateGlobalPages } from '@/lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [() => { revalidateGlobalPages() }],
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
