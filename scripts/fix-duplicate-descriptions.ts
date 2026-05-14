/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fix duplicate descriptions in artists.
 *
 * The migrate-descriptions.ts script concatenated description_artist + description_work
 * into one field. For some artists these contained the same text, resulting in duplication.
 * This script detects and removes duplicate paragraphs in artist descriptions.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/fix-duplicate-descriptions.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

function getLexicalText(node: any): string {
  if (!node) return ''
  if (node.text) return node.text
  if (node.children) return node.children.map(getLexicalText).join('')
  return ''
}

function getParagraphs(description: any): string[] {
  if (!description?.root?.children) return []
  return description.root.children.map((child: any) => getLexicalText(child).trim()).filter(Boolean)
}

function deduplicateLexical(description: any): { deduplicated: any; wasDuplicate: boolean } {
  if (!description?.root?.children) return { deduplicated: description, wasDuplicate: false }

  const children = description.root.children as any[]
  const paragraphs = children.map((child: any) => getLexicalText(child).trim())

  const totalText = paragraphs.join('\n')
  const halfLen = Math.floor(totalText.length / 2)

  const firstHalf = totalText.substring(0, halfLen).trim()
  const secondHalf = totalText.substring(halfLen).trim()

  // Check if first half ≈ second half (fuzzy: allow minor differences)
  if (firstHalf.length > 100 && secondHalf.length > 100) {
    const similarity = firstHalf.substring(0, 200) === secondHalf.substring(0, 200)
    if (similarity) {
      // Keep only the first half of children
      const halfChildren = Math.ceil(children.length / 2)
      return {
        deduplicated: {
          ...description,
          root: {
            ...description.root,
            children: children.slice(0, halfChildren),
          },
        },
        wasDuplicate: true,
      }
    }
  }

  // Also check paragraph-level duplication
  const seen = new Set<string>()
  const uniqueChildren: any[] = []
  let hadDuplicates = false

  for (let i = 0; i < children.length; i++) {
    const text = paragraphs[i]
    if (text && seen.has(text)) {
      hadDuplicates = true
      continue
    }
    if (text) seen.add(text)
    uniqueChildren.push(children[i])
  }

  if (hadDuplicates) {
    return {
      deduplicated: {
        ...description,
        root: {
          ...description.root,
          children: uniqueChildren,
        },
      },
      wasDuplicate: true,
    }
  }

  return { deduplicated: description, wasDuplicate: false }
}

async function main() {
  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })

  for (const locale of ['sk', 'en'] as const) {
    console.log(`\n--- Checking ${locale.toUpperCase()} descriptions ---`)
    const allArtists = await payload.find({
      collection: 'artists',
      limit: 500,
      depth: 0,
      locale,
    })

    let fixed = 0
    for (const artist of allArtists.docs) {
      if (!artist.description) continue

      const { deduplicated, wasDuplicate } = deduplicateLexical(artist.description)
      if (wasDuplicate) {
        await payload.update({
          collection: 'artists',
          id: artist.id,
          data: { description: deduplicated } as any,
          locale,
        })
        fixed++
        console.log(`  Fixed: ${artist.name} (${artist.year}/${artist.city})`)
      }
    }
    console.log(`  Total fixed (${locale}): ${fixed}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

main()
