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
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      className="
        relative group overflow-hidden
        bg-gradient-to-br from-[var(--glass)]/70 to-[var(--glass)]/40
        backdrop-blur-2xl border border-white/10
        rounded-3xl p-6 flex flex-col justify-between
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        transition-all duration-300
      "
    >

      <motion.div
        initial={{ opacity: 0, y: 40, background: 'linear-gradient(to top, var(--accent)/15, transparent)' }}
        whileHover={{
          opacity: 1,
          y: 0,
          background: [
            'linear-gradient(to top, var(--accent)/25, transparent)',
            'linear-gradient(to top, var(--accent)/40, transparent)',
          ],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          background: { duration: 1.2, ease: 'easeInOut' },
        }}
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
      />

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden ring-2 ring-[var(--accent)]/40">
          <Image
            src={`http://127.0.0.1:8000/${service.user_executor.image}`}
            alt={service.user_executor.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg tracking-tight">
            {service.name}
          </h3>
          <p className="text-sm opacity-70">
            {service.user_executor.name} • {service.specialization.name}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm opacity-80 leading-relaxed line-clamp-3 relative z-10">
        {service.description}
      </p>

      <div className="flex items-center justify-between mt-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-[var(--accent)] font-bold text-lg">
            {service.price.toLocaleString()} ₽
          </span>
          <span className="text-xs opacity-70">
            за {service.delivery_time} ч
          </span>
        </div>
        <Button className="rounded-xl bg-[var(--accent)]/90 hover:bg-[var(--accent)] transition">
          Подробнее
        </Button>
      </div>
    </motion.div>
  )
}
