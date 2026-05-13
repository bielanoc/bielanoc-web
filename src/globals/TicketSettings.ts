import type { GlobalConfig } from 'payload'

export const TicketSettings: GlobalConfig = {
  slug: 'ticket-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'saleEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Toggle ticket sales on/off' },
    },
    {
      name: 'linkBA',
      type: 'text',
      admin: { description: 'Ticket purchase URL for Bratislava' },
    },
    {
      name: 'linkKE',
      type: 'text',
      admin: { description: 'Ticket purchase URL for Košice' },
    },
    {
      name: 'textBA',
      type: 'richText',
      localized: true,
      admin: { description: 'Additional ticket info for Bratislava' },
    },
    {
      name: 'textKE',
      type: 'richText',
      localized: true,
      admin: { description: 'Additional ticket info for Košice' },
    },
  ],
}
