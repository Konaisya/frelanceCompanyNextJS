'use client'

import SearchInput from './SearchInput'
import FilterDropdown from './FilterDropdown'
import SortingDropdown from './SortingDropdown'

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
  const specializations = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'design', label: 'Дизайн' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Мобильная разработка' },
    { value: 'fullstack', label: 'Fullstack' },
    { value: 'devops', label: 'DevOps' },
  ]

  const experienceLevels = [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
  ]

  return (
    <div className="space-y-6">
      <SearchInput 
        placeholder="Искать по имени, специализации, навыкам..."
        value={filters.search}
        onChange={(value) => onChange({ ...filters, search: value })}
      />


      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Специализация"
          options={specializations}
          selected={filters.specializations}
          onChange={(vals) => onChange({ ...filters, specializations: vals })}
        />

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
