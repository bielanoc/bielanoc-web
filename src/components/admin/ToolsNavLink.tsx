'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function ToolsNavLink() {
  const pathname = usePathname()
  const isActive = pathname?.startsWith('/admin/tools')

  return (
    <div style={{
      padding: '0.5rem 1.25rem',
      borderTop: '1px solid var(--theme-elevation-150, #e5e7eb)',
      marginTop: '0.5rem',
      paddingTop: '1rem',
    }}>
      <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--theme-elevation-400, #999)', fontWeight: 600 }}>
        Tools
      </span>
      <Link
        href="/admin/tools/date-review"
        style={{
          display: 'block',
          padding: '0.4rem 0',
          marginTop: '0.25rem',
          fontSize: '0.8125rem',
          textDecoration: 'none',
          color: isActive ? 'var(--theme-text, #000)' : 'var(--theme-elevation-500, #666)',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        Date Review
      </Link>
    </div>
  )
}
