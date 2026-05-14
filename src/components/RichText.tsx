import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(node: any): string {
  if (!node) return ''
  if (node.text) return node.text
  if (node.root) return extractText(node.root)
  if (node.children) return node.children.map(extractText).join('\n\n')
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function containsHtml(content: any): boolean {
  const text = extractText(content)
  return /<[a-z][\s\S]*?>/i.test(text)
}

function lexicalToHtml(content: { root?: { children?: { children?: { text?: string }[] }[] } }): string {
  if (!content?.root?.children) return ''
  return content.root.children
    .map((paragraph) => {
      const text = paragraph.children?.map((child) => child.text || '').join('') || ''
      return `<p>${text.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}

export function RichText({ content }: Props) {
  if (!content) return null

  if (containsHtml(content)) {
    return (
      <div
        className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-[#8ebc35] prose-strong:text-white [&_a]:text-[#8ebc35] [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: lexicalToHtml(content) }}
      />
    )
  }

  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-[#8ebc35] prose-strong:text-white">
      <PayloadRichText data={content} />
    </div>
  )
}
