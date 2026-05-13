import type { GlobalConfig } from 'payload'

export const SupportUs: GlobalConfig = {
  slug: 'support-us',
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
