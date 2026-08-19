'use client'

import { openConsentSettings } from '@/lib/useConsent'
import { UI_STRINGS, type Locale } from '@/lib/i18n'

// Re-opens the consent banner so visitors can change their choice later
// (withdrawing consent must be as easy as giving it). Rendered in the footer.
export function CookieSettingsButton({ locale = 'sk' }: { locale?: Locale }) {
  const t = UI_STRINGS[locale]
  return (
    <button onClick={openConsentSettings} className="hover:text-white transition-colors">
      {t.cookieSettings}
    </button>
  )
}
