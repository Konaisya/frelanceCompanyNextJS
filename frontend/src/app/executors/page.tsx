'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import api, { profileAPI } from '@/lib/api/axios'
import ExecutorsHero from '@/components/ui/executors/ExecutorsHero'
import ExecutorsGrid from '@/components/ui/executors/ExecutorsGrid'
import ExecutorDrawer from '@/components/ui/executors/ExecutorDrawer'
import ExecutorsFilters from '@/components/ui/executors/ExecutorsFilters'
import { useToast } from '@/components/ui/ToastProvider'
import { Service } from '@/types/service'
import { Executor, UserResponse, Review } from '@/types/executor'


export default function ExecutorsPage() {
  const [executors, setExecutors] = useState<Executor[]>([])
  const { showToast } = useToast()
  const [executorsServices, setExecutorsServices] = useState<Record<number, Service[]>>({})
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



  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return Number((sum / reviews.length).toFixed(1))
  }

  const getCompletedOrdersCount = async (userId: number): Promise<number> => {
    try {
      const response = await api.get('/orders/', { 
        params: { 
          id_user_executor: userId,
          status: 'COMPLETED'
        } 
      })
      return response.data.length
    } catch {
      return 0
  }
  }

  const fetchExecutors = useCallback(async () => {
    setIsLoading(true)
    try {
      const usersRes = await profileAPI.getExecutors()
      const executorsData: UserResponse[] = usersRes.data
      
      const executorsWithData: Executor[] = []
      const servicesByExecutor: Record<number, Service[]> = {}

      const fetchPromises = executorsData.map(async (user) => {
        try {
          const servicesRes = await profileAPI.getServices({ id_user_executor: user.id })
          const userServices: Service[] = servicesRes.data

          if (userServices.length > 0) {
            const reviewsRes = await profileAPI.getReviews({ id_user_target: user.id })
            const reviews: Review[] = reviewsRes.data

            const completedOrders = await getCompletedOrdersCount(user.id)
            const averageRating = calculateAverageRating(reviews)

            const skillsArray = user.skills
              ? user.skills.split(',').map(s => s.trim())
              : []

            let minPrice = 1000
            let maxPrice = 100000

            if (userServices.length > 0) {
              const prices = userServices.map(service => service.price)
              minPrice = Math.min(...prices)
              maxPrice = Math.max(...prices)
            }

            const executor: Executor = {
              id: user.id,
              name: user.name,
              image: user.image,
              role: 'EXECUTOR',
              email: '',
              balance: 0,
              specialization: user.specialization || { id: 0, name: '' },
              contacts: '',
              experience: user.experience || 0,
              skills: user.skills || '',
              hourly_rate: 0,
              description: user.description || '',
              rating: averageRating,
              completed_orders: completedOrders,
              services_count: userServices.length,
              price_range: [minPrice, maxPrice],
              specializations_list: skillsArray
            }

            executorsWithData.push(executor)

            servicesByExecutor[user.id] = userServices.map(service => ({
              ...service,
              user_executor: {
                id: user.id,
                name: user.name,
                image: user.image,
                rating: averageRating,
                completed_orders: completedOrders
              }
            }))
          }
      } catch {
          showToast({
            type: 'error',
            title: 'Ошибка загрузки исполнителя',
            description: `ID: ${user.id}`
          })
        }
      })

      await Promise.all(fetchPromises)

      executorsWithData.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

      setExecutors(executorsWithData)
      setExecutorsServices(servicesByExecutor)
    } catch (error) {
      console.error('Failed to fetch executors:', error)
    } finally {
      setIsLoading(false)
    }
  }, [showToast]) 

  useEffect(() => {
    fetchExecutors()
  }, [fetchExecutors])


  const filteredExecutors = useMemo(() => {
    return executors
      .filter(e => {
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase()
          return e.name.toLowerCase().includes(query) ||
            e.skills.toLowerCase().includes(query) ||
            e.specialization.name.toLowerCase().includes(query)
        }
        return true
      })
      .filter(e => {
        if (filters.specializations.length === 0) return true
        const specName = e.specialization?.name.toLowerCase()
        return filters.specializations.some(spec => specName.includes(spec.toLowerCase()))
      })
      .filter(e => {
        if (filters.experience.length === 0) return true
        let experienceLevel = 'junior'
        if (e.experience >= 5) experienceLevel = 'senior'
        else if (e.experience >= 2) experienceLevel = 'middle'
        return filters.experience.includes(experienceLevel)
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
          case 'services': return (b.services_count || 0) - (a.services_count || 0)
          case 'orders': return (b.completed_orders || 0) - (a.completed_orders || 0)
          case 'experience': return b.experience - a.experience
          case 'newest': return b.id - a.id
          case 'popularity':
          default: return (b.completed_orders || 0) - (a.completed_orders || 0)
        }
      })
  }, [executors, filters])

  const handleExecutorSelect = (executor: Executor) => {
    setSelectedExecutor(executor)
    setIsDrawerOpen(true)

    if (executorsServices[executor.id]) {
      setServices(executorsServices[executor.id])
    } else {
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
                <p className="text-[var(--muted)] mb-4">
                  Попробуйте изменить параметры поиска
                </p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-6 py-3 bg-[var(--accent)] text-[var(--accent-text)] rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Сбросить фильтры
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