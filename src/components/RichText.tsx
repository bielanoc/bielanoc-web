import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

export function RichText({ content }: Props) {
  if (!content) return null
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-white/70 prose-a:text-[#8ebc35] prose-strong:text-white">
      <PayloadRichText data={content} />
    </div>
  )
}
