 
/**
 * Bulk-assign default festival date/time entries to 2025 artists that have none.
 *
 * Creates DateEntry records with default festival hours and links them
 * to artists that currently have no date information.
 *
 * Defaults:
 *   BA: 3.–5. 10. 2025, 19:00–00:00 each night
 *   KE: 10.–12. 10. 2025, 19:00–00:00 each night
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/bulk-assign-dates-2025.ts [--dry-run]
 *
 * Pass --dry-run to preview without making changes.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const DRY_RUN = process.argv.includes('--dry-run')

const FESTIVAL_DATES = {
  ba: {
    dateText: '3.–5. 10. 2025, 19:00–00:00',
    nights: [
      { start: '2025-10-03T19:00:00.000Z', end: '2025-10-04T00:00:00.000Z' },
      { start: '2025-10-04T19:00:00.000Z', end: '2025-10-05T00:00:00.000Z' },
      { start: '2025-10-05T19:00:00.000Z', end: '2025-10-06T00:00:00.000Z' },
    ],
  },
  ke: {
    dateText: '10.–12. 10. 2025, 19:00–00:00',
    nights: [
      { start: '2025-10-10T19:00:00.000Z', end: '2025-10-11T00:00:00.000Z' },
      { start: '2025-10-11T19:00:00.000Z', end: '2025-10-12T00:00:00.000Z' },
      { start: '2025-10-12T19:00:00.000Z', end: '2025-10-13T00:00:00.000Z' },
    ],
  },
} as const

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE RUN'} — Bulk assign dates to 2025 artists\n`)

  const artists = await payload.find({
    collection: 'artists',
    where: { year: { equals: '2025' } },
    limit: 200,
    depth: 1,
    locale: 'sk',
  })

  const withoutDates = artists.docs.filter(
    (a) => !Array.isArray(a.dates) || a.dates.length === 0,
  )

  console.log(`Total 2025 artists: ${artists.docs.length}`)
  console.log(`Without dates: ${withoutDates.length}`)
  console.log()

  let created = 0
  let linked = 0

  for (const artist of withoutDates) {
    const city = artist.city as 'ba' | 'ke'
    const festDates = FESTIVAL_DATES[city]

    if (!festDates) {
      console.log(`  ⚠ [${artist.id}] ${artist.name} — unknown city "${city}", skipping`)
      continue
    }

    console.log(`  [${artist.id}] ${artist.name} (${city.toUpperCase()}) → ${festDates.dateText}`)

    if (DRY_RUN) {
      created++
      linked++
      continue
    }

    // Create a single DateEntry with the summary text and first night's times
    const dateEntry = await payload.create({
      collection: 'date-entries',
      data: {
        dateText: festDates.dateText,
        start: festDates.nights[0].start,
        end: festDates.nights[festDates.nights.length - 1].end,
        display: true,
      },
    })

    // Link to artist
    await payload.update({
      collection: 'artists',
      id: artist.id,
      data: {
        dates: [dateEntry.id],
      },
    })

    created++
    linked++
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  DateEntries created: ${created}`)
  console.log(`  Artists updated: ${linked}`)
  if (DRY_RUN) console.log(`  (no changes made — dry run)`)
  console.log(`${'─'.repeat(60)}\n`)
}

main().then(() => process.exit(0))
