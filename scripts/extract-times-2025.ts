/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extract time/date info from 2025 artist descriptions for admin review.
 *
 * Scans all 2025 artists without DateEntry records, looking for schedule
 * information in description text. Outputs a CSV-style report with:
 * - Artist ID, name, city
 * - Extracted time/date text
 * - Context snippet
 * - Admin link to edit the artist
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/extract-times-2025.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const ADMIN_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const TIME_PATTERNS = [
  // "19.00 – 23.00" or "19:00 - 23:00"
  /\d{1,2}[.:]\d{2}\s*[-–]\s*\d{1,2}[.:]\d{2}/g,
  // "o 19.00 h" / "od 19.00 h" / "do 21:00"
  /(?:od?|do)\s+\d{1,2}[.:]\d{2}\s*h?o?d?\.?/gi,
  // "Čas: 21.00" / "čas: 19:00"
  /[Čč]as:\s*\d{1,2}[.:]\d{2}/g,
  // "Začiatok: 19.30" / "Začiatok projekcie: 19.30 h"
  /[Zz]ačiatok[^.]*?\d{1,2}[.:]\d{2}\s*h?o?d?\.?/g,
  // Standalone times like "19.00 h." / "20:00 hod."
  /\b\d{1,2}[.:]\d{2}\s*h(?:od)?\.?/g,
  // Date patterns: "3. 10. 2025" / "03.–05. 10. 2025"
  /\d{1,2}\.?\s*[-–]?\s*(?:\d{1,2}\.)?\s*\d{1,2}\.\s*2025/g,
  // "Piatok, 3. 10. 2025"
  /(?:Piatok|Sobota|Nedeľa|Pondelok|Utorok|Streda|Štvrtok)[,\s]+\d{1,2}\.\s*\d{1,2}\.\s*2025/gi,
  // "Posledný vstup 23:30"
  /[Pp]osledný\s+vstup\s+\d{1,2}[.:]\d{2}/g,
  // "Vstupné" with time
  /[Vv]stupné[^.]{0,50}\d{1,2}[.:]\d{2}/g,
]

function extractText(description: any): string {
  if (!description?.root?.children) return ''
  return description.root.children
    .map((p: any) => (p.children || []).map((c: any) => c.text || '').join(''))
    .join(' ')
}

function findTimeInfo(text: string): { match: string; context: string }[] {
  const results: { match: string; context: string }[] = []
  const seen = new Set<string>()

  for (const pattern of TIME_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags)
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      const key = `${m.index}:${m[0]}`
      if (seen.has(key)) continue
      seen.add(key)

      const start = Math.max(0, m.index - 30)
      const end = Math.min(text.length, m.index + m[0].length + 30)
      results.push({
        match: m[0],
        context: text.substring(start, end).replace(/\n/g, ' '),
      })
    }
  }

  return results
}

async function main() {
  const payload = await getPayload({ config })

  const artists = await payload.find({
    collection: 'artists',
    where: { year: { equals: '2025' } },
    limit: 200,
    depth: 1,
    locale: 'sk',
  })

  console.log(`\n${'='.repeat(80)}`)
  console.log(`  2025 ARTISTS — TIME EXTRACTION REPORT`)
  console.log(`${'='.repeat(80)}\n`)

  const withDates: typeof artists.docs = []
  const withoutDates: typeof artists.docs = []

  for (const a of artists.docs) {
    const hasDates = Array.isArray(a.dates) && a.dates.length > 0
    if (hasDates) withDates.push(a)
    else withoutDates.push(a)
  }

  console.log(`Total 2025 artists: ${artists.docs.length}`)
  console.log(`With DateEntry records: ${withDates.length}`)
  console.log(`Without DateEntry records: ${withoutDates.length}`)
  console.log()

  // Group: artists with time info in description
  const withTimeInDesc: { artist: any; times: { match: string; context: string }[] }[] = []
  const noTimeInfo: any[] = []

  for (const a of withoutDates) {
    const text = extractText(a.description)
    const times = findTimeInfo(text)
    if (times.length > 0) {
      withTimeInDesc.push({ artist: a, times })
    } else {
      noTimeInfo.push(a)
    }
  }

  // Section 1: Artists with extractable time info
  console.log(`\n${'─'.repeat(80)}`)
  console.log(`  SECTION 1: Artists with time info in description (${withTimeInDesc.length})`)
  console.log(`  → These can be turned into DateEntry records`)
  console.log(`${'─'.repeat(80)}\n`)

  for (const { artist, times } of withTimeInDesc) {
    console.log(`  [${artist.id}] ${artist.name} (${artist.city.toUpperCase()})`)
    console.log(`  Edit: ${ADMIN_URL}/admin/collections/artists/${artist.id}`)
    for (const t of times) {
      console.log(`    ⏱  "${t.match}"  →  ...${t.context}...`)
    }
    console.log()
  }

  // Section 2: Artists with NO time info anywhere
  console.log(`\n${'─'.repeat(80)}`)
  console.log(`  SECTION 2: Artists without any time info (${noTimeInfo.length})`)
  console.log(`  → Need manual entry from program/schedule`)
  console.log(`${'─'.repeat(80)}\n`)

  for (const a of noTimeInfo) {
    console.log(`  [${a.id}] ${a.name} (${a.city.toUpperCase()}) — ${ADMIN_URL}/admin/collections/artists/${a.id}`)
  }

  // Section 3: Summary of existing date entries (for reference)
  console.log(`\n${'─'.repeat(80)}`)
  console.log(`  SECTION 3: Already have DateEntry (${withDates.length}) — for reference`)
  console.log(`${'─'.repeat(80)}\n`)

  for (const a of withDates) {
    const dates = a.dates as any[]
    const dateTexts = dates.map((d) => d.dateText || '(no text)').join('; ')
    console.log(`  [${a.id}] ${a.name} (${a.city.toUpperCase()}) — ${dateTexts}`)
  }

  console.log(`\n${'='.repeat(80)}`)
  console.log(`  NEXT STEPS:`)
  console.log(`  1. For Section 1 artists: create DateEntry records in admin using the`)
  console.log(`     extracted times above (dateText field is the human-readable label).`)
  console.log(`  2. For Section 2 artists: check the official festival program/schedule`)
  console.log(`     document and enter times manually.`)
  console.log(`  3. Many Section 2 artists may be "continuous" installations (19:00–00:00)`)
  console.log(`     — a single DateEntry with the festival dates may suffice.`)
  console.log(`${'='.repeat(80)}\n`)
}

main().then(() => process.exit(0))
