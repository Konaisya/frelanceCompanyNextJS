'use client'

import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  label: string
  icon?: React.ReactNode
  options: FilterOption[]
  selected: string[]
  onChange: (values: string[]) => void
  multiple?: boolean
  className?: string
}

export default function FilterDropdown({
  label,
  icon,
  options,
  selected,
  onChange,
  multiple = true,
  className = ""
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    if (multiple) {
      if (selected.includes(value)) {
        onChange(selected.filter(v => v !== value))
      } else {
        onChange([...selected, value])
      }
    } else {
      onChange([value])
      setIsOpen(false)
    }
  }

  const selectedLabels = selected
    .map(value => options.find(opt => opt.value === value)?.label)
    .filter(Boolean)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
          isOpen
            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]'
            : 'border-[color-mix(in_srgb,var(--text)_15%,transparent)] bg-[var(--card)] hover:border-[var(--accent)]/50'
        }`}
      >
        {icon && <span className="text-[var(--accent)]">{icon}</span>}
        <span className="font-medium">{label}</span>
        {selected.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-text)] text-xs rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]'
                      : 'hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[var(--accent)] border-[var(--accent)]'
                        : 'border-[color-mix(in_srgb,var(--text)_30%,transparent)]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={isSelected ? 'font-medium text-[var(--accent)]' : ''}>
                      {option.label}
                    </span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-sm text-[var(--muted)]">
                      {option.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          
          {multiple && selected.length > 0 && (
            <div className="border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)] p-3">
              <button
                onClick={() => onChange([])}
                className="w-full py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                Сбросить выбор
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}