'use client'

import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

export const ColorPicker: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const color = value || '#000000'

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
          {field.label as string}
        </label>
      )}
      {field.admin?.description && (
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', marginTop: 0 }}>
          {field.admin.description as string}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="color"
          value={color as string}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '42px',
            height: '42px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: 0,
            background: 'transparent',
          }}
        />
        <input
          type="text"
          value={(value as string) || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid var(--theme-elevation-150, #d1d5db)',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            width: '120px',
            background: 'var(--theme-input-bg, #fff)',
            color: 'var(--theme-text, #000)',
          }}
        />
      </div>
    </div>
  )
}
