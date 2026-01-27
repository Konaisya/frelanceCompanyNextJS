'use client'

import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Поиск...',
  className = ''
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-xl bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)] transition-all">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-[var(--muted)]" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-transparent outline-none text-[var(--text)] placeholder:text-[var(--muted)]"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted)]" />
          </button>
        )}
      </div>
    </div>
  )
}
