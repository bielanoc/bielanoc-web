import { CookieSettingsButton } from './CookieSettingsButton'
import type { Locale } from '@/lib/i18n'

type Props = {
  text?: string | null
  links?: Array<{ label: string; url: string }>
  locale?: Locale
}

export function Footer({ text, links = [], locale = 'sk' }: Props) {
  const displayText = text || `© ${new Date().getFullYear()} Biela Noc`

  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-white/60">
      <p>{displayText}</p>
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {links.map((link, i) => (
          <a key={i} href={link.url} className="hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
        <CookieSettingsButton locale={locale} />
      </div>
    </footer>
  )
}
