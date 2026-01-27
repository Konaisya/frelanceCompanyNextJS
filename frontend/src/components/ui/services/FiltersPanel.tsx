'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api/axios'

interface Props {
  onFilterChange: (params: {
    priceMin?: number
    priceMax?: number
    deliveryTimeMin?: number
    deliveryTimeMax?: number
    id_specialization?: number | null
    id_user_executor?: number | null
  }) => void
}

interface Specialization {
  id: number
  name: string
}

export default function FiltersPanel({ onFilterChange }: Props) {
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [price, setPrice] = useState([0, 20000])
  const [deliveryTime, setDeliveryTime] = useState([0, 500])
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specsRes = await api.get<Specialization[]>('/specializations/')
        setSpecializations(specsRes.data)
      } catch (error) {
        console.error('Error loading specializations:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    onFilterChange({
      priceMin: price[0],
      priceMax: price[1],
      deliveryTimeMin: deliveryTime[0],
      deliveryTimeMax: deliveryTime[1],
      id_specialization: selectedSpec,
    })
  }, [
    price,
    deliveryTime,
    selectedSpec,
    onFilterChange,
  ])

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="
        hidden lg:flex flex-col gap-6
        w-[300px] shrink-0
        bg-gradient-to-br from-[var(--glass)]/70 to-[var(--glass)]/40
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        p-6
        h-fit sticky top-28
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
      "
    >
      <h2 className="font-semibold text-lg">Фильтры</h2>
      <div className="h-px bg-white/10" />

      <div className="flex flex-col gap-3">
        <span className="text-sm opacity-70">
          Цена: {price[0]} – {price[1]} ₽
        </span>
        <input
          type="range"
          min={0}
          max={20000}
          value={price[0]}
          onChange={(e) => setPrice([+e.target.value, price[1]])}
          className="accent-[var(--accent)]"
        />
        <input
          type="range"
          min={0}
          max={20000}
          value={price[1]}
          onChange={(e) => setPrice([price[0], +e.target.value])}
          className="accent-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm opacity-70">
          Срок: {deliveryTime[0]} – {deliveryTime[1]} ч
        </span>
        <input
          type="range"
          min={0}
          max={500}
          value={deliveryTime[0]}
          onChange={(e) =>
            setDeliveryTime([+e.target.value, deliveryTime[1]])
          }
          className="accent-[var(--accent)]"
        />
        <input
          type="range"
          min={0}
          max={500}
          value={deliveryTime[1]}
          onChange={(e) =>
            setDeliveryTime([deliveryTime[0], +e.target.value])
          }
          className="accent-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm opacity-70">Специализация</span>
        <select
          value={selectedSpec ?? ''}
          onChange={(e) =>
            setSelectedSpec(e.target.value ? Number(e.target.value) : null)
          }
          className="
            bg-white/5
            border border-white/10
            rounded-xl
            p-2
            backdrop-blur-xl
            outline-none
          "
        >
          <option value="">Все</option>
          {specializations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </motion.aside>
  )
}