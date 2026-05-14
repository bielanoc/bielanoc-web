/**
 * Links media documents to artists, contacts, mp3-records based on Strapi morph table.
 * Assumes media documents already exist in Payload (created by migrate-media.ts).
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/link-media.ts /tmp/1763483584-bielanoc_prod.sql
 */

import fs from 'fs'

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

async function main() {
  const sqlPath = process.argv[2]
  if (!sqlPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/link-media.ts <path-to-sql-dump>')
    process.exit(1)
  }

  const content = fs.readFileSync(sqlPath, 'utf-8')

  // Parse tables
  const files = parseCopyBlock(content, 'files')
  const morphs = parseCopyBlock(content, 'files_related_morphs')
  const oldArtists = parseCopyBlock(content, 'artist2020')

  console.log(`Parsed: ${files.rows.length} files, ${morphs.rows.length} morphs, ${oldArtists.rows.length} old artists`)

  // Build strapi file ID → filename (hash+ext)
  const strapiFileToFilename = new Map<string, string>()
  for (const row of files.rows) {
    if (row.id && row.hash && row.ext) {
      strapiFileToFilename.set(row.id, row.hash + row.ext)
    }
  }

  // Import Payload
  const { getPayloadClient } = await import('../src/lib/payload')
  const payload = await getPayloadClient()

  // Build Payload media filename → ID map
  console.log('Loading all media from Payload...')
  const allMedia = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  const mediaByFilename = new Map<string, number>()
  for (const m of allMedia.docs) {
    if (m.filename) mediaByFilename.set(m.filename, m.id as number)
  }
  console.log(`  ${mediaByFilename.size} media documents loaded`)

  // Build strapi file ID → Payload media ID
  const strapiFileToPayloadMedia = new Map<string, number>()
  for (const [strapiId, filename] of strapiFileToFilename) {
    const payloadId = mediaByFilename.get(filename)
    if (payloadId) strapiFileToPayloadMedia.set(strapiId, payloadId)
  }
  console.log(`  ${strapiFileToPayloadMedia.size} strapi files mapped to Payload media\n`)

  // Build old artist mapping: strapi artist ID → {name, city, year}
  const oldArtistMap = new Map<string, { name: string; city: string; year: string }>()
  for (const row of oldArtists.rows) {
    if (!row.id || !row.name) continue
    const city = row.city?.toLowerCase().includes('kosice') || row.city?.toLowerCase().includes('košice') ? 'ke' : 'ba'
    const year = (row.year || '').replace('y', '') || '2024'
    oldArtistMap.set(row.id, { name: row.name, city, year })
  }

  // Load all Payload artists and build lookup by name+year+city
  console.log('Loading all artists from Payload...')
  const allArtists = await payload.find({ collection: 'artists', limit: 500, depth: 0 })
  const artistsByKey = new Map<string, number>()
  for (const a of allArtists.docs) {
    artistsByKey.set(`${a.name}:${a.year}:${a.city}`, a.id as number)
  }
  console.log(`  ${allArtists.docs.length} artists loaded\n`)

  // Parse morphs for artist images
  console.log('--- Linking images to artists ---')
  let linked = 0
  let notFound = 0
  for (const morph of morphs.rows) {
    if (morph.related_type !== 'api::artists-2020.artists-2020' || morph.field !== 'Image') continue

    const oldArtist = oldArtistMap.get(morph.related_id!)
    if (!oldArtist) { notFound++; continue }

    const key = `${oldArtist.name}:${oldArtist.year}:${oldArtist.city}`
    const payloadArtistId = artistsByKey.get(key)
    if (!payloadArtistId) { notFound++; continue }

    const payloadMediaId = strapiFileToPayloadMedia.get(morph.file_id!)
    if (!payloadMediaId) { notFound++; continue }

    try {
      await payload.update({
        collection: 'artists',
        id: payloadArtistId,
        data: { image: payloadMediaId } as any,
      })
      linked++
      if (linked % 50 === 0) console.log(`  ... ${linked} linked`)
    } catch (e: any) {
      console.error(`  ✗ Artist ${payloadArtistId} (${oldArtist.name}): ${e.message}`)
    }
  }
  console.log(`  Done: ${linked} artist images linked, ${notFound} not matched\n`)

  // Link contacts
  console.log('--- Linking photos to contacts ---')
  const oldContacts = parseCopyBlock(content, 'contacts')
  const allContacts = await payload.find({ collection: 'contacts', limit: 50, depth: 0 })
  const contactsByName = new Map<string, number>()
  for (const c of allContacts.docs) {
    contactsByName.set(c.name, c.id as number)
  }

  let contactLinked = 0
  for (const morph of morphs.rows) {
    if (morph.related_type !== 'api::contact.contact' || morph.field !== 'Photo') continue

    const oldContact = oldContacts.rows.find(r => r.id === morph.related_id)
    if (!oldContact || !oldContact.name) continue

    const payloadContactId = contactsByName.get(oldContact.name)
    if (!payloadContactId) continue

    const payloadMediaId = strapiFileToPayloadMedia.get(morph.file_id!)
    if (!payloadMediaId) continue

    try {
      await payload.update({
        collection: 'contacts',
        id: payloadContactId,
        data: { photo: payloadMediaId } as any,
      })
      contactLinked++
    } catch (e: any) {
      console.error(`  ✗ Contact ${oldContact.name}: ${e.message}`)
    }
  }
  console.log(`  Done: ${contactLinked} contact photos linked\n`)

  // Link MP3s
  console.log('--- Linking files to MP3 records ---')
  const oldMp3s = parseCopyBlock(content, 'mp_3_records')
  const allMp3s = await payload.find({ collection: 'mp3-records', limit: 50, depth: 0 })
  const mp3sByTitle = new Map<string, number>()
  for (const m of allMp3s.docs) {
    mp3sByTitle.set(m.title, m.id as number)
  }

  let mp3Linked = 0
  for (const morph of morphs.rows) {
    if (morph.related_type !== 'api::mp-3-record.mp-3-record' || morph.field !== 'mp3_record') continue

    const oldMp3 = oldMp3s.rows.find(r => r.id === morph.related_id)
    if (!oldMp3 || !oldMp3.title) continue

    const payloadMp3Id = mp3sByTitle.get(oldMp3.title)
    if (!payloadMp3Id) continue

    const payloadMediaId = strapiFileToPayloadMedia.get(morph.file_id!)
    if (!payloadMediaId) continue

    try {
      await payload.update({
        collection: 'mp3-records',
        id: payloadMp3Id,
        data: { file: payloadMediaId } as any,
      })
      mp3Linked++
    } catch (e: any) {
      console.error(`  ✗ MP3 ${oldMp3.title}: ${e.message}`)
    }
  }
  console.log(`  Done: ${mp3Linked} MP3 files linked\n`)

  console.log('=== Summary ===')
  console.log(`Artist images: ${linked}`)
  console.log(`Contact photos: ${contactLinked}`)
  console.log(`MP3 files: ${mp3Linked}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
