'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '../Button'
import { Service } from '@/types/service'


interface Props {
  service: Service
}

export default function ServiceCard({ service }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="bg-[var(--glass)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--glass)] flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <Image
          src={`http:127.0.0.1:8000/${service.user_executor.image}`}
          alt={service.user_executor.name}
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <p className="text-sm opacity-80">
            {service.user_executor.name} — {service.specialization.name}
          </p>
        </div>
      </div>

      <p className="text-sm opacity-90 line-clamp-3">{service.description}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-[var(--accent)]">
          {service.price} ₽
        </span>
        <Button>
          Подробнее
        </Button>
      </div>
    </motion.div>
  )
}
