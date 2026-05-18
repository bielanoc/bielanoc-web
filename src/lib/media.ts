const S3_URL = process.env.NEXT_PUBLIC_S3_URL

export function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { filename?: string; url?: string }
  if (m.filename) return `${S3_URL}/${m.filename}`
  if (m.url) return m.url
  return null
}

export function getMediaSrc(media: { filename?: string | null; url?: string | null } | null | undefined): string | null {
  if (!media) return null
  if (media.filename) return `${S3_URL}/${media.filename}`
  if (media.url) return media.url
  return null
}
