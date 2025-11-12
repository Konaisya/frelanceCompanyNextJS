'use client'

import { useEffect, useState } from 'react'
import { ServicesAPI } from '@/lib/api/services'
import ServiceCard from './ServiceCard'
import { Service } from '@/types/service'


export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ServicesAPI.getAll()
      .then((res) => setServices(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl font-extrabold mb-16 text-center">
        Услуги <span className="text-[var(--accent)]">фрилансеров</span>
      </h2>

      {loading ? (
        <div className="text-center text-lg opacity-70">Загрузка...</div>
      ) : services.length === 0 ? (
        <div className="text-center opacity-60">Пока нет доступных услуг</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
