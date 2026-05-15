type Props = {
  text?: string | null
  links?: Array<{ label: string; url: string }>
}

export function Footer({ text, links = [] }: Props) {
  const displayText = text || `© ${new Date().getFullYear()} Biela Noc`

  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-white/40">
      <p>{displayText}</p>
      {links.length > 0 && (
        <div className="flex justify-center gap-4 mt-3">
          {links.map((link, i) => (
            <a key={i} href={link.url} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  )
}
