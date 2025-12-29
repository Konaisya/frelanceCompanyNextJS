'use client'

import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/api/axios'
import ExecutorsHero from '@/components/ui/executors/ExecutorsHero'
import ExecutorsGrid from '@/components/ui/executors/ExecutorsGrid'
import ExecutorDrawer from '@/components/ui/executors/ExecutorDrawer'
import ExecutorsFilters from '@/components/ui/executors/ExecutorsFilters'
import { Service } from '@/types/service'

interface Executor {
  id: number
  name: string
  image: string
  rating?: number
  completed_projects?: number
  skills?: string[]
  price_range?: [number, number]
  experience?: string
  specializations?: string[]
}


const mockSkills = [
  ['UI/UX', 'Figma', 'Prototyping'],
  ['React', 'TypeScript', 'Next.js'],
  ['Python', 'Django', 'PostgreSQL'],
  ['Mobile', 'React Native', 'iOS'],
  ['Backend', 'Node.js', 'MongoDB'],
  ['DevOps', 'AWS', 'Docker'],
  ['Design', 'Photoshop', 'Illustrator'],
  ['Marketing', 'SEO', 'Analytics']
]

export default function ExecutorsPage() {
  const [executors, setExecutors] = useState<Executor[]>([])
  const [filters, setFilters] = useState({
    search: '',
    specializations: [] as string[],
    experience: [] as string[],
    priceRange: [1000, 100000] as [number, number],
    sortBy: 'rating'
  })
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetchExecutors()
  }, [])

  const fetchExecutors = async () => {
    setIsLoading(true)
    try {
      const res = await api.get<Executor[]>('/users/', { params: { role: 'EXECUTOR' } })

      const executorsWithData = res.data.map((executor, index) => ({
        ...executor,
        rating: 4.5 + Math.random() * 0.5,
        completed_projects: Math.floor(Math.random() * 50) + 10,
        skills: mockSkills[index % mockSkills.length],
        price_range: [Math.floor(Math.random() * 5000) + 1000, Math.floor(Math.random() * 50000) + 20000] as [number, number],
        experience: ['junior', 'middle', 'senior', 'lead'][index % 4],
        specializations: ['frontend', 'design', 'backend', 'mobile', 'fullstack'][index % 5].split(',')
      }))

      setExecutors(executorsWithData)
    } catch (error) {
      console.error('Failed to fetch executors:', error)
      const mockExecutors: Executor[] = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Исполнитель ${i + 1}`,
        image: '/default-avatar.jpg',
        rating: 4.5 + Math.random() * 0.5,
        completed_projects: Math.floor(Math.random() * 50) + 10,
        skills: mockSkills[i % mockSkills.length],
        price_range: [Math.floor(Math.random() * 5000) + 1000, Math.floor(Math.random() * 50000) + 20000],
        experience: ['junior', 'middle', 'senior', 'lead'][i % 4],
        specializations: ['frontend', 'design', 'backend', 'mobile', 'fullstack'][i % 5].split(',')
      }))
      setExecutors(mockExecutors)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExecutors = useMemo(() => {
    return executors
      .filter(e => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase()
          return e.name.toLowerCase().includes(query) ||
            e.skills?.some(skill => skill.toLowerCase().includes(query))
        }
        return true
      })
      .filter(e => {
        if (filters.specializations.length === 0) return true
        return e.specializations?.some(spec => filters.specializations.includes(spec))
      })
      .filter(e => {
        if (filters.experience.length === 0) return true
        return e.experience && filters.experience.includes(e.experience)
      })
      .filter(e => {
        if (!e.price_range) return true
        const [min, max] = e.price_range
        const [filterMin, filterMax] = filters.priceRange
        return max >= filterMin && min <= filterMax
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating': return (b.rating || 0) - (a.rating || 0)
          case 'price_low': return (a.price_range?.[0] || 0) - (b.price_range?.[0] || 0)
          case 'price_high': return (b.price_range?.[1] || 0) - (a.price_range?.[1] || 0)
          case 'newest': return b.id - a.id
          case 'popularity':
          default: return (b.completed_projects || 0) - (a.completed_projects || 0)
        }
      })
  }, [executors, filters])

  const handleExecutorSelect = async (executor: Executor) => {
    setSelectedExecutor(executor)
    setIsDrawerOpen(true)

    try {
      const res = await api.get<Service[]>('/services', { params: { id_user_executor: executor.id } })

      // Приведение user_executor к обязательному полю
      const servicesWithExecutor = res.data.map(service => ({
        ...service,
        user_executor: service.user_executor || { name: executor.name, image: executor.image }
      }))

      setServices(servicesWithExecutor)
    } catch {
      setServices([])
    }
  }


  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedExecutor(null), 300)
  }

  const handleResetAllFilters = () => {
    setFilters({
      search: '',
      specializations: [],
      experience: [],
      priceRange: [1000, 100000],
      sortBy: 'rating'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg)] to-[color-mix(in_srgb,var(--bg)_90%,transparent)]">
      <ExecutorsHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <ExecutorsFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Найдено <span className="text-[var(--accent)]">{filteredExecutors.length}</span> фрилансеров
          </h2>
          {filteredExecutors.length !== executors.length && (
            <button
              onClick={handleResetAllFilters}
              className="px-4 py-2 text-sm text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--muted)]">Загружаем исполнителей...</p>
          </div>
        ) : (
          <>
            <ExecutorsGrid
              executors={filteredExecutors}
              loading={false}
              onExecutorSelect={handleExecutorSelect}
            />

            {filteredExecutors.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold mb-2">Исполнители не найдены</h3>
                <button
                  onClick={handleResetAllFilters}
                  className="px-6 py-3 bg-[var(--accent)] text-[var(--accent-text)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Показать всех исполнителей
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedExecutor && (
        <ExecutorDrawer
          executor={selectedExecutor}
          services={services}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  )
}
