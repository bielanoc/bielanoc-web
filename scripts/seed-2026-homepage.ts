import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Seeds the 2026 homepage:
 *   - uploads the BA/KE background videos + poster images to Media (R2)
 *   - points BrandingSettings.homepage videoBA/videoKE + imageBA/imageKE at them
 *   - sets FestivalSettings currentYear + city dates for 2026
 *
 * Idempotent: media are matched by their `alt` text, so re-running reuses the
 * existing records instead of creating duplicates.
 *
 * Run with: pnpm tsx scripts/seed-2026-homepage.ts
 * Requires .env.local (DATABASE_URL, PAYLOAD_SECRET, S3_* ) to be loaded.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assets = path.join(__dirname, 'assets')

type Asset = { alt: string; file: string }

async function main() {
  const payload = await getPayload({ config })

  async function upsertMedia({ alt, file }: Asset): Promise<number> {
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      const id = existing.docs[0].id as number
      console.log(`• reuse Media "${alt}" (id ${id})`)
      return id
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(assets, file),
    })
    console.log(`• upload Media "${alt}" (id ${created.id})`)
    return created.id as number
  }

  const baVideo = await upsertMedia({ alt: 'Bratislava — pozadie 2026', file: 'bratislava-2026.mp4' })
  const baPoster = await upsertMedia({ alt: 'Bratislava — poster 2026', file: 'bratislava-2026-poster.jpg' })
  const keVideo = await upsertMedia({ alt: 'Košice — pozadie 2026', file: 'kosice-2026.mp4' })
  const kePoster = await upsertMedia({ alt: 'Košice — poster 2026', file: 'kosice-2026-poster.jpg' })

  await payload.updateGlobal({
    slug: 'branding-settings',
    data: {
      homepage: {
        imageBA: baPoster,
        videoBA: baVideo,
        imageKE: kePoster,
        videoKE: keVideo,
      },
    },
  })
  console.log('✓ BrandingSettings.homepage wired to 2026 media')

  // dateInfoBA/KE are localized — write both locales explicitly.
  await payload.updateGlobal({
    slug: 'festival-settings',
    locale: 'sk',
    data: {
      currentYear: '2026',
      dateInfoBA: '2. – 4. október 2026 Bratislava',
      dateInfoKE: '9. – 11. október 2026 Košice',
    },
  })
  await payload.updateGlobal({
    slug: 'festival-settings',
    locale: 'en',
    data: {
      dateInfoBA: '2 – 4 October 2026 Bratislava',
      dateInfoKE: '9 – 11 October 2026 Košice',
    },
  })
  console.log('✓ FestivalSettings set to 2026 with city dates')

  console.log('\nDone.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
