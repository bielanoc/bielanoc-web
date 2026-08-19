'use client'

import { useState, useEffect, useCallback } from 'react'

// Cookie-consent state. `null` = the visitor has not made a choice yet
// (banner should be shown). Necessary/functional storage is always allowed and
// is not represented here.
export type ConsentState = {
  analytics: boolean
  marketing: boolean
}

const COOKIE_NAME = 'bielanoc-consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

// Broadcast when the stored choice changes so gated components (Analytics) and
// any open banner re-read it without a full page reload.
export const CONSENT_CHANGE_EVENT = 'bielanoc-consent-change'
// Fired by the footer "Cookie settings" link to re-open the banner.
export const OPEN_CONSENT_EVENT = 'bielanoc-open-consent'

// Path to the privacy / cookie policy page (linked from the banner).
export const PRIVACY_PATH = '/ochrana-osobnych-udajov'

function readConsentCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  try {
    const value = decodeURIComponent(match.split('=').slice(1).join('='))
    const parsed = JSON.parse(value)
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing }
  } catch {
    return null
  }
}

function writeConsentCookie(state: ConsentState) {
  const payload = { ...state, ts: Date.now() }
  const value = encodeURIComponent(JSON.stringify(payload))
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export function useConsent() {
  const [consent, setConsentState] = useState<ConsentState | null>(null)
  // `ready` guards against acting before the client has read the cookie, which
  // avoids flashing the banner during hydration for returning visitors.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsentState(readConsentCookie())
    setReady(true)
    const handler = () => setConsentState(readConsentCookie())
    window.addEventListener(CONSENT_CHANGE_EVENT, handler)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler)
  }, [])

  const setConsent = useCallback((state: ConsentState) => {
    writeConsentCookie(state)
    setConsentState(state)
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
  }, [])

  return { consent, ready, setConsent }
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
