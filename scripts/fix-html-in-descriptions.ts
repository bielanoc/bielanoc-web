/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fix raw HTML in artist descriptions.
 *
 * The migrate-descriptions.ts stored raw HTML (e.g. <a href="...">text</a>) as plain text.
 * This script parses HTML links and converts them to proper Lexical link nodes.
 * Other HTML tags are stripped.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx scripts/fix-html-in-descriptions.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

function hasHtml(text: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(text)
}

function parseTextWithLinks(text: string): any[] {
  const children: any[] = []
  const linkRegex = /<a\s[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    // Text before the link
    const before = text.substring(lastIndex, match.index)
    if (before.trim()) {
      const cleaned = stripTags(before).trim()
      if (cleaned) {
        children.push({ type: 'text', text: cleaned, version: 1 })
      }
    }

    // The link itself
    const href = match[1]
    const linkText = stripTags(match[2]).trim()
    if (linkText && href) {
      children.push({
        type: 'link',
        children: [{ type: 'text', text: linkText, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 3,
        fields: {
          linkType: 'custom',
          newTab: true,
          url: href,
        },
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text after last link
  const after = text.substring(lastIndex)
  if (after.trim()) {
    const cleaned = stripTags(after).trim()
    if (cleaned) {
      children.push({ type: 'text', text: cleaned, version: 1 })
    }
  }

  return children.length > 0 ? children : [{ type: 'text', text: stripTags(text).trim(), version: 1 }]
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')
}

function fixLexicalNode(node: any): { fixed: any; changed: boolean } {
  if (!node?.root?.children) return { fixed: node, changed: false }

  let changed = false
  const newChildren: any[] = []

  for (const child of node.root.children) {
    if (child.type === 'paragraph' && child.children) {
      const newParagraphChildren: any[] = []

      for (const textNode of child.children) {
        if (textNode.type === 'text' && textNode.text && hasHtml(textNode.text)) {
          changed = true
          const parsed = parseTextWithLinks(textNode.text)
          newParagraphChildren.push(...parsed)
        } else {
          newParagraphChildren.push(textNode)
        }
      }

      newChildren.push({
        ...child,
        children: newParagraphChildren,
      })
    } else {
      newChildren.push(child)
    }
  }

  return {
    fixed: { ...node, root: { ...node.root, children: newChildren } },
    changed,
  }
}

async function main() {
  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })

  for (const locale of ['sk', 'en'] as const) {
    console.log(`\n--- Fixing HTML in ${locale.toUpperCase()} descriptions ---`)
    const all = await payload.find({ collection: 'artists', limit: 500, depth: 0, locale })

    let fixed = 0
    for (const artist of all.docs) {
      if (!artist.description) continue

      const { fixed: fixedDesc, changed } = fixLexicalNode(artist.description)
      if (changed) {
        await payload.update({
          collection: 'artists',
          id: artist.id,
          data: { description: fixedDesc } as any,
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
