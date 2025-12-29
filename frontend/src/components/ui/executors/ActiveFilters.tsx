'use client'

import { X, Filter } from 'lucide-react'

interface FilterTag {
  id: string
  label: string
  onRemove: () => void
}

interface ActiveFiltersProps {
  filters: FilterTag[]
  onClearAll: () => void
  className?: string
}

export default function ActiveFilters({ filters, onClearAll, className = "" }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <Filter className="w-4 h-4" />
        <span>Активные фильтры:</span>
      </div>
      
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-2 px-3 py-1.5 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] rounded-full text-sm"
        >
          <span>{filter.label}</span>
          <button
            onClick={filter.onRemove}
            className="p-0.5 hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          Очистить все
        </button>
      )}
    </div>
  )
}