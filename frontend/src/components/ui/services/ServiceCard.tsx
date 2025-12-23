'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '../Button'
import ServiceDrawer from './ServiceDrawer'
import { Service } from '@/types/service'

import  { useToast } from "@/components/ui/ToastProvider";

interface Props {
  service: Service
}

export default function ServiceCard({ service }: Props) {
  const [open, setOpen] = useState(false)
  const { showToast } = useToast();

  return (
    <>
      <motion.div
        whileHover={{
          scale: 1.01,
          boxShadow: '0 12px 35px rgba(0,0,0,0.25)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="
          relative group overflow-hidden
          w-full
          bg-gradient-to-br from-[var(--glass)]/70 to-[var(--glass)]/40
          backdrop-blur-2xl border border-white/10
          rounded-3xl p-6
          flex gap-6 items-center
          shadow-[0_4px_20px_rgba(0,0,0,0.05)]
          hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          transition-all duration-300
        "
      >
        <div className="relative w-[80px] h-[80px] shrink-0 rounded-2xl overflow-hidden ring-2 ring-[var(--accent)]/40">
          <Image
            src={`http://127.0.0.1:8000/${service.user_executor.image}`}
            alt={service.user_executor.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-xl">{service.name}</h3>
          <p className="text-sm opacity-70 mb-2">
            {service.user_executor.name} • {service.specialization.name}
          </p>
          <p className="text-sm opacity-80 line-clamp-2 max-w-3xl">
            {service.description}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[var(--accent)] font-bold text-xl">
            {service.price.toLocaleString()} ₽
          </span>
          <span className="text-xs opacity-70">
            за {service.delivery_time} ч
          </span>

          <Button
            className="mt-2 rounded-xl bg-[var(--accent)]/90 hover:bg-[var(--accent)] transition"
            onClick={() =>
            showToast({
              title: 'Регистрация прошла успешно!',
              description: 'Теперь вы можете войти в систему используя email и пароль',
              type: 'error',
            })
          }
          >
            Подробнее
          </Button>
        </div>
      </motion.div>


      <ServiceDrawer open={open} onClose={() => setOpen(false)}>

      </ServiceDrawer>
    </>
  )
}
