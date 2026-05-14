/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Migrate DateEntries from the relationship table into inline dates array on Artists.
 *
 * This script uses raw SQL to read the old relationship data and Payload API
 * to write the new inline dates array.
 *
 * Must be run AFTER the new schema is pushed (artists_dates table exists).
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/migrate-dates-inline.ts [--dry-run]
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const DRY_RUN = process.argv.includes('--dry-run')

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE RUN'} — Migrate DateEntries to inline dates\n`)

  // Read old relationship data via raw SQL
  const db = (payload.db as any).drizzle
  if (!db) {
    // Fallback: use pool directly
    console.error('Cannot access drizzle instance')
    process.exit(1)
  }

  // Get all artists and their linked date-entry IDs from the relationship table
  const relRows: any[] = await db.execute(
    `SELECT ar.parent_id as artist_id, ar."date_entries_id" as date_entry_id
     FROM artists_rels ar
     WHERE ar."date_entries_id" IS NOT NULL
     ORDER BY ar.parent_id, ar."order"`
  )

  console.log(`Found ${relRows.length} artist→date-entry relationships`)

  if (relRows.length === 0) {
    console.log('No relationships found — maybe already migrated or table empty.')
    return
  }

  // Get all date entries
  const dateRows: any[] = await db.execute(
    `SELECT id, start, "end", display FROM date_entries`
  )

  const dateMap = new Map<number, { start: string | null; end: string | null; display: boolean }>()
  for (const row of dateRows) {
    dateMap.set(row.id, {
      start: row.start ? new Date(row.start).toISOString() : null,
      end: row.end ? new Date(row.end).toISOString() : null,
      display: row.display !== false,
    })
  }

  console.log(`Loaded ${dateMap.size} date entries\n`)

  // Group by artist
  const artistDates = new Map<number, { start: string | null; end: string | null; display: boolean }[]>()
  for (const rel of relRows) {
    const artistId = rel.artist_id
    const dateEntry = dateMap.get(rel.date_entry_id)
    if (!dateEntry) continue

    if (!artistDates.has(artistId)) {
      artistDates.set(artistId, [])
    }
    artistDates.get(artistId)!.push(dateEntry)
  }

  console.log(`Artists with dates to migrate: ${artistDates.size}\n`)

  let migrated = 0
  for (const [artistId, dates] of artistDates) {
    const inlineDates = dates.map((d) => ({
      start: d.start,
      end: d.end,
      display: d.display,
    }))

    if (!DRY_RUN) {
      await payload.update({
        collection: 'artists',
        id: artistId,
        data: { dates: inlineDates } as any,
      })
    }

    migrated++
    if (migrated <= 10 || migrated % 20 === 0) {
      console.log(`  [${artistId}] ${inlineDates.length} dates migrated`)
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  Artists migrated: ${migrated}`)
  if (DRY_RUN) console.log(`  (no changes made — dry run)`)
  console.log(`${'─'.repeat(60)}\n`)
}

main().then(() => process.exit(0))
