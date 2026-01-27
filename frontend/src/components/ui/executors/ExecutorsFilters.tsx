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

export default function ExecutorsFilters({ filters, onChange }: ExecutorsFiltersProps) {
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const experienceLevels = [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
  ]

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
          label="Уровень"
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