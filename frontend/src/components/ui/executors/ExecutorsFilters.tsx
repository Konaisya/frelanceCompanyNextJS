'use client'

import { useState, useEffect } from 'react'
import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import SortingDropdown from './SortingDropdown'
import { profileAPI, Specialization } from '@/lib/api/axios'

interface ExecutorsFiltersProps {
  filters: {
    search: string
    specializations: string[]
    experience: string[]
    priceRange: [number, number]
    sortBy: string
  }
  onChange: (filters: ExecutorsFiltersProps['filters']) => void
}

const getExperienceLevel = (years: number): string => {
  if (years < 1) return 'intern'
  if (years >= 1 && years < 3) return 'junior'
  if (years >= 3 && years < 5) return 'middle'
  if (years >= 5 && years < 8) return 'senior'
  return 'lead'
}

const experienceLevels = [
  { value: 'intern', label: 'Стажер (до 1 года)' },
  { value: 'junior', label: 'Junior (1-2 года)' },
  { value: 'middle', label: 'Middle (3-4 года)' },
  { value: 'senior', label: 'Senior (5-7 лет)' },
  { value: 'lead', label: 'Lead (8+ лет)' },
]

export default function ExecutorsFilters({ filters, onChange }: ExecutorsFiltersProps) {
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await profileAPI.getSpecializations()
        setSpecializations(response.data)
      } catch (err) {
        console.error('Ошибка загрузки специализаций:', err)
        setError('Не удалось загрузить специализации')
      } finally {
        setLoading(false)
      }
    }

    loadSpecializations()
  }, [])

  const mapSpecializationsToOptions = (specs: Specialization[]) => {
    return specs.map(spec => ({
      value: spec.name.toLowerCase(),
      label: spec.name
    }))
  }

  return (
    <div className="space-y-6">
      <SearchInput 
        placeholder="Искать по имени, специализации, навыкам..."
        value={filters.search}
        onChange={(value) => onChange({ ...filters, search: value })}
      />

      <div className="flex flex-wrap items-center gap-3">
        {loading ? (
          <div className="px-4 py-3 text-sm text-[var(--muted)]">
            Загрузка специализаций...
          </div>
        ) : error ? (
          <div className="px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        ) : (
          <FilterDropdown
            label="Специализация"
            options={mapSpecializationsToOptions(specializations)}
            selected={filters.specializations}
            onChange={(vals) => onChange({ ...filters, specializations: vals })}
          />
        )}

        <FilterDropdown
          label="Уровень опыта"
          options={experienceLevels}
          selected={filters.experience}
          onChange={(vals) => onChange({ ...filters, experience: vals })}
        />

        <SortingDropdown
          value={filters.sortBy}
          onChange={(val) => onChange({ ...filters, sortBy: val })}
        />

        {(filters.search || filters.specializations.length > 0 || filters.experience.length > 0 || filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 100000) && (
          <button
            onClick={() => onChange({
              search: '',
              specializations: [],
              experience: [],
              priceRange: [1000, 100000],
              sortBy: 'rating'
            })}
            className="px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            Сбросить всё
          </button>
        )}
      </div>
    </div>
  )
}

export { getExperienceLevel }