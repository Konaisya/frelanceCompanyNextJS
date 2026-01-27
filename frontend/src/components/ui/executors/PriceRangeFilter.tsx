'use client'

import { DollarSign, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface PriceRangeFilterProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export default function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
  className = ""
}: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onChange(localValue)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [localValue, onChange])


  const handleApply = () => {
    onChange(localValue)
    setIsOpen(false)
  }

  const handleReset = () => {
    const resetValue: [number, number] = [min, max]
    setLocalValue(resetValue)
    onChange(resetValue)
    setIsOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
          isOpen || (value[0] !== min || value[1] !== max)
            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]'
            : 'border-[color-mix(in_srgb,var(--text)_15%,transparent)] bg-[var(--card)] hover:border-[var(--accent)]/50'
        }`}
      >
        <DollarSign className="w-4 h-4 text-[var(--accent)]" />
        <span className="font-medium">Бюджет</span>
        {(value[0] !== min || value[1] !== max) && (
          <span className="ml-1 px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-text)] text-xs rounded-full">
            {formatPrice(value[0])} - {formatPrice(value[1])}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[var(--card)] border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-xl shadow-2xl z-50 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--muted)]">Диапазон цен</span>
              <span className="font-medium">
                {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
              </span>
            </div>
            
            <div className="relative h-2">
              <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--text)_20%,transparent)] rounded-full" />
              <div 
                className="absolute h-full bg-[var(--accent)] rounded-full"
                style={{
                  left: `${((localValue[0] - min) / (max - min)) * 100}%`,
                  right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
                }}
              />
              
              <input
                type="range"
                min={min}
                max={max}
                value={localValue[0]}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), localValue[1] - 1000)
                  setLocalValue([newMin, localValue[1]])
                }}
                className="absolute top-1/2 -translate-y-1/2 w-full h-4 opacity-0 cursor-pointer"
              />
              
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-[var(--accent)] rounded-full border-2 border-[var(--card)] shadow-lg" 
                style={{ left: `${((localValue[0] - min) / (max - min)) * 100}%` }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-[var(--accent)] rounded-full border-2 border-[var(--card)] shadow-lg"
                style={{ left: `${((localValue[1] - min) / (max - min)) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-4 text-sm text-[var(--muted)]">
              <span>{formatPrice(min)}</span>
              <span>{formatPrice(max)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 border border-[color-mix(in_srgb,var(--text)_20%,transparent)] rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_5%,transparent)] transition-colors"
            >
              Сбросить
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 bg-[var(--accent)] text-[var(--accent-text)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}