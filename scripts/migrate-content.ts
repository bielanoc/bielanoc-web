/**
 * Migrate content for globals from old Strapi data into Payload CMS.
 *
 * Migrates:
 * - Practical Info (6.19) — from components_info_sections + info_bas_components + info_kes_components
 * - Volunteers (6.20) — from dobrovolnici_bas + dobrovolnici_kes
 * - Ticket Settings (6.21) — from tickets table
 * - About Page (6.22) — from old frontend locale files (hardcoded below)
 * - Support Us (6.22) — from supportuses table
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/migrate-content.ts path/to/dump.sql
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

function markdownToLexical(markdown: string): any {
  const lines = markdown.split('\n')
  const children: any[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // Headings
    const h2Match = line.match(/^## (.+)/)
    const h1Match = line.match(/^# (.+)/)
    if (h1Match) {
      children.push({
        type: 'heading',
        tag: 'h1',
        children: parseInlineText(h1Match[1]),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      i++
      continue
    }
    if (h2Match) {
      children.push({
        type: 'heading',
        tag: 'h2',
        children: parseInlineText(h2Match[1]),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })
      i++
      continue
    }

    // List items (- item)
    if (line.match(/^- /)) {
      const listItems: any[] = []
      while (i < lines.length && lines[i].match(/^- /)) {
        const text = lines[i].replace(/^- /, '')
        listItems.push({
          type: 'listitem',
          children: parseInlineText(text),
          direction: 'ltr',
          format: '',
          indent: 0,
          value: listItems.length + 1,
          version: 1,
        })
        i++
      }
      children.push({
        type: 'list',
        listType: 'bullet',
        children: listItems,
        direction: 'ltr',
        format: '',
        indent: 0,
        start: 1,
        tag: 'ul',
        version: 1,
      })
      continue
    }

    // Regular paragraph — collect until empty line
    let paragraphLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^#{1,2} /) && !lines[i].match(/^- /)) {
      paragraphLines.push(lines[i])
      i++
    }
    const paragraphText = paragraphLines.join('\n')
    children.push({
      type: 'paragraph',
      children: parseInlineText(paragraphText),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function parseInlineText(text: string): any[] {
  // Handle markdown links [text](url)
  const parts: any[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index)
      if (before) parts.push(...formatText(before))
    }
    parts.push({
      type: 'link',
      children: [{ type: 'text', text: match[1], version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      fields: { url: match[2], newTab: false, linkType: 'custom' },
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex)
    if (remaining) parts.push(...formatText(remaining))
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', text: '', version: 1 })
  }

  return parts
}

function formatText(text: string): any[] {
  // Handle **bold**
  const parts: any[] = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index), version: 1 })
    }
    parts.push({ type: 'text', text: match[1], format: 1, version: 1 })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex), version: 1 })
  }

  return parts.length > 0 ? parts : [{ type: 'text', text, version: 1 }]
}

function htmlToLexical(html: string): any {
  // Strip HTML tags, keep text content, convert <p> to paragraphs
  const paragraphs = html
    .split(/<\/p>\s*<p>|<p>|<\/p>/)
    .map((p) => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        children: parseInlineText(p),
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

// About page content from old frontend locales
const ABOUT_SK = `# Najväčší a najnavštevovanejší festival súčasného umenia na Slovensku.

Biela noc je prestížny medzinárodný projekt, ktorého cieľom je priblížiť verejnosti súčasné formy umenia ako aj netradičné, nepoznané alebo významné miesta európskych metropol.

Podujatie vzniklo v roku 2002 v Paríži a v roku 2013 ho navštívilo už viac ako dva a pol milióna ľudí. Z Paríža sa rýchlo rozšírilo do ďalších krajín, vrátane miest ako New York, Los Angeles, Chicago, Miami, Santa Monica, Montreal, Toronto, Rím, Tel Aviv, Gaza, Jeruzalem, Madrid, Brusel, Riga, Bukurešť, Amsterdam, Brighton, Turín, Naples, Petrohrad, ale aj Košice a Bratislava.

Na Slovensku mala Biela noc premiéru v Košiciach a po piatich úspešných ročníkoch na východnom Slovensku sa rozšírila do hlavného mesta spájajúc východ a západ krajiny súčasným umením.

## Ciele Bielej noci

- podporovať a šíriť súčasné formy umenia
- podnietiť záujem širokej verejnosti o súčasné umenie
- podporiť tvorbu domácich a zahraničných umelcov a vznik nových kvalitných umeleckých diel
- priniesť do Košíc a Bratislavy svetovú umeleckú špičku
- podporiť kultúrny turizmus mesta
- podporiť rozvoj kreatívneho priemyslu v meste
- zviditeľniť netradičné, nepoznané, ale aj významné miesta Košíc a Bratislavy
- spojiť prostredníctvom umenia Košice a Bratislavu so svetovými metropolami, ktoré sú nositeľmi tejto prestížnej značky WHITE NIGHT
- edukovať publikum každej vekovej kategórie
- šíriť interpretáciu umenia pre detského diváka
- podporiť rozvoj dobrovoľníctva a kultúrnej mediácie
- podporiť participačné umelecké a sociálne projekty pre sociálne alebo zdravotne znevýhodnené skupiny ľudí

## Priebeh Bielej noci

Biela noc ponúka návštevníkom netradičnú umeleckú prechádzku nočným mestom plnú zážitkov a nových vnemov, ktorá trvá od západu až do východu slnka. Počas jedného výnimočného víkendu sa noc stáva dňom a ulice nočného mesta sa zaplnia ľuďmi a umením. Každý návštevník dostane umeleckú mapku, ktorá ho bude sprevádzať rôznymi umeleckými zastávkami: vizuálne atraktívnymi inštaláciami, koncertmi, filmami, rozličnými divadelnými predstaveniami, tancom, literatúrou, performance… Pestrá ponuka rozličných umeleckých žánrov zaručí každému spoznať najnovšie trendy v rozličných umeleckých disciplínach. Popri umení návštevníci objavia zaujímavé priestory, ktoré výnimočne prichýlia súčasné formy umenia ako napríklad nádvoria, parky, stanice, mosty, nábrežia, metrá, plavárne, nákupné centrá, parkoviská, súkromné priestory a rôzne ľuďom bežne neprístupné miesta.`

const ABOUT_EN = `# The largest and most visited contemporary art festival in Slovakia.

Biela noc is a prestigious international project that aims to bring contemporary art forms as well as unconventional, unfamiliar or significant places in European capitals closer to the public.

The event was founded in 2002 in Paris and in 2013 it has already been visited by more than two and a half million people. From Paris, it quickly spread to other countries, including cities such as New York, Los Angeles, Chicago, Miami, Santa Monica, Montreal, Toronto, Rome, Tel Aviv, Gaza, Jerusalem, Madrid, Brussels, Riga, Bucharest, Amsterdam, Brighton, Turin, Naples, St. Petersburg, as well as Košice and Bratislava.

In Slovakia, Biela noc had its premiere in Košice and after five successful editions in eastern Slovakia, it expanded to the capital, connecting the east and west of the country through contemporary art.

## Goals of the Biela noc

- to promote and disseminate contemporary art forms
- to stimulate the interest of the general public in contemporary art
- to support the work of local and foreign artists and the creation of new quality works of art
- to bring world artistic excellence to Košice and Bratislava
- to promote cultural tourism in the city
- to support the development of creative industries in the city
- to make unconventional, unknown, but also important places of Košice and Bratislava more visible
- to connect through art Košice and Bratislava with the world's metropolises, which are the bearers of this prestigious WHITE NIGHT brand
- to educate audiences of all ages
- to disseminate the interpretation of art for children's audiences
- encourage the development of volunteering and cultural mediation
- to support participatory artistic and social projects for socially or medically disadvantaged groups of people

## The course of the White Night

Biela noc offers visitors an unusual artistic walk through the city at night, full of experiences and new sensations, which lasts from sunset to sunrise. For one extraordinary weekend, night becomes day and the streets of the night city are filled with people and art. Each visitor will be given an art map that will guide them through the various artistic stops: visually appealing installations, concerts, films, various theatrical performances, dance, literature, performance… The varied offer of different artistic genres will guarantee that everyone will get to know the latest trends in different artistic disciplines. Alongside art, visitors will discover interesting spaces that exceptionally attract contemporary art forms such as courtyards, parks, stations, bridges, quays, subways, swimming pools, shopping malls, car parks, private spaces and various places normally inaccessible to people.`

async function main() {
  const dumpPath = process.argv[2]
  if (!dumpPath) {
    console.error('Usage: node --env-file=.env.local --import tsx scripts/migrate-content.ts <path-to-dump.sql>')
    process.exit(1)
  }

  const sql = fs.readFileSync(dumpPath, 'utf-8')
  const payload = await getPayload({ config })

  // =========================================================
  // 1. PRACTICAL INFO (6.19)
  // =========================================================
  console.log('\n=== Migrating Practical Info ===')

  const infoSections = parseCopyBlock(sql, 'components_info_sections')
  const infoBAComponents = parseCopyBlock(sql, 'info_bas_components')
  const infoKEComponents = parseCopyBlock(sql, 'info_kes_components')

  // Map component_id -> section data
  const sectionMap = new Map<string, Row>()
  for (const row of infoSections.rows) {
    if (row.id) sectionMap.set(row.id, row)
  }

  // Build BA sections in order
  const baSectionIds = infoBAComponents.rows
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((r) => r.component_id!)

  const sectionsBA = baSectionIds
    .map((id) => sectionMap.get(id))
    .filter(Boolean)
    .map((row) => ({
      title: unescapeText(row!.title) || '',
      text: markdownToLexical(unescapeText(row!.text) || ''),
    }))

  // Build KE sections in order
  const keSectionIds = infoKEComponents.rows
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .map((r) => r.component_id!)

  const sectionsKE = keSectionIds
    .map((id) => sectionMap.get(id))
    .filter(Boolean)
    .map((row) => ({
      title: unescapeText(row!.title) || '',
      text: markdownToLexical(unescapeText(row!.text) || ''),
    }))

  const savedInfo = await payload.updateGlobal({
    slug: 'practical-info',
    locale: 'sk',
    data: {
      sectionsBA,
      sectionsKE,
    },
  })

  // Now set EN locale titles/text — include item IDs so Payload updates in place
  const sectionsBA_EN = baSectionIds
    .map((id) => sectionMap.get(id))
    .filter(Boolean)
    .map((row, idx) => ({
      id: savedInfo.sectionsBA?.[idx]?.id,
      title: unescapeText(row!.title_en) || unescapeText(row!.title) || '',
      text: markdownToLexical(unescapeText(row!.text_en) || unescapeText(row!.text) || ''),
    }))

  const sectionsKE_EN = keSectionIds
    .map((id) => sectionMap.get(id))
    .filter(Boolean)
    .map((row, idx) => ({
      id: savedInfo.sectionsKE?.[idx]?.id,
      title: unescapeText(row!.title_en) || unescapeText(row!.title) || '',
      text: markdownToLexical(unescapeText(row!.text_en) || unescapeText(row!.text) || ''),
    }))

  await payload.updateGlobal({
    slug: 'practical-info',
    locale: 'en',
    data: {
      sectionsBA: sectionsBA_EN,
      sectionsKE: sectionsKE_EN,
    },
  })

  console.log(`  ✓ Practical Info: ${sectionsBA.length} BA sections, ${sectionsKE.length} KE sections`)

  // =========================================================
  // 2. VOLUNTEERS (6.20)
  // =========================================================
  console.log('\n=== Migrating Volunteers ===')

  const volunteersBA = parseCopyBlock(sql, 'dobrovolnici_bas')
  const volunteersKE = parseCopyBlock(sql, 'dobrovolnici_kes')

  const volBAText = unescapeText(volunteersBA.rows[0]?.text) || ''
  const volKEText = unescapeText(volunteersKE.rows[0]?.text) || ''

  // Strip markdown image references and HTML tags like <a> and <br>
  const cleanVolText = (text: string) => {
    return text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // remove markdown images
      .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1') // keep link text, remove <a> tags
      .replace(/<br\s*\/?>/g, '\n') // convert <br> to newline
      .trim()
  }

  await payload.updateGlobal({
    slug: 'volunteers',
    locale: 'sk',
    data: {
      contentBA: markdownToLexical(cleanVolText(volBAText)),
      contentKE: markdownToLexical(cleanVolText(volKEText)),
    },
  })

  console.log(`  ✓ Volunteers: BA (${volBAText.length} chars), KE (${volKEText.length} chars)`)

  // =========================================================
  // 3. TICKET SETTINGS (6.21)
  // =========================================================
  console.log('\n=== Migrating Ticket Settings ===')

  const tickets = parseCopyBlock(sql, 'tickets')
  const ticket = tickets.rows[0]

  if (ticket) {
    const baText = unescapeText(ticket.ba_text) || ''
    const keText = unescapeText(ticket.ke_text) || ''

    await payload.updateGlobal({
      slug: 'ticket-settings',
      locale: 'sk',
      data: {
        saleEnabled: ticket.sale_enabled === 't',
        linkBA: ticket.ba_link || '',
        linkKE: ticket.ke_link || '',
        textBA: markdownToLexical(baText),
        textKE: markdownToLexical(keText),
      },
    })

    console.log(`  ✓ Tickets: sale=${ticket.sale_enabled === 't'}, BA link=${ticket.ba_link}, KE link=${ticket.ke_link}`)
  }

  // =========================================================
  // 4. ABOUT PAGE (6.22)
  // =========================================================
  console.log('\n=== Migrating About Page ===')

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'sk',
    data: {
      content: markdownToLexical(ABOUT_SK),
    },
  })

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      content: markdownToLexical(ABOUT_EN),
    },
  })

  console.log(`  ✓ About Page: SK + EN`)

  // =========================================================
  // 5. SUPPORT US (6.22)
  // =========================================================
  console.log('\n=== Migrating Support Us ===')

  const supportUs = parseCopyBlock(sql, 'supportuses')
  const support = supportUs.rows[0]

  if (support) {
    const contentSK = unescapeText(support.content) || ''
    const contentEN = unescapeText(support.content_en) || ''

    await payload.updateGlobal({
      slug: 'support-us',
      locale: 'sk',
      data: {
        content: markdownToLexical(contentSK),
      },
    })

    if (contentEN) {
      await payload.updateGlobal({
        slug: 'support-us',
        locale: 'en',
        data: {
          content: markdownToLexical(contentEN),
        },
      })
    }

    console.log(`  ✓ Support Us: SK (${contentSK.length} chars), EN (${contentEN.length} chars)`)
  }

  // =========================================================
  console.log('\n✅ All content migrated successfully!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
