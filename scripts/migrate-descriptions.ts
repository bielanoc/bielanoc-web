/**
 * Migrate artist descriptions from Strapi SQL dump into Payload's richText `description` field.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/migrate-descriptions.ts path/to/dump.sql
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
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '')
    .replace(/\\\\/g, '\\')
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

function textToLexical(text: string): any {
  const paragraphs = text.split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p.replace(/\n/g, ' ').trim(), version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

async function main() {
  const dumpPath = process.argv[2]
  if (!dumpPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/migrate-descriptions.ts <dump.sql>')
    process.exit(1)
  }

  console.log('Reading SQL dump...')
  const content = fs.readFileSync(dumpPath, 'utf-8')

  const artists = parseCopyBlock(content, 'artist2020')
  console.log(`Found ${artists.rows.length} artists in dump`)

  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })

  const allArtists = await payload.find({
    collection: 'artists',
    limit: 500,
    depth: 0,
    locale: 'sk',
  })
  console.log(`${allArtists.docs.length} artists in Payload`)

  const payloadArtists = new Map<string, any>()
  for (const doc of allArtists.docs) {
    const key = `${doc.name}:${doc.year}:${doc.city}`
    payloadArtists.set(key, doc)
  }

  let updated = 0
  let skipped = 0

  for (const row of artists.rows) {
    const name = row.name || ''
    const year = mapYear(row.year)
    const city = mapCity(row.city)
    const key = `${name}:${year}:${city}`

    const doc = payloadArtists.get(key)
    if (!doc) {
      skipped++
      continue
    }

    const descArtist = unescapeText(row.description_artist)
    const descWork = unescapeText(row.description_work)
    const descArtistEn = unescapeText(row.description_artist_en)
    const descWorkEn = unescapeText(row.description_work_en)

    if (!descArtist && !descWork) {
      skipped++
      continue
    }

    // Build combined description
    const parts: string[] = []
    if (descArtist) parts.push(descArtist)
    if (descWork) parts.push(descWork)
    const combined = parts.join('\n\n')

    const lexical = textToLexical(combined)

    try {
      await payload.update({
        collection: 'artists',
        id: doc.id,
        data: { description: lexical } as any,
        locale: 'sk',
      })

      // Also set English if available
      const partsEn: string[] = []
      if (descArtistEn) partsEn.push(descArtistEn)
      if (descWorkEn) partsEn.push(descWorkEn)
      if (partsEn.length > 0) {
        const lexicalEn = textToLexical(partsEn.join('\n\n'))
        await payload.update({
          collection: 'artists',
          id: doc.id,
          data: { description: lexicalEn } as any,
          locale: 'en',
        })
      }

      updated++
      if (updated % 50 === 0) console.log(`  ... ${updated} updated`)
    } catch (e: any) {
      console.error(`  ✗ ${name}: ${e.message}`)
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`)
  process.exit(0)
}

main()
