import { cookies } from 'next/headers'

export { UI_STRINGS, DEFAULT_LOCALE } from './i18n'
export type { Locale } from './i18n'

export async function getLocale(): Promise<'sk' | 'en'> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value
  if (locale === 'en') return 'en'
  return 'sk'
}
