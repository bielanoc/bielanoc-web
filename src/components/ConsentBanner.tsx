'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UI_STRINGS, type Locale } from '@/lib/i18n'
import { useConsent, OPEN_CONSENT_EVENT, PRIVACY_PATH } from '@/lib/useConsent'

// Cookie-consent banner. Shown to every visitor until a choice is stored (no
// geo-gating — hosting-agnostic and maximally compliant). Can be re-opened via
// the footer "Cookie settings" link (OPEN_CONSENT_EVENT). Gates Google
// Analytics (analytics) and Meta Pixel (marketing) in Analytics.tsx.
export function ConsentBanner({ locale = 'sk' }: { locale?: Locale }) {
  const t = UI_STRINGS[locale]
  const { consent, ready, setConsent } = useConsent()
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  // First visit (no stored choice) → show the banner.
  useEffect(() => {
    if (ready && consent === null) setOpen(true)
  }, [ready, consent])

  // Re-open from the footer link, pre-filled with the current choice.
  useEffect(() => {
    const handler = () => {
      setAnalytics(consent?.analytics ?? false)
      setMarketing(consent?.marketing ?? false)
      setShowSettings(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, handler)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handler)
  }, [consent])

  if (!open) return null

  const close = () => {
    setOpen(false)
    setShowSettings(false)
  }
  const acceptAll = () => {
    setConsent({ analytics: true, marketing: true })
    close()
  }
  const rejectAll = () => {
    setConsent({ analytics: false, marketing: false })
    close()
  }
  const savePrefs = () => {
    setConsent({ analytics, marketing })
    close()
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.consentTitle}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-md p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-base font-bold text-white sm:text-lg">{t.consentTitle}</h2>
        <p className="mt-2 text-sm text-white/70">
          {t.consentBody}{' '}
          <Link href={PRIVACY_PATH} className="underline hover:text-white" onClick={close}>
            {t.consentMore}
          </Link>
        </p>

        {showSettings && (
          <div className="mt-4 space-y-3">
            <ConsentRow label={t.consentNecessaryLabel} desc={t.consentNecessaryDesc} checked disabled />
            <ConsentRow
              label={t.consentAnalyticsLabel}
              desc={t.consentAnalyticsDesc}
              checked={analytics}
              onChange={setAnalytics}
            />
            <ConsentRow
              label={t.consentMarketingLabel}
              desc={t.consentMarketingDesc}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={acceptAll}
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-accent-hover"
          >
            {t.consentAcceptAll}
          </button>
          <button
            onClick={rejectAll}
            className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            {t.consentRejectAll}
          </button>
          {showSettings ? (
            <button
              onClick={savePrefs}
              className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              {t.consentSave}
            </button>
          ) : (
            <button
              onClick={() => {
                setAnalytics(consent?.analytics ?? false)
                setMarketing(consent?.marketing ?? false)
                setShowSettings(true)
              }}
              className="rounded px-4 py-2 text-sm text-white/60 underline transition-colors hover:text-white"
            >
              {t.consentCustomize}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ConsentRow({
  label,
  desc,
  checked,
  disabled = false,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 rounded border border-white/10 p-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-color)] disabled:opacity-60"
      />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        <span className="block text-xs text-white/60">{desc}</span>
      </span>
    </label>
  )
}
