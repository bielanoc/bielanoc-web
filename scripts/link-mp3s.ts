/**
 * Link MP3 files to MP3Record documents.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/link-mp3s.ts path/to/dump.sql
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

async function main() {
  const dumpPath = process.argv[2]
  if (!dumpPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/link-mp3s.ts <dump.sql>')
    process.exit(1)
  }

  console.log('Reading SQL dump...')
  const content = fs.readFileSync(dumpPath, 'utf-8')

  const morphs = parseCopyBlock(content, 'files_related_morphs')
  const files = parseCopyBlock(content, 'files')
  const mp3Records = parseCopyBlock(content, 'mp_3_records')

  // Build file ID → filename map (hash + ext)
  const fileMap = new Map<string, string>()
  for (const row of files.rows) {
    if (row.id && row.hash && row.ext) {
      fileMap.set(row.id, `${row.hash}${row.ext}`)
    }
  }

  // Find MP3 morph entries: file_id → related_id (mp3 record id)
  const mp3Morphs = morphs.rows.filter(
    (r) => r.related_type === 'api::mp-3-record.mp-3-record'
  )
  console.log(`Found ${mp3Morphs.length} MP3 file links in dump`)

  // Build old mp3 record ID → file filename
  const oldMp3ToFile = new Map<string, string>()
  for (const morph of mp3Morphs) {
    const fileId = morph.file_id
    const recordId = morph.related_id
    if (fileId && recordId) {
      const filename = fileMap.get(fileId)
      if (filename) {
        oldMp3ToFile.set(recordId, filename)
      }
    }
  }
  console.log(`Mapped ${oldMp3ToFile.size} old MP3 records to filenames`)

  // Build old mp3 record ID → title (for matching to Payload)
  const oldMp3Titles = new Map<string, string>()
  for (const row of mp3Records.rows) {
    if (row.id && row.title) {
      oldMp3Titles.set(row.id, row.title)
    }
  }

  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })

  // Load all media and MP3 records from Payload
  const [allMedia, allMp3] = await Promise.all([
    payload.find({ collection: 'media', limit: 1000, depth: 0 }),
    payload.find({ collection: 'mp3-records', limit: 100, depth: 0 }),
  ])

  console.log(`${allMedia.docs.length} media docs, ${allMp3.docs.length} MP3 records in Payload`)

  // Build filename → media ID map
  const mediaByFilename = new Map<string, number>()
  for (const doc of allMedia.docs) {
    if (doc.filename) {
      mediaByFilename.set(doc.filename, doc.id as number)
    }
  }

  // Build title → Payload MP3 record map
  const mp3ByTitle = new Map<string, any>()
  for (const doc of allMp3.docs) {
    mp3ByTitle.set(doc.title, doc)
  }

  // If no MP3 records exist in Payload, create them with files linked
  let created = 0
  let notFound = 0
  const newMp3IdMap = new Map<string, number>()

  for (const [oldId, filename] of oldMp3ToFile) {
    const title = oldMp3Titles.get(oldId)
    if (!title) {
      console.log(`  ? No title for old MP3 ID ${oldId}`)
      notFound++
      continue
    }

    const mediaId = mediaByFilename.get(filename)
    if (!mediaId) {
      console.log(`  ? No media doc for filename "${filename}"`)
      notFound++
      continue
    }

    // Check if already exists
    const existing = mp3ByTitle.get(title)
    if (existing) {
      if (!existing.file) {
        await payload.update({
          collection: 'mp3-records',
          id: existing.id,
          data: { file: mediaId } as any,
        })
        console.log(`  ✓ Updated "${title}" → ${filename}`)
      } else {
        console.log(`  ~ "${title}" already linked`)
      }
      newMp3IdMap.set(oldId, existing.id as number)
      created++
      continue
    }

    try {
      const doc = await payload.create({
        collection: 'mp3-records',
        data: {
          title: title.trim(),
          file: mediaId,
        } as any,
      })
      newMp3IdMap.set(oldId, doc.id as number)
      created++
      console.log(`  ✓ Created "${title}" → ${filename}`)
    } catch (e: any) {
      console.error(`  ✗ "${title}": ${e.message}`)
    }
  }

  console.log(`\n${created} MP3 records created/linked, ${notFound} not found`)

  // Now link MP3 records to artists
  const mp3ArtistLinks = parseCopyBlock(content, 'artist_2020_mp_3_records_links')
  console.log(`\nFound ${mp3ArtistLinks.rows.length} artist↔MP3 links`)

  if (mp3ArtistLinks.rows.length > 0) {
    console.log('Columns:', mp3ArtistLinks.columns)

    // Load artists
    const allArtists = await payload.find({ collection: 'artists', limit: 500, depth: 0 })

    // Build old artist ID → Payload artist
    const oldArtists = parseCopyBlock(content, 'artist2020')
    const artistKeyToPayload = new Map<string, any>()
    for (const doc of allArtists.docs) {
      const key = `${doc.name}:${doc.year}:${doc.city}`
      artistKeyToPayload.set(key, doc)
    }

    const oldArtistIdToKey = new Map<string, string>()
    for (const row of oldArtists.rows) {
      const name = row.name || ''
      const year = (row.year || '').replace('y', '')
      const city = (row.city || '').toLowerCase().includes('kosice') || (row.city || '').toLowerCase().includes('košice') ? 'ke' : 'ba'
      oldArtistIdToKey.set(row.id!, `${name}:${year}:${city}`)
    }

    let artistsLinked = 0
    for (const link of mp3ArtistLinks.rows) {
      const artistOldId = link.artists_2020_id || link.artist_2020_id
      const mp3OldId = link.mp_3_record_id || link.mp3_record_id
      if (!artistOldId || !mp3OldId) continue

      const artistKey = oldArtistIdToKey.get(artistOldId)
      if (!artistKey) continue

      const artist = artistKeyToPayload.get(artistKey)
      if (!artist) continue

      const newMp3Id = newMp3IdMap.get(mp3OldId)
      if (!newMp3Id) continue

      const currentRecords = Array.isArray(artist.records)
        ? artist.records.map((r: any) => typeof r === 'object' ? r.id : r)
        : []

      if (currentRecords.includes(newMp3Id)) continue

      try {
        await payload.update({
          collection: 'artists',
          id: artist.id,
          data: { records: [...currentRecords, newMp3Id] } as any,
        })
        artistsLinked++
        console.log(`  ✓ Linked MP3 to artist "${artist.name}"`)
      } catch (e: any) {
        console.error(`  ✗ Artist "${artist.name}": ${e.message}`)
      }
    }
    console.log(`${artistsLinked} artists linked to MP3 records`)
  }

  console.log('\nDone!')
  process.exit(0)
}

main()
