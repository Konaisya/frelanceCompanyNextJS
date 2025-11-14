'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Service } from '@/types/service'
import { ServicesAPI } from '@/lib/api/services'
import ServiceCard from './ServiceCard'
import ServiceCardSkeleton from './ServiceCardSkeleton'

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      <h1 className="text-3xl font-semibold mb-12 text-center">Услуги фрилансеров</h1>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 pb-32"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
        </div>
      </motion.section>
    </>
  )
}
