/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Split multi-day DateEntries into one-per-night entries.
 *
 * Finds DateEntries where (end - start) > 24 hours, splits them into
 * individual nightly entries, and re-links to the parent artist.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/split-multiday-dates.ts [--dry-run]
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const DRY_RUN = process.argv.includes('--dry-run')

function formatDay(date: Date): string {
  return `${date.getUTCDate()}. ${date.getUTCMonth() + 1}. ${date.getUTCFullYear()}`
}

function formatTime(date: Date): string {
  return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`
}

async function main() {
  const payload = await getPayload({ config })

  console.log(`\n${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE RUN'} — Split multi-day DateEntries\n`)

  const dateEntries = await payload.find({
    collection: 'date-entries',
    limit: 500,
    depth: 0,
  })

  console.log(`Total DateEntries: ${dateEntries.docs.length}`)

  const multiDay = dateEntries.docs.filter((de) => {
    if (!de.start || !de.end) return false
    const start = new Date(de.start)
    const end = new Date(de.end)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return hours > 24
  })

  console.log(`Multi-day entries to split: ${multiDay.length}\n`)

  if (multiDay.length === 0) {
    console.log('Nothing to do.')
    return
  }

  const artists = await payload.find({
    collection: 'artists',
    where: { year: { equals: '2025' } },
    limit: 300,
    depth: 1,
    locale: 'sk',
  })

  console.log(`2025 artists loaded: ${artists.docs.length}\n`)

  let totalSplit = 0
  let totalCreated = 0

  for (const de of multiDay) {
    const start = new Date(de.start!)
    const end = new Date(de.end!)
    const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    const startHour = start.getUTCHours()
    const startMin = start.getUTCMinutes()
    const endHour = end.getUTCHours()
    const endMin = end.getUTCMinutes()

    // Calculate number of nights by counting distinct calendar days at start time
    // e.g., Oct 10 19:00 → Oct 13 00:00 = 3 nights (Oct 10, 11, 12 starting at 19:00)
    const startDay = Math.floor(start.getTime() / (1000 * 60 * 60 * 24))
    const endDay = Math.floor(end.getTime() / (1000 * 60 * 60 * 24))
    const numNights = endHour <= startHour ? (endDay - startDay) : (endDay - startDay + 1)

    console.log(`--- DateEntry #${de.id}: "${de.dateText}"`)
    console.log(`    ${start.toISOString()} → ${end.toISOString()} (${totalHours}h, ~${numNights} nights)`)
    console.log(`    Nightly: ${formatTime(start)} – ${formatTime(end)}`)

    // Find artist(s) that reference this date entry
    const linkedArtists = artists.docs.filter((a: any) =>
      Array.isArray(a.dates) && a.dates.some((d: any) =>
        (typeof d === 'object' ? d.id : d) === de.id
      )
    )

    if (linkedArtists.length === 0) {
      console.log(`    ⚠ No artist linked — skipping`)
      continue
    }

    console.log(`    Linked to: ${linkedArtists.map((a: any) => a.name).join(', ')}`)

    // Generate per-night entries
    const nightEntries: { start: string; end: string; dateText: string }[] = []
    for (let i = 0; i < numNights; i++) {
      const nightStart = new Date(start)
      nightStart.setUTCDate(nightStart.getUTCDate() + i)

      const nightEnd = new Date(nightStart)
      if (endHour <= startHour) {
        nightEnd.setUTCDate(nightEnd.getUTCDate() + 1)
      }
      nightEnd.setUTCHours(endHour, endMin, 0, 0)

      const dateText = `${formatDay(nightStart)}, ${formatTime(nightStart)}–${formatTime(nightEnd)}`
      nightEntries.push({
        start: nightStart.toISOString(),
        end: nightEnd.toISOString(),
        dateText,
      })
    }

    console.log(`    Splitting into ${nightEntries.length} entries:`)
    nightEntries.forEach((ne, i) => {
      console.log(`      [${i + 1}] ${ne.dateText} | ${ne.start} → ${ne.end}`)
    })

    if (DRY_RUN) {
      totalSplit++
      totalCreated += nightEntries.length - 1
      console.log(`    (dry run — no changes made)\n`)
      continue
    }

    // Update original entry to first night
    await payload.update({
      collection: 'date-entries',
      id: de.id,
      data: {
        dateText: nightEntries[0].dateText,
        start: nightEntries[0].start,
        end: nightEntries[0].end,
      },
    })
    console.log(`    ✓ Updated original #${de.id} → night 1`)

    // Create new entries for remaining nights
    const newIds: number[] = []
    for (let i = 1; i < nightEntries.length; i++) {
      const created = await payload.create({
        collection: 'date-entries',
        data: {
          dateText: nightEntries[i].dateText,
          start: nightEntries[i].start,
          end: nightEntries[i].end,
          display: true,
        },
      })
      newIds.push(created.id as number)
      console.log(`    ✓ Created #${created.id} → night ${i + 1}`)
    }

    // Update each linked artist's dates array
    for (const artist of linkedArtists) {
      const existingDateIds = ((artist as any).dates || []).map((d: any) =>
        typeof d === 'object' ? d.id : d
      )
      const updatedDates = [...existingDateIds, ...newIds]
      await payload.update({
        collection: 'artists',
        id: artist.id,
        data: { dates: updatedDates } as any,
      })
      console.log(`    ✓ Updated artist "${artist.name}" dates: [${updatedDates.join(', ')}]`)
    }

    totalSplit++
    totalCreated += newIds.length
    console.log('')
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  Entries split: ${totalSplit}`)
  console.log(`  New entries created: ${totalCreated}`)
  if (DRY_RUN) console.log(`  (no changes made — dry run)`)
  console.log(`${'─'.repeat(60)}\n`)
}

main().then(() => process.exit(0))
