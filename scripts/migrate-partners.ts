/**
 * Migrate partners from old Strapi SQL dump into Payload CMS.
 * Creates partner documents with logos linked from existing media.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/migrate-partners.ts path/to/dump.sql
 */

import fs from 'fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Row = Record<string, string | null>

function parseCopyBlock(content: string, tableName: string): { columns: string[]; rows: Row[] } {
  const pattern = new RegExp(
    `COPY public\\.${tableName} \\(([^)]+)\\) FROM stdin;\\n([\\s\\S]*?)\\n\\\\\\.`,
  )
  const match = content.match(pattern)
  if (!match) return { columns: [], rows: [] }

  const columns = match[1].split(', ').map((c) => c.trim().replace(/"/g, ''))
  const lines = match[2].trim().split('\n')

  const rows = lines.map((line) => {
    const values = line.split('\t')
    const row: Row = {}
    columns.forEach((col, i) => {
      row[col] = values[i] === '\\N' ? null : values[i]
    })
    return row
  })

  return { columns, rows }
}

// Map old Strapi category names to Payload select values
function mapCategory(category: string | null): string {
  if (!category) return 'partner'
  const map: Record<string, string> = {
    'General': 'general',
    'Main': 'main',
    'Partner': 'partner',
    'Official': 'official',
    'Support': 'support',
    'Regional': 'regional',
    'IT': 'it',
    'Delivery': 'delivery',
    'MainMedia': 'main-media',
    'OtherMedia': 'other-media',
    'Appreciation': 'appreciation',
  }
  return map[category] || 'partner'
}

function mapYear(year: string | null): string {
  if (!year) return '2024'
  return year.replace('y', '')
}

async function main() {
  const dumpPath = process.argv[2]
  if (!dumpPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/migrate-partners.ts <path-to-dump.sql>')
    process.exit(1)
  }

  const sql = fs.readFileSync(dumpPath, 'utf-8')
  const payload = await getPayload({ config })

  // Parse old data
  const partners = parseCopyBlock(sql, 'partners')
  const files = parseCopyBlock(sql, 'files')
  const morphs = parseCopyBlock(sql, 'files_related_morphs')

  console.log(`Parsed: ${partners.rows.length} partners, ${files.rows.length} files, ${morphs.rows.length} morphs`)

  // Build strapi file ID → filename (hash+ext)
  const strapiFileToFilename = new Map<string, string>()
  for (const row of files.rows) {
    if (row.id && row.hash && row.ext) {
      strapiFileToFilename.set(row.id, row.hash + row.ext)
    }
  }

  // Load all Payload media and build filename → ID map
  console.log('Loading media from Payload...')
  let allMedia: any[] = []
  let page = 1
  while (true) {
    const result = await payload.find({ collection: 'media', limit: 500, page, depth: 0 })
    allMedia.push(...result.docs)
    if (!result.hasNextPage) break
    page++
  }
  const mediaByFilename = new Map<string, number>()
  for (const m of allMedia) {
    if (m.filename) mediaByFilename.set(m.filename, m.id as number)
  }
  console.log(`  ${mediaByFilename.size} media documents loaded`)

  // Build strapi file ID → Payload media ID
  const strapiFileToPayloadMedia = new Map<string, number>()
  for (const [strapiId, filename] of strapiFileToFilename) {
    const payloadId = mediaByFilename.get(filename)
    if (payloadId) strapiFileToPayloadMedia.set(strapiId, payloadId)
  }
  console.log(`  ${strapiFileToPayloadMedia.size} strapi files mapped to Payload media`)

  // Build partner ID → logo file mapping from morphs
  const partnerLogoMap = new Map<string, string>() // partner strapi ID → strapi file ID
  for (const morph of morphs.rows) {
    if (morph.related_type === 'api::partner.partner' && morph.field === 'Logo') {
      partnerLogoMap.set(morph.related_id!, morph.file_id!)
    }
  }
  console.log(`  ${partnerLogoMap.size} partner-logo mappings found\n`)

  // Check existing partners in Payload
  const existing = await payload.find({ collection: 'partners', limit: 1, depth: 0 })
  if (existing.totalDocs > 0) {
    console.log(`⚠️  ${existing.totalDocs} partners already exist. Skipping creation.`)
    process.exit(0)
  }

  // Create partners
  let created = 0
  let skippedNoLogo = 0
  let failed = 0

  for (const row of partners.rows) {
    if (!row.name || !row.id) continue

    const year = mapYear(row.year)
    // Skip years not in our valid options
    const validYears = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
    if (!validYears.includes(year)) continue

    const category = mapCategory(row.category)

    // Find logo
    const strapiFileId = partnerLogoMap.get(row.id)
    let payloadMediaId: number | null = null
    if (strapiFileId) {
      payloadMediaId = strapiFileToPayloadMedia.get(strapiFileId) || null
    }

    if (!payloadMediaId) {
      skippedNoLogo++
      continue
    }

    try {
      await payload.create({
        collection: 'partners',
        data: {
          name: row.name.trim(),
          logo: payloadMediaId,
          link: row.link || undefined,
          category,
          year,
          bratislava: row.bratislava === 't',
          kosice: row.kosice === 't',
        } as any,
      })
      created++
      if (created % 20 === 0) console.log(`  ... ${created} created`)
    } catch (e: any) {
      console.error(`  ✗ ${row.name}: ${e.message}`)
      failed++
    }
  }

  console.log(`\n=== Summary ===`)
  console.log(`Created: ${created}`)
  console.log(`Skipped (no logo in media): ${skippedNoLogo}`)
  console.log(`Failed: ${failed}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
