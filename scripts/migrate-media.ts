/**
 * Media migration script: Links uploaded R2 files to Payload documents.
 *
 * Prerequisites:
 * - Media files already uploaded to R2 (via aws s3 sync)
 * - Text migration already run (artists, contacts, etc. exist in DB)
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/migrate-media.ts path/to/dump.sql
 */

import fs from 'fs'
import path from 'path'

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_S3_URL || 'https://pub-bb450ef159ef4ef5acc99816228545a7.r2.dev'

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

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.zip': 'application/zip',
  }
  return map[ext.toLowerCase()] || 'application/octet-stream'
}

async function main() {
  const sqlPath = process.argv[2]
  if (!sqlPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/migrate-media.ts <path-to-sql-dump>')
    process.exit(1)
  }

  const fullPath = path.resolve(sqlPath)
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(fullPath, 'utf-8')

  // Parse tables
  const files = parseCopyBlock(content, 'files')
  const morphs = parseCopyBlock(content, 'files_related_morphs')

  console.log(`=== Parsed: ${files.rows.length} files, ${morphs.rows.length} morphs ===\n`)

  // Build file lookup: strapi file id → file info
  const fileMap = new Map<string, Row>()
  for (const row of files.rows) {
    if (row.id) fileMap.set(row.id, row)
  }

  // Build morph lookup: group by related_type + related_id + field
  type MorphEntry = { fileId: string; order: string }
  const morphsByTarget = new Map<string, MorphEntry[]>()
  for (const row of morphs.rows) {
    const key = `${row.related_type}:${row.related_id}:${row.field}`
    if (!morphsByTarget.has(key)) morphsByTarget.set(key, [])
    morphsByTarget.get(key)!.push({ fileId: row.file_id!, order: row.order || '1' })
  }

  // Import Payload
  const { getPayloadClient } = await import('../src/lib/payload')
  const payload = await getPayloadClient()

  // Step 1: Create Media documents for all referenced files
  console.log('--- Creating Media documents ---')
  const mediaIdMap = new Map<string, number>() // strapi file id → payload media id

  let created = 0
  let skipped = 0
  for (const row of files.rows) {
    if (!row.hash || !row.ext) { skipped++; continue }

    const filename = row.hash + row.ext
    const url = `${R2_PUBLIC_URL}/${filename}`
    const alt = row.alternative_text || row.name || filename

    try {
      const doc = await (payload.create as any)({
        collection: 'media',
        data: {
          alt,
          filename,
          url,
          mimeType: row.mime || getMimeType(row.ext),
          filesize: row.size ? parseInt(row.size, 10) * 1024 : 0,
          width: row.width ? parseInt(row.width, 10) : undefined,
          height: row.height ? parseInt(row.height, 10) : undefined,
        },
      })
      mediaIdMap.set(row.id!, doc.id as number)
      created++
      if (created % 100 === 0) console.log(`  ... ${created}/${files.rows.length}`)
    } catch (e: any) {
      console.error(`  ✗ File ${row.id} (${row.name}): ${e.message}`)
    }
  }
  console.log(`  Done: ${created} media docs created, ${skipped} skipped\n`)

  // Step 2: Link media to artists (Image field)
  console.log('--- Linking images to artists ---')
  const allArtists = await payload.find({ collection: 'artists', limit: 500, depth: 0 })

  // We need to map old strapi artist IDs to new payload IDs
  // The artists were inserted in order, so we can use the name to match
  // Actually, let's get all artists and match by name+year+city
  const artistsByKey = new Map<string, number>()
  for (const a of allArtists.docs) {
    // Use name as primary key since it's unique enough per year/city
    artistsByKey.set(`${a.name}:${a.year}:${a.city}`, a.id as number)
  }

  // Parse old artists to get the mapping
  const oldArtists = parseCopyBlock(content, 'artist2020')
  const oldArtistIdToNew = new Map<string, number>()

  for (const row of oldArtists.rows) {
    if (!row.id || !row.name) continue
    const city = row.city?.toLowerCase().includes('kosice') || row.city?.toLowerCase().includes('košice') || row.city === 'ke' ? 'ke' : 'ba'
    const year = (row.year || '').replace('y', '') || '2024'
    const key = `${row.name}:${year}:${city}`
    const payloadId = artistsByKey.get(key)
    if (payloadId) {
      oldArtistIdToNew.set(row.id, payloadId)
    }
  }
  console.log(`  Mapped ${oldArtistIdToNew.size} old artists to new IDs`)

  // Link artist images
  let linked = 0
  for (const [key, entries] of morphsByTarget) {
    if (!key.includes('artists-2020') || !key.includes(':Image')) continue
    const parts = key.split(':')
    const oldArtistId = parts[2]
    const newArtistId = oldArtistIdToNew.get(oldArtistId)
    if (!newArtistId) continue

    const fileEntry = entries[0]
    const mediaId = mediaIdMap.get(fileEntry.fileId)
    if (!mediaId) continue

    try {
      await payload.update({
        collection: 'artists',
        id: newArtistId,
        data: { image: mediaId } as any,
      })
      linked++
    } catch (e: any) {
      console.error(`  ✗ Artist ${newArtistId}: ${e.message}`)
    }
  }
  console.log(`  Done: ${linked} artist images linked\n`)

  // Step 3: Link media to contacts (Photo field)
  console.log('--- Linking photos to contacts ---')
  const allContacts = await payload.find({ collection: 'contacts', limit: 50, depth: 0 })
  const contactsByName = new Map<string, number>()
  for (const c of allContacts.docs) {
    contactsByName.set(c.name, c.id as number)
  }

  const oldContacts = parseCopyBlock(content, 'contacts')
  const oldContactIdToNew = new Map<string, number>()
  for (const row of oldContacts.rows) {
    if (!row.id || !row.name) continue
    const payloadId = contactsByName.get(row.name)
    if (payloadId) oldContactIdToNew.set(row.id, payloadId)
  }

  let contactLinked = 0
  for (const [key, entries] of morphsByTarget) {
    if (!key.includes('contact') || !key.includes(':Photo')) continue
    const parts = key.split(':')
    const oldContactId = parts[2]
    const newContactId = oldContactIdToNew.get(oldContactId)
    if (!newContactId) continue

    const mediaId = mediaIdMap.get(entries[0].fileId)
    if (!mediaId) continue

    try {
      await payload.update({
        collection: 'contacts',
        id: newContactId,
        data: { photo: mediaId } as any,
      })
      contactLinked++
    } catch (e: any) {
      console.error(`  ✗ Contact ${newContactId}: ${e.message}`)
    }
  }
  console.log(`  Done: ${contactLinked} contact photos linked\n`)

  // Step 4: Link MP3 files to mp3-records
  console.log('--- Linking files to MP3 records ---')
  const allMp3s = await payload.find({ collection: 'mp3-records', limit: 50, depth: 0 })
  const mp3sByTitle = new Map<string, number>()
  for (const m of allMp3s.docs) {
    mp3sByTitle.set(m.title, m.id as number)
  }

  const oldMp3s = parseCopyBlock(content, 'mp_3_records')
  const oldMp3IdToNew = new Map<string, number>()
  for (const row of oldMp3s.rows) {
    if (!row.id || !row.title) continue
    const payloadId = mp3sByTitle.get(row.title)
    if (payloadId) oldMp3IdToNew.set(row.id, payloadId)
  }

  let mp3Linked = 0
  for (const [key, entries] of morphsByTarget) {
    if (!key.includes('mp-3-record') || !key.includes(':mp3_record')) continue
    const parts = key.split(':')
    const oldMp3Id = parts[2]
    const newMp3Id = oldMp3IdToNew.get(oldMp3Id)
    if (!newMp3Id) continue

    const mediaId = mediaIdMap.get(entries[0].fileId)
    if (!mediaId) continue

    try {
      await payload.update({
        collection: 'mp3-records',
        id: newMp3Id,
        data: { file: mediaId } as any,
      })
      mp3Linked++
    } catch (e: any) {
      console.error(`  ✗ MP3 ${newMp3Id}: ${e.message}`)
    }
  }
  console.log(`  Done: ${mp3Linked} MP3 files linked\n`)

  // Step 5: Create partners with logos
  console.log('--- Creating partners with logos ---')
  const oldPartners = parseCopyBlock(content, 'partners')
  let partnerCreated = 0

  for (const row of oldPartners.rows) {
    if (!row.id) continue

    // Find logo for this partner
    const morphKey = `api::partner.partner:${row.id}:Logo`
    const entries = morphsByTarget.get(morphKey)
    const mediaId = entries ? mediaIdMap.get(entries[0].fileId) : undefined

    const city = row.city?.toLowerCase()
    try {
      await (payload.create as any)({
        collection: 'partners',
        data: {
          name: row.name || 'Unknown',
          category: row.category || 'partner',
          year: (row.year || '2024').replace('y', ''),
          bratislava: row.bratislava === 't',
          kosice: row.kosice === 't',
          link: row.link || undefined,
          logo: mediaId || undefined,
        },
      })
      partnerCreated++
    } catch (e: any) {
      console.error(`  ✗ Partner ${row.id} (${row.name}): ${e.message}`)
    }
  }
  console.log(`  Done: ${partnerCreated} partners created\n`)

  console.log('=== Media migration complete ===')
  console.log(`Media documents: ${created}`)
  console.log(`Artist images linked: ${linked}`)
  console.log(`Contact photos linked: ${contactLinked}`)
  console.log(`MP3 files linked: ${mp3Linked}`)
  console.log(`Partners created (with logos): ${partnerCreated}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
