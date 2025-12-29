'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Briefcase, Sparkles, Phone } from 'lucide-react'
import ServiceCard from '../services/ServiceCard'
import { Service } from '@/types/service'
import { useEffect} from 'react'
import ChatButton from '@/components/ui/chat/ChatButton'
import Image from 'next/image'


interface Executor {
  id: number
  name: string
  image: string
  rating?: number
  completed_projects?: number
}

interface ExecutorDrawerProps {
  executor: Executor
  services: Service[]
  isOpen: boolean
  onClose: () => void
}

export default function ExecutorDrawer({ executor, services, isOpen, onClose }: ExecutorDrawerProps) {

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-[var(--card)] z-50 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-[var(--card)] border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)] z-10">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-3 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card)]">
                      <Image
                        src={`http://127.0.0.1:8000/${executor.image}`}
                        alt={executor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-[var(--accent-text)] rounded-full p-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{executor.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{executor.rating?.toFixed(1)}</span>
                      <span>•</span>
                      <Briefcase className="w-4 h-4" />
                      <span>{executor.completed_projects} проектов</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>Услуги исполнителя</span>
                  <span className="text-sm px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full">
                    {services.length}
                  </span>
                </h3>

                <div className="space-y-4">
                  {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <div className="bg-gradient-to-r from-[var(--accent)]/5 to-[var(--accent)]/10 rounded-xl p-5 border border-[var(--accent)]/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    Заказать услугу
                  </h4>
                  <p className="text-sm text-[var(--muted)] mb-4">
                    Свяжитесь с исполнителем напрямую для обсуждения деталей проекта
                  </p>
                    <div className="flex gap-3">
                      <ChatButton 
                        executorId={executor.id}
                        executorName={executor.name}
                        executorImage={executor.image}
                      />
                    </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
