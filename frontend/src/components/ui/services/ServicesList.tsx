'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Service } from '@/types/service'
import { ServicesAPI } from '@/lib/api/services'
import ServiceCard from './ServiceCard'
import ServiceCardSkeleton from './ServiceCardSkeleton'
import ServiceSearchInput from './ServiceSearchInput'
import FiltersPanel from './FiltersPanel'

interface Filters {
  priceMin?: number
  priceMax?: number
  deliveryTimeMin?: number
  deliveryTimeMax?: number
  id_specialization?: number | null
  id_user_executor?: number | null
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({})

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServicesAPI.getAll()
        setServices(data)
      } catch (error) {
        console.error('Ошибка при загрузке услуг:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const filteredServices = services
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => !filters.id_specialization || s.specialization.id === filters.id_specialization)
    .filter(s => !filters.id_user_executor || s.user_executor.id === filters.id_user_executor)
    .filter(s => (filters.priceMin ?? 0) <= s.price && s.price <= (filters.priceMax ?? Infinity))
    .filter(s => (filters.deliveryTimeMin ?? 0) <= s.delivery_time && s.delivery_time <= (filters.deliveryTimeMax ?? Infinity))

  return (
    <div className="flex gap-10 container mx-auto px-4 pb-32 relative">

      <div className="flex-1 max-w-[70%] space-y-6">
        <ServiceSearchInput value={search} onChange={setSearch} />

        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>
        )}
      </div>

      <FiltersPanel onFilterChange={setFilters} />

    </div>
  )
}
