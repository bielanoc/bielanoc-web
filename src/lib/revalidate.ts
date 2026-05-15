import { revalidatePath } from 'next/cache'

export function revalidateArtistPages(year?: string, city?: string) {
  if (year && city) {
    revalidatePath(`/y${year}/${city}/umelci`, 'page')
    revalidatePath(`/y${year}/${city}/program`, 'page')
    revalidatePath(`/y${year}/${city}/mapa`, 'page')
  }
  revalidatePath('/', 'layout')
}

export function revalidatePartnerPages(year?: string, city?: string) {
  if (year && city) {
    revalidatePath(`/y${year}/${city}/partneri`, 'page')
  }
  revalidatePath('/', 'layout')
}

export function revalidateGlobalPages() {
  revalidatePath('/', 'layout')
}
