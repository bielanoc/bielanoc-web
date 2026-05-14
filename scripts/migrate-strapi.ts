/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migration script: Strapi PostgreSQL dump → Payload CMS
 *
 * Usage:
 *   pnpm tsx scripts/migrate-strapi.ts path/to/dump.sql
 *
 * Requires the app to be running (uses Payload Local API via getPayloadClient).
 */

import fs from 'fs'
import path from 'path'

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

function unescapeText(text: string | null): string | null {
  if (!text) return null
  return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
}

async function main() {
  const sqlPath = process.argv[2]
  if (!sqlPath) {
    console.error('Usage: pnpm tsx scripts/migrate-strapi.ts <path-to-sql-dump>')
    process.exit(1)
  }

  const fullPath = path.resolve(sqlPath)
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(fullPath, 'utf-8')

  // Parse all tables
  const artists = parseCopyBlock(content, 'artist2020')
  const filters = parseCopyBlock(content, 'filters')
  const partners = parseCopyBlock(content, 'partners')
  const contacts = parseCopyBlock(content, 'contacts')
  const dates = parseCopyBlock(content, 'datumies')
  const mp3Records = parseCopyBlock(content, 'mp_3_records')
  const routes = parseCopyBlock(content, 'routes')
  const notifications = parseCopyBlock(content, 'notifications')

  // Relation tables
  const filterArtistLinks = parseCopyBlock(content, 'filters_artist_2020_s_links')
  const dateArtistLinks = parseCopyBlock(content, 'datumies_artist_2020_s_links')
  const routeArtistLinks = parseCopyBlock(content, 'routes_artist_2020_s_links')
  const mp3ArtistLinks = parseCopyBlock(content, 'artist_2020_mp_3_records_links')

  console.log('=== Parsed data ===')
  console.log(`Artists: ${artists.rows.length}`)
  console.log(`Filters: ${filters.rows.length}`)
  console.log(`Partners: ${partners.rows.length}`)
  console.log(`Contacts: ${contacts.rows.length}`)
  console.log(`Dates: ${dates.rows.length}`)
  console.log(`MP3 Records: ${mp3Records.rows.length}`)
  console.log(`Routes: ${routes.rows.length}`)
  console.log(`Notifications: ${notifications.rows.length}`)
  console.log()

  // Import Payload
  const { getPayloadClient } = await import('../src/lib/payload')
  const payload = await getPayloadClient()

  // ID mappings (old strapi id → new payload id)
  const filterIdMap = new Map<string, number>()
  const dateIdMap = new Map<string, number>()
  const mp3IdMap = new Map<string, number>()
  const routeIdMap = new Map<string, number>()
  const artistIdMap = new Map<string, number>()

  // 1. Migrate Filters
  console.log('--- Migrating Filters ---')
  for (const row of filters.rows) {
    try {
      const doc = await payload.create({
        collection: 'filters',
        data: {
          slug: row.slug || `filter-${row.id}`,
          title: row.title || '',
          color: row.color || '#8ebc35',
        },
      })
      filterIdMap.set(row.id!, doc.id as number)
      console.log(`  ✓ Filter: ${row.title} → ${doc.id}`)
    } catch (e: any) {
      console.error(`  ✗ Filter ${row.id}: ${e.message}`)
    }
  }

  // 2. Migrate Routes
  console.log('\n--- Migrating Routes ---')
  for (const row of routes.rows) {
    try {
      const doc = await payload.create({
        collection: 'routes',
        data: {
          title: row.title || '',
          city: mapCity(row.city),
        },
      })
      routeIdMap.set(row.id!, doc.id as number)
      console.log(`  ✓ Route: ${row.title} → ${doc.id}`)
    } catch (e: any) {
      console.error(`  ✗ Route ${row.id}: ${e.message}`)
    }
  }

  // 3. Migrate Date Entries
  console.log('\n--- Migrating Date Entries ---')
  for (const row of dates.rows) {
    try {
      const doc = await payload.create({
        collection: 'date-entries',
        data: {
          dateText: row.date_text || undefined,
          start: row.start_date_time ? new Date(row.start_date_time).toISOString() : undefined,
          end: row.end_date_time ? new Date(row.end_date_time).toISOString() : undefined,
          display: row.display === 't',
        },
      })
      dateIdMap.set(row.id!, doc.id as number)
      console.log(`  ✓ Date: ${row.date_text || row.start_date_time} → ${doc.id}`)
    } catch (e: any) {
      console.error(`  ✗ Date ${row.id}: ${e.message}`)
    }
  }

  // 4. Migrate MP3 Records (without files — those need separate media upload)
  console.log('\n--- Migrating MP3 Records ---')
  for (const row of mp3Records.rows) {
    try {
      const doc = await payload.create({
        collection: 'mp3-records',
        data: {
          title: row.title || 'Untitled',
          description: unescapeText(row.description) || undefined,
        } as any,
      })
      mp3IdMap.set(row.id!, doc.id as number)
      console.log(`  ✓ MP3: ${row.title} → ${doc.id}`)
    } catch (e: any) {
      console.error(`  ✗ MP3 ${row.id}: ${e.message}`)
    }
  }

  // 5. Migrate Artists
  console.log('\n--- Migrating Artists ---')

  // Build relationship lookups
  const artistFilters = new Map<string, string[]>()
  for (const link of filterArtistLinks.rows) {
    const artistId = link.artists_2020_id
    const filterId = link.filter_id
    if (!artistId || !filterId) continue
    if (!artistFilters.has(artistId)) artistFilters.set(artistId, [])
    artistFilters.get(artistId)!.push(filterId)
  }

  const artistDates = new Map<string, string[]>()
  for (const link of dateArtistLinks.rows) {
    const artistId = link.artists_2020_id
    const dateId = link.datumy_id
    if (!artistId || !dateId) continue
    if (!artistDates.has(artistId)) artistDates.set(artistId, [])
    artistDates.get(artistId)!.push(dateId)
  }

  const artistRoutes = new Map<string, string[]>()
  for (const link of routeArtistLinks.rows) {
    const artistId = link.artists_2020_id
    const routeId = link.route_id
    if (!artistId || !routeId) continue
    if (!artistRoutes.has(artistId)) artistRoutes.set(artistId, [])
    artistRoutes.get(artistId)!.push(routeId)
  }

  const artistMp3s = new Map<string, string[]>()
  for (const link of mp3ArtistLinks.rows) {
    const artistId = link.artist_2020_id
    const mp3Id = link.mp_3_record_id
    if (!artistId || !mp3Id) continue
    if (!artistMp3s.has(artistId)) artistMp3s.set(artistId, [])
    artistMp3s.get(artistId)!.push(mp3Id)
  }

  let created = 0
  let failed = 0
  for (const row of artists.rows) {
    try {
      const filterIds = (artistFilters.get(row.id!) || [])
        .map((oldId) => filterIdMap.get(oldId))
        .filter(Boolean) as number[]

      const dateIds = (artistDates.get(row.id!) || [])
        .map((oldId) => dateIdMap.get(oldId))
        .filter(Boolean) as number[]

      const routeIds = (artistRoutes.get(row.id!) || [])
        .map((oldId) => routeIdMap.get(oldId))
        .filter(Boolean) as number[]

      const recordIds = (artistMp3s.get(row.id!) || [])
        .map((oldId) => mp3IdMap.get(oldId))
        .filter(Boolean) as number[]

      const doc = await payload.create({
        collection: 'artists',
        data: {
          name: row.name || 'Unknown',
          work: unescapeText(row.work) || undefined,
          place: unescapeText(row.place) || undefined,
          latitude: row.latitude ? parseFloat(row.latitude) : undefined,
          longitude: row.longitude ? parseFloat(row.longitude) : undefined,
          genre: row.genre || undefined,
          performance: unescapeText(row.performance) || undefined,
          year: mapYear(row.year) as any,
          city: mapCity(row.city),
          hierarchy: row.hierarchy ? parseInt(row.hierarchy, 10) : 0,
          paid: row.paid === 't',
          filters: filterIds.length > 0 ? filterIds : undefined,
          routes: routeIds.length > 0 ? routeIds : undefined,
          dates: dateIds.length > 0 ? dateIds : undefined,
          records: recordIds.length > 0 ? recordIds : undefined,
          _status: 'published',
        } as any,
        locale: 'sk',
      })

      // Update English locale if available
      // Note: description_work_en is a long description, NOT the artwork title.
      // The `work` field (title) is the same in both locales — no EN column exists.
      const genreEn = row.genre_en || undefined
      const placeEn = unescapeText(row.place_en ?? null)
      const performanceEn = unescapeText(row.performance_en ?? null)
      const enData: Record<string, string | undefined> = {}
      if (genreEn) enData.genre = genreEn
      if (placeEn) enData.place = placeEn
      if (performanceEn) enData.performance = performanceEn
      if (Object.keys(enData).length > 0) {
        await payload.update({
          collection: 'artists',
          id: doc.id,
          data: enData,
          locale: 'en',
        }).catch(() => {})
      }

      artistIdMap.set(row.id!, doc.id as number)
      created++
      if (created % 50 === 0) console.log(`  ... ${created}/${artists.rows.length}`)
    } catch (e: any) {
      failed++
      console.error(`  ✗ Artist ${row.id} (${row.name}): ${e.message}`)
    }
  }
  console.log(`  Done: ${created} created, ${failed} failed`)

  // 6. Migrate Partners
  console.log('\n--- Migrating Partners ---')
  let partnerCount = 0
  for (const row of partners.rows) {
    try {
      await (payload.create as any)({
        collection: 'partners',
        data: {
          name: row.name || 'Unknown',
          category: row.category || 'partner',
          year: mapYear(row.year),
          bratislava: row.bratislava === 't',
          kosice: row.kosice === 't',
          link: row.link || undefined,
        },
      })
      partnerCount++
    } catch (e: any) {
      console.error(`  ✗ Partner ${row.id} (${row.name}): ${e.message}`)
    }
  }
  console.log(`  Done: ${partnerCount} partners created`)

  // 7. Migrate Contacts
  console.log('\n--- Migrating Contacts ---')
  for (const row of contacts.rows) {
    try {
      await payload.create({
        collection: 'contacts',
        data: {
          name: row.name || 'Unknown',
          role: row.role || undefined,
          email: row.email || undefined,
          orderRank: row.order_rank ? parseInt(row.order_rank, 10) : 0,
        },
      })
      console.log(`  ✓ Contact: ${row.name}`)
    } catch (e: any) {
      console.error(`  ✗ Contact ${row.id} (${row.name}): ${e.message}`)
    }
  }

  // 8. Migrate Notifications
  console.log('\n--- Migrating Notifications ---')
  let notifCount = 0
  for (const row of notifications.rows) {
    try {
      await payload.create({
        collection: 'notifications',
        data: {
          title: row.title || 'Notification',
          description: unescapeText(row.description) || undefined,
          city: mapCity(row.city),
          _status: 'published',
        } as any,
      })
      notifCount++
    } catch (e: any) {
      console.error(`  ✗ Notification ${row.id}: ${e.message}`)
    }
  }
  console.log(`  Done: ${notifCount} notifications created`)

  console.log('\n=== Migration complete ===')
  console.log(`Artists: ${created}, Filters: ${filterIdMap.size}, Partners: ${partnerCount}`)
  console.log(`Contacts: ${contacts.rows.length}, Dates: ${dateIdMap.size}, MP3s: ${mp3IdMap.size}`)
  console.log(`Routes: ${routeIdMap.size}, Notifications: ${notifCount}`)
  console.log('\nNote: Media files (images, MP3s) must be uploaded separately.')
  console.log('Use the Payload admin panel to upload and link media to artists/partners.')

  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
