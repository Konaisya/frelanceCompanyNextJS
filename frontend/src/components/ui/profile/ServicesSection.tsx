'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Service } from '@/types/profile'
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react'
import EditServiceModal from './EditServiceModal'

interface ServicesSectionProps {
  services: Service[]
  loading?: boolean // принимает флаг загрузки сервисов
  onCreate: () => void
  onUpdate: (id: number, data: Partial<Service>) => Promise<boolean>
  onDelete: (id: number) => Promise<boolean>
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Мои сервисы</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-text rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Создать сервис
          </motion.button>
        </div>

        <AnimatePresence>
          {loading ? (
            // skeleton-представление пока идет загрузка сервисов
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[1,2,3].map(i => (
                <div key={i} className="border border-accent/10 rounded-xl p-5 animate-pulse bg-gradient-to-r from-bg via-bg/95 to-bg/95">
                  <div className="h-6 bg-accent/10 rounded w-2/3 mb-4" />
                  <div className="h-4 bg-accent/10 rounded w-full mb-2" />
                  <div className="h-4 bg-accent/10 rounded w-full mb-2" />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent/10">
                    <div className="h-4 bg-accent/10 rounded w-24" />
                    <div className="h-4 bg-accent/10 rounded w-16" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-muted mb-4">У вас еще нет созданных сервисов</p>
              <button
                onClick={onCreate}
                className="px-6 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
              >
                Создать первый сервис
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <motion.div
                  key={`service-${service.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border border-accent/20 rounded-xl p-5 hover:border-accent/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-text">{service.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="p-2 text-muted hover:text-accent transition-colors"
                        disabled={deletingId === service.id}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => service.id && handleDelete(service.id)}
                        className="p-2 text-muted hover:text-red-500 transition-colors"
                        disabled={deletingId === service.id}
                      >
                        {deletingId === service.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-text/70 mb-4 line-clamp-3">{service.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-text">{service.price} ₽</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted">{service.delivery_time} дней</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={onUpdate}
        />
      )}
    </>
  )
}

export default ServicesSection