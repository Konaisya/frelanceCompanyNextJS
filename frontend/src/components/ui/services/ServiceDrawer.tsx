'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Calendar, Clock, DollarSign, User, Zap, CheckCircle, Send, Star } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import axios from 'axios'

interface Service {
  id: number
  name: string
  description: string
  price: number
  delivery_time: number
  id_user_executor: number
  specialization?: string
  executor_name?: string
  rating?: number
  completed_orders?: number
}

interface Props {
  open: boolean
  onClose: () => void
  service: Service | null
  currentUserId: number
}

export default function ServiceDrawer({ open, onClose, service, currentUserId }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      setDeadline(nextWeek.toISOString().split('T')[0])
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300) 
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleCreateOrder = async () => {
    if (!service) return
    
    try {
      setIsSubmitting(true)
      
      const orderData = {
        id_user_executor: service.id_user_executor,
        id_service: service.id,
        price: service.price,
        name: service.name,
        description: service.description,
        deadline: `${deadline}T23:59:59.999Z`
      }

      const token = localStorage.getItem('access_token')
      const response = await axios.post('http://127.0.0.1:8000/api/orders/', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      showToast({
        title: 'Заказ создан! 🎉',
        description: 'Исполнитель уведомлен о вашем заказе',
        type: 'success'
      })
      
      onClose()
    } catch (error: any) {
      showToast({
        title: 'Ошибка при создании заказа',
        description: error.response?.data?.detail || 'Попробуйте еще раз',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!service) return null

  const isOwnService = service.id_user_executor === currentUserId
  const hasDeadlineError = new Date(deadline) < new Date()

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: open ? "blur(12px)" : "blur(0px)" }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1),transparent_70%)]" />
          </motion.div>

          <motion.div
            ref={drawerRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ 
              x: open ? 0 : '100%', 
              opacity: open ? 1 : 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.5,
                delay: open ? 0 : 0
              }
            }}
            exit={{ 
              x: '100%', 
              opacity: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }
            }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] z-50 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[var(--card)]/95 via-[var(--card)]/90 to-[var(--card)]/95"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.15),transparent_50%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />
            
            <motion.div
              className="absolute inset-0 bg-[linear-gradient(45deg,transparent_65%,rgba(120,119,198,0.05)_75%,transparent_85%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            
            <motion.div
              className="absolute inset-0 border-l border-[rgba(255,255,255,0.1)] shadow-[inset_0_0_50px_rgba(120,119,198,0.1)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="relative px-6 pt-8 pb-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <motion.div
                  className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/10 rounded-full"
                  initial={{ filter: "blur(0px)", opacity: 0 }}
                  animate={{ 
                    filter: open ? "blur(48px)" : "blur(0px)",
                    opacity: open ? 1 : 0
                  }}
                  transition={{ 
                    filter: { duration: 0.5, ease: "easeOut" },
                    opacity: { duration: 0.3 }
                  }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: open ? 1 : 0.8, opacity: open ? 1 : 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <div className={`w-10 h-10 rounded-xl ${isOwnService ? 'bg-gradient-to-br from-gray-600 to-gray-400' : 'bg-gradient-to-br from-[var(--accent)] to-purple-500'} flex items-center justify-center shadow-lg`}>
                        <Sparkles className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-[var(--accent)] to-purple-500 rounded-xl blur opacity-30" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: open ? 0 : -20, opacity: open ? 1 : 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--text)] bg-clip-text text-transparent">
                        {service.name}
                      </h2>
                      <p className="text-sm text-[var(--muted)] mt-1 font-medium">
                        {isOwnService ? 'Ваш сервис' : 'Подробная информация'}
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{ 
                      scale: open ? 1 : 0.8, 
                      opacity: open ? 1 : 0,
                      rotate: open ? 0 : -90
                    }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group w-10 h-10 rounded-xl flex items-center justify-center
                               bg-gradient-to-br from-[var(--card)] to-[color-mix(in_srgb,var(--card)_95%,var(--accent))]
                               border border-[color-mix(in_srgb,var(--text)_20%,transparent)]
                               hover:border-[var(--accent)]
                               hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]
                               transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/0 to-purple-500/0
                                    group-hover:from-[var(--accent)]/10 group-hover:to-purple-500/10
                                    rounded-xl transition-all duration-300" />
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent)] to-purple-500
                                    rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                    <X className="w-5 h-5 text-[color-mix(in_srgb,var(--text)_70%,transparent)] 
                                  group-hover:text-[var(--accent-text)] group-hover:scale-110
                                  transition-all duration-300 relative z-10" />
                  </motion.button>
                </div>
                
                <motion.div
                  className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: open ? 1 : 0, opacity: open ? 1 : 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: open ? 1 : 0, 
                    y: open ? 0 : 20,
                  }}
                  transition={{ delay: open ? 0.4 : 0, duration: 0.3 }}
                  className="p-6 select-text"
                >
                  <div className="space-y-6">
                    {/* Service Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="p-4 rounded-xl bg-gradient-to-br from-[var(--bg)] to-[color-mix(in_srgb,var(--bg)_90%,var(--accent))] border border-[color-mix(in_srgb,var(--text)_10%,transparent)]"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-[var(--muted)]">Стоимость</p>
                            <p className="text-xl font-bold text-[var(--text)]">
                              {service.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="p-4 rounded-xl bg-gradient-to-br from-[var(--bg)] to-[color-mix(in_srgb,var(--bg)_90%,var(--accent))] border border-[color-mix(in_srgb,var(--text)_10%,transparent)]"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-[var(--muted)]">Срок выполнения</p>
                            <p className="text-xl font-bold text-[var(--text)]">
                              {service.delivery_time} дней
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <motion.div 
                      className="p-5 rounded-xl bg-gradient-to-br from-[var(--bg)]/50 to-transparent border border-[color-mix(in_srgb,var(--text)_10%,transparent)] backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-[var(--accent)]/10 rounded-lg">
                          <Zap className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        О сервисе
                      </h3>
                      <p className="text-[var(--text)]/80 leading-relaxed whitespace-pre-line">
                        {service.description}
                      </p>
                    </motion.div>

                    {/* Executor Info */}
                    {!isOwnService && (
                      <motion.div 
                        className="p-5 rounded-xl bg-gradient-to-br from-[var(--bg)]/50 to-transparent border border-[color-mix(in_srgb,var(--text)_10%,transparent)] backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                          <div className="p-1.5 bg-purple-500/10 rounded-lg">
                            <User className="w-4 h-4 text-purple-500" />
                          </div>
                          Исполнитель
                        </h3>
                        <div className="space-y-2">
                          <p className="text-[var(--text)]">
                            <span className="font-medium">Имя:</span> {service.executor_name || 'Не указано'}
                          </p>
                          {service.specialization && (
                            <p className="text-[var(--text)]">
                              <span className="font-medium">Специализация:</span> {service.specialization}
                            </p>
                          )}
                          {service.rating && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Рейтинг:</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(service.rating!) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-[var(--text)] ml-2">({service.rating.toFixed(1)})</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Order Form */}
                    {!isOwnService && (
                      <motion.div 
                        className="p-5 rounded-xl bg-gradient-to-br from-[var(--bg)]/50 to-transparent border border-[color-mix(in_srgb,var(--text)_10%,transparent)] backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                          <div className="p-1.5 bg-green-500/10 rounded-lg">
                            <Calendar className="w-4 h-4 text-green-500" />
                          </div>
                          Оформление заказа
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[var(--text)] mb-2">
                              Желаемый срок выполнения
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 rounded-xl bg-[var(--bg)] border ${hasDeadlineError ? 'border-red-500/50' : 'border-[color-mix(in_srgb,var(--text)_20%,transparent)]'} text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent`}
                              />
                              <Calendar className="absolute right-3 top-3 w-5 h-5 text-[var(--muted)]" />
                            </div>
                            {hasDeadlineError && (
                              <p className="mt-2 text-sm text-red-500">
                                Дата не может быть в прошлом
                              </p>
                            )}
                            <p className="mt-2 text-sm text-[var(--muted)]">
                              Укажите желаемую дату завершения работы
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[var(--text)]">Итого:</span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
                                {service.price.toLocaleString('ru-RU')} ₽
                              </span>
                            </div>

                            <motion.button
                              onClick={handleCreateOrder}
                              disabled={isSubmitting || hasDeadlineError}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Создание заказа...
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5" />
                                  Оформить заказ
                                </>
                              )}
                            </motion.button>

                            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                              <div className="flex items-center gap-2 text-sm text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span>После оплаты исполнитель приступит к работе</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Own Service Info */}
                    {isOwnService && (
                      <motion.div 
                        className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <User className="w-5 h-5 text-blue-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-[var(--text)]">
                            Это ваш сервис
                          </h3>
                        </div>
                        <p className="text-[var(--text)]/80">
                          Заказы на этот сервис будут отображаться в вашем личном кабинете.
                          Вы можете редактировать информацию о сервисе в профиле.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="relative px-6 py-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[var(--text)]">
                      {service.completed_orders || 0} заказов выполнено
                    </span>
                  </div>
                  <span className="text-[var(--accent)]">⭐ Премиум сервис</span>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: open ? 1 : 0, opacity: open ? 1 : 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  style={{ transformOrigin: 'center' }}
                />
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-20 right-10 w-2 h-2 bg-[var(--accent)] rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: open ? [1, 1.5, 1] : 0,
                opacity: open ? [0, 1, 0] : 0
              }}
              transition={{
                scale: {
                  repeat: open ? Infinity : 0,
                  duration: 2,
                  ease: "easeInOut"
                },
                opacity: {
                  repeat: open ? Infinity : 0,
                  duration: 2,
                  ease: "easeInOut"
                },
                delay: 0.6
              }}
            />
            
            <motion.div
              className="absolute bottom-40 left-8 w-1 h-1 bg-purple-400 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: open ? [1, 1.3, 1] : 0,
                opacity: open ? [0.5, 1, 0.5] : 0
              }}
              transition={{
                scale: {
                  repeat: open ? Infinity : 0,
                  duration: 1.5,
                  ease: "easeInOut"
                },
                opacity: {
                  repeat: open ? Infinity : 0,
                  duration: 1.5,
                  ease: "easeInOut"
                },
                delay: 0.7
              }}
            />
            
            <motion.div
              className="absolute top-0 right-0 w-32 h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--accent)]/50 rounded-tr-2xl" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-0 left-0 w-32 h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-400/50 rounded-bl-2xl" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}