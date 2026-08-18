import { revalidatePath } from 'next/cache'

// revalidatePath throws ("static generation store missing") when called outside
// a Next.js request context — e.g. from a standalone seed/maintenance script.
// In that case there is no page cache to revalidate, so it is safe to ignore.
function safeRevalidate(path: string, type: 'page' | 'layout') {
  try {
    revalidatePath(path, type)
  } catch {
    // Not in a request context (script/CLI); nothing to revalidate.
  }
}

export function revalidateArtistPages(year?: string, city?: string) {
  if (year && city) {
    safeRevalidate(`/y${year}/${city}/umelci`, 'page')
    safeRevalidate(`/y${year}/${city}/mapa`, 'page')
  }
  safeRevalidate('/', 'layout')
}

export function revalidatePartnerPages(year?: string, city?: string) {
  if (year && city) {
    safeRevalidate(`/y${year}/${city}/partneri`, 'page')
  }
  safeRevalidate('/', 'layout')
}

export function revalidateGlobalPages() {
  safeRevalidate('/', 'layout')
}
