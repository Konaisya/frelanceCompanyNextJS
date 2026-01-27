'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Mail, Phone, Briefcase, DollarSign, Award, Code, User as UserIcon } from 'lucide-react'
import { User, Specialization, UpdateUserRequest } from '@/lib/api/axios'
import { profileAPI } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'
import { AxiosError } from 'axios'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave?: (updatedUser: User) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    user: {
      name: user.name,
      email: user.email
    },
    executor_profile: user.role === 'EXECUTOR' ? {
      id_specialization: user.specialization?.id,
      contacts: user.contacts || '',
      experience: user.experience || 0,
      skills: user.skills || '',
      hourly_rate: user.hourly_rate || 0,
      description: user.description || ''
    } : undefined,
    customer_profile: user.role === 'CUSTOMER' ? {
      contacts: user.contacts || '',
      company: ''
    } : undefined
  })

  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [loading, setLoading] = useState(false)
  const [specializationsLoading, setSpecializationsLoading] = useState(false)
  const { showToast } = useToast()

  const fetchSpecializations = useCallback(async () => {
    try {
      setSpecializationsLoading(true)
      const response = await profileAPI.getSpecializations()
      setSpecializations(response.data)
    } catch {
      showToast({
        title: 'Ошибка',
        description: 'Не удалось загрузить специализации',
        type: 'error'
      })
    } finally {
      setSpecializationsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (isOpen && user.role === 'EXECUTOR') {
      fetchSpecializations()
    }
  }, [isOpen, user.role, fetchSpecializations])

  const handleInputChange = (
    field: keyof UpdateUserRequest['user'] | keyof NonNullable<UpdateUserRequest['executor_profile']> | keyof NonNullable<UpdateUserRequest['customer_profile']>,
    value: string | number,
    section: 'user' | 'executor_profile' | 'customer_profile' = 'user'
  ) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      if (section === 'user') {
        newData.user = {
          ...newData.user,
          [field]: value
        } as UpdateUserRequest['user']
      } else if (section === 'executor_profile') {
        newData.executor_profile = {
          ...newData.executor_profile,
          [field]: value
        } as UpdateUserRequest['executor_profile']
      } else if (section === 'customer_profile') {
        newData.customer_profile = {
          ...newData.customer_profile,
          [field]: value
        } as UpdateUserRequest['customer_profile']
      }
      
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await profileAPI.updateUser(user.id, formData)
      onSave?.({ ...user, ...formData.user })
      window.location.reload()
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>
      showToast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось обновить профиль',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex items-center justify-center min-h-full p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <UserIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Редактирование профиля</h3>
                    <p className="text-sm text-muted">Заполните информацию о себе</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-text flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Основная информация
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={formData.user.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.user.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Контакты
                    </label>
                    <input
                      type="text"
                      value={formData.executor_profile?.contacts || formData.customer_profile?.contacts || ''}
                      onChange={(e) => handleInputChange('contacts', e.target.value, user.role === 'EXECUTOR' ? 'executor_profile' : 'customer_profile')}
                      placeholder="Telegram, WhatsApp, Email"
                      className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>

                {user.role === 'EXECUTOR' && (
                  <>
                    <div className="space-y-4 pt-4 border-t border-accent/10">
                      <h4 className="font-semibold text-text flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Профессиональная информация
                      </h4>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Специализация
                        </label>
                        <select
                          value={formData.executor_profile?.id_specialization || ''}
                          onChange={(e) => handleInputChange('id_specialization', parseInt(e.target.value), 'executor_profile')}
                          className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          disabled={specializationsLoading}
                        >
                          <option value="">Выберите специализацию</option>
                          {specializations.map(spec => (
                            <option key={spec.id} value={spec.id}>
                              {spec.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            <Award className="w-4 h-4 inline mr-2" />
                            Опыт (лет)
                          </label>
                          <input
                            type="number"
                            value={formData.executor_profile?.experience || 0}
                            onChange={(e) => handleInputChange('experience', parseInt(e.target.value), 'executor_profile')}
                            min="0"
                            max="50"
                            className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-2">
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Часовая ставка (₽)
                          </label>
                          <input
                            type="number"
                            value={formData.executor_profile?.hourly_rate || 0}
                            onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value), 'executor_profile')}
                            min="0"
                            className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          <Code className="w-4 h-4 inline mr-2" />
                          Навыки
                        </label>
                        <textarea
                          value={formData.executor_profile?.skills || ''}
                          onChange={(e) => handleInputChange('skills', e.target.value, 'executor_profile')}
                          placeholder="JavaScript, React, TypeScript, Node.js..."
                          rows={3}
                          className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Описание
                        </label>
                        <textarea
                          value={formData.executor_profile?.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value, 'executor_profile')}
                          placeholder="Расскажите о себе, своем опыте и подходах к работе..."
                          rows={4}
                          className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {user.role === 'CUSTOMER' && (
                  <div className="space-y-4 pt-4 border-t border-accent/10">
                    <h4 className="font-semibold text-text flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Информация о компании
                    </h4>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Название компании
                      </label>
                      <input
                        type="text"
                        value={formData.customer_profile?.company || ''}
                        onChange={(e) => handleInputChange('company', e.target.value, 'customer_profile')}
                        className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

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
                    className="flex-1 px-4 py-3 bg-accent text-accent-text rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-accent-text border-t-transparent rounded-full animate-spin" />
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
    </AnimatePresence>
  )
}

export default EditProfileModal