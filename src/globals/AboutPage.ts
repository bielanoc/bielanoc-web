import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
