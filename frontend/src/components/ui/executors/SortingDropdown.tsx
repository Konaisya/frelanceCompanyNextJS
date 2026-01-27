'use client'

import { ArrowUpDown, Star, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SortingOption {
  value: string
  label: string
  icon: React.ReactNode
}

const sortingOptions: SortingOption[] = [
  { value: 'rating', label: 'По рейтингу', icon: <Star className="w-4 h-4" /> },
  { value: 'popularity', label: 'По популярности', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'newest', label: 'Сначала новые', icon: <Clock className="w-4 h-4" /> },
  { value: 'price_high', label: 'Дорогие услуги', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'price_low', label: 'Дешевые услуги', icon: <DollarSign className="w-4 h-4" /> },
]

interface SortingDropdownProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function SortingDropdown({ value, onChange, className = "" }: SortingDropdownProps) {
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

  const selectedOption = sortingOptions.find(opt => opt.value === value) || sortingOptions[0]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[color-mix(in_srgb,var(--text)_15%,transparent)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-all duration-300"
      >
        <ArrowUpDown className="w-4 h-4 text-[var(--accent)]" />
        <span className="font-medium">Сортировка</span>
        <span className="text-[var(--muted)]">• {selectedOption.label}</span>
        <ArrowUpDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-xl shadow-2xl z-50 overflow-hidden">
          {sortingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                value === option.value
                  ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                  : 'hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)]'
              }`}
            >
              <span className={value === option.value ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>
                {option.icon}
              </span>
              <span className={value === option.value ? 'font-medium' : ''}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}