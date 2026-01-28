'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '../Button'
import ServiceDrawer from './ServiceDrawer'
import { Service } from '@/types/service'
import { Clock, DollarSign, User, Star, Sparkles, ChevronRight } from 'lucide-react'

interface Props {
  service: Service
  currentUserId?: number
}

export default function ServiceCard({ service, currentUserId }: Props) {
  const [open, setOpen] = useState(false)
  
  const isOwnService = currentUserId ? service.id_user_executor === currentUserId : false

  return (
    <>
      <motion.div
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 20px 60px rgba(var(--accent-rgb, 120, 119, 198), 0.01)"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 30,
          duration: 0.5
        }}
        className="relative group overflow-hidden w-full bg-gradient-to-br from-white/5 via-white/3 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => setOpen(true)}
      >

        <div className="flex items-start gap-3 sm:gap-0 w-full sm:w-auto">
          <div className="relative w-12 h-12 sm:w-[80px] sm:h-[80px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-[var(--accent)]/40 group-hover:ring-[var(--accent)]/60 transition-all duration-300">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${service.user_executor.image}`}
              alt={service.user_executor.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 48px, 80px"
            />
          </div>

          <div className="flex-1 sm:hidden">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-sm sm:text-xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300 line-clamp-1">
                  {service.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-1 text-xs text-[var(--text)]/70">
                    <User className="w-3 h-3" />
                    <span className="font-medium">{service.user_executor.name}</span>
                  </div>
                  {service.user_executor.rating && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/10 rounded">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold text-yellow-600">
                        {service.user_executor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-xs text-[var(--text)]/80 line-clamp-2 mt-2 mb-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col flex-1 z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-sm text-[var(--text)]/70">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{service.user_executor.name}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full font-medium">
                  {service.specialization.name}
                </span>
              </div>
            </div>
            
            {service.user_executor.rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-lg">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-yellow-600">
                  {service.user_executor.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-[var(--text)]/80 line-clamp-2 mb-3 leading-relaxed group-hover:text-[var(--text)]/90 transition-colors duration-300">
            {service.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-[var(--text)]/60 group-hover:text-[var(--accent)]/70 transition-colors duration-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.delivery_time} дней</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text)]/60 group-hover:text-[var(--accent)]/70 transition-colors duration-300">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Стоимость</span>
            </div>
            {isOwnService && (
              <div className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-medium">Ваш сервис</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:hidden border-t border-white/10 pt-3 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--text)]/50">Специализация</span>
              <span className="text-sm font-medium text-[var(--accent)]">
                {service.specialization.name}
              </span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-[var(--accent)]">
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text)]/60">
                <Clock className="w-3 h-3" />
                <span>{service.delivery_time} дн.</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            {isOwnService && (
              <div className="flex items-center gap-1 text-blue-500 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>Ваш сервис</span>
              </div>
            )}
            
            <Button
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[var(--accent)] text-white font-semibold text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(true)
              }}
            >
              <span className="flex items-center gap-1">
                Подробнее
                <ChevronRight className="w-3 h-3" />
              </span>
            </Button>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 z-10">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-[var(--accent)]">
              {service.price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-xs text-[var(--text)]/50 mt-1">
              Без предоплаты
            </span>
          </div>

          <Button
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent)] text-white font-semibold"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(true)
            }}
          >
            <span className="flex items-center gap-2">
              Подробнее
              <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            </span>
          </Button>
        </div>
      </motion.div>

      <ServiceDrawer
        open={open}
        onClose={() => setOpen(false)}
        service={{
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          delivery_time: service.delivery_time,
          id_user_executor: service.id_user_executor,
          specialization: service.specialization.name,
          executor_name: service.user_executor.name,
          rating: service.user_executor.rating,
          completed_orders: service.user_executor.completed_orders
        }}
        currentUserId={currentUserId || 0}
      />
    </>
  )
}