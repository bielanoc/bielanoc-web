import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Artists } from './collections/Artists'
import { Filters } from './collections/Filters'
import { Routes } from './collections/Routes'
import { MP3Records } from './collections/MP3Records'
import { Partners } from './collections/Partners'
import { Contacts } from './collections/Contacts'
import { Articles } from './collections/Articles'
import { Notifications } from './collections/Notifications'

import { TicketSettings } from './globals/TicketSettings'
import { PracticalInfo } from './globals/PracticalInfo'
import { Volunteers } from './globals/Volunteers'
import { SupportUs } from './globals/SupportUs'
import { PressKit } from './globals/PressKit'
import { AboutPage } from './globals/AboutPage'
import { FestivalSettings } from './globals/FestivalSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['@/components/admin/ToolsNavLink#ToolsNavLink'],
      views: {
        'date-review': {
          Component: '@/components/admin/DateReviewView#DateReviewView',
          path: '/tools/date-review',
        },
      },
    },
  },

  collections: [
    Users,
    Media,
    Artists,
    Filters,
    Routes,
    MP3Records,
    Partners,
    Contacts,
    Articles,
    Notifications,
  ],

  globals: [
    FestivalSettings,
    TicketSettings,
    PracticalInfo,
    Volunteers,
    SupportUs,
    PressKit,
    AboutPage,
  ],

  localization: {
    locales: [
      { label: 'Slovenčina', code: 'sk' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'sk',
    fallback: true,
  },

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,

  plugins: [
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'auto',
            },
          }),
        ]
      : []),
  ],
})
