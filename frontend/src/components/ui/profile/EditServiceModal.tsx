'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Clock, DollarSign } from 'lucide-react'
import { Service } from '@/types/profile'

interface EditServiceModalProps {
  service: Service
  onClose: () => void
  onSave: (id: number, data: Partial<Service>) => Promise<boolean>
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: service.name,
    description: service.description,
    price: service.price,
    delivery_time: service.delivery_time
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (service.id) {
        await onSave(service.id, formData)
        onClose()
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {service && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          <div className="flex items-center justify-center min-h-full p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Save className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text">Редактирование сервиса</h3>
                      <p className="text-sm text-muted">ID: {service.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-bg rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Название сервиса
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Описание
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Цена (₽)
                        </div>
                      </label>
                      <input
                        type="number"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        min="0"
                        className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Срок (дни)
                        </div>
                      </label>
                      <input
                        type="number"
                        value={formData.delivery_time || 1}
                        onChange={(e) => setFormData({ ...formData, delivery_time: Number(e.target.value) })}
                        min="1"
                        className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-accent/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-accent/30 text-accent rounded-xl hover:bg-accent/10 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Сохранить изменения
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EditServiceModal