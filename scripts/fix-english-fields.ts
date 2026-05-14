/**
 * Fix English locale fields for artists.
 *
 * The original migration (migrate-strapi.ts) had a bug where the EN locale
 * for `work` was saved with the SK value instead of the English one.
 * This script re-reads the dump and corrects: work, genre, place, performance (EN).
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/fix-english-fields.ts path/to/dump.sql
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

  const columns = match[1].split(', ').map((c) => c.trim())
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

function unescapeText(text: string | null): string | null {
  if (!text) return null
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
}

function mapCity(city: string | null): 'ba' | 'ke' {
  if (!city) return 'ba'
  const lower = city.toLowerCase()
  if (lower.includes('kosice') || lower.includes('košice') || lower === 'ke') return 'ke'
  return 'ba'
}

function mapYear(year: string | null): string {
  if (!year) return '2024'
  return year.replace('y', '')
}

async function main() {
  const dumpPath = process.argv[2]
  if (!dumpPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/fix-english-fields.ts <dump.sql>')
    process.exit(1)
  }

  console.log('Reading SQL dump...')
  const content = fs.readFileSync(dumpPath, 'utf-8')

  const artists = parseCopyBlock(content, 'artist2020')
  console.log(`Found ${artists.rows.length} artists in dump`)

  // Log available _en columns
  const enColumns = artists.columns.filter((c) => c.endsWith('_en'))
  console.log(`English columns found: ${enColumns.length > 0 ? enColumns.join(', ') : 'none'}`)

  if (enColumns.length === 0) {
    console.log('No English columns in the dump — nothing to fix.')
    process.exit(0)
  }

  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })

  const allArtists = await payload.find({
    collection: 'artists',
    limit: 500,
    depth: 0,
    locale: 'sk',
  })
  console.log(`${allArtists.docs.length} artists in Payload`)

  // Build lookup by name:year:city
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payloadArtists = new Map<string, any>()
  for (const doc of allArtists.docs) {
    const key = `${doc.name}:${doc.year}:${doc.city}`
    payloadArtists.set(key, doc)
  }

  let updated = 0
  let skipped = 0
  let noMatch = 0

  for (const row of artists.rows) {
    const name = row.name || ''
    const year = mapYear(row.year)
    const city = mapCity(row.city)
    const key = `${name}:${year}:${city}`

    const doc = payloadArtists.get(key)
    if (!doc) {
      noMatch++
      continue
    }

    // Collect EN values from whichever columns exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enData: Record<string, any> = {}

    // Note: description_work_en is a long description, NOT the artwork title.
    // The `work` field (title) has no separate EN column — it's the same in both locales.
    // Do NOT write description_work_en into work field.

    const genreEn = row.genre_en
    if (genreEn) enData.genre = genreEn

    const placeEn = unescapeText(row.place_en ?? null)
    if (placeEn) enData.place = placeEn

    const performanceEn = unescapeText(row.performance_en ?? null)
    if (performanceEn) enData.performance = performanceEn

    if (Object.keys(enData).length === 0) {
      skipped++
      continue
    }

    try {
      await payload.update({
        collection: 'artists',
        id: doc.id,
        data: enData,
        locale: 'en',
      })
      updated++
      if (updated % 50 === 0) console.log(`  ... ${updated} updated`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`  ✗ ${name} (${year}/${city}): ${msg}`)
    }
  }

  console.log(`\nDone:`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (no EN data): ${skipped}`)
  console.log(`  No match in Payload: ${noMatch}`)
  process.exit(0)
}

main()
