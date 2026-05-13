import type { CollectionConfig } from 'payload'
import { sendPushNotification } from '@/lib/firebase-admin'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'createdAt'],
    group: 'Content',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return
        try {
          await sendPushNotification({
            title: doc.title,
            body: doc.description,
            topic: `city_${doc.city}`,
          })
        } catch (err) {
          console.error('Push notification failed:', err)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        { label: 'Bratislava', value: 'ba' },
        { label: 'Košice', value: 'ke' },
      ],
    },
  ],
}
