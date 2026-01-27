'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Calendar, Clock, DollarSign, User, Zap, Send, Star, ChevronLeft, ChevronRight, Ban } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { profileAPI } from '@/lib/api/axios'

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
  currentUserRole?: string 
}

interface DecodedToken {
  sub: number
  exp: number
  role: string
}

const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export default function ServiceDrawer({ open, onClose, service, currentUserId, currentUserRole }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()
  const [actualUserRole, setActualUserRole] = useState<string>('')

  useEffect(() => {
    const token = getTokenFromStorage()
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded?.role) {
        setActualUserRole(decoded.role)
      }
    }
  }, [])

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      const today = new Date()
      const defaultDate = getDefaultAvailableDate()
      setSelectedDate(defaultDate)
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
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
    if (!service || !selectedDate) return

    const userRole = actualUserRole || currentUserRole || ''
    if (userRole !== 'CUSTOMER') {
      showToast({
        type: 'error',
        title: 'Недоступно',
        description: 'Заказывать услуги могут только клиенты (CUSTOMER)'
      })
      return
    }

    try {
      setIsSubmitting(true)
      const orderData = {
        id_user_executor: service.id_user_executor,
        id_service: service.id,
        price: service.price,
        name: service.name,
        description: service.description,
        deadline: selectedDate.toISOString()
      }
      await profileAPI.createOrder(orderData)
      showToast({
        title: 'Заказ создан! 🎉',
        description: 'Исполнитель уведомлен о вашем заказе',
        type: 'success'
      })
      onClose()
    } catch {
      showToast({
        title: 'Ошибка при создании заказа',
        description: 'Попробуйте еще раз',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const userRole = actualUserRole || currentUserRole || ''
  const canOrder = String(userRole).trim().toUpperCase() === 'CUSTOMER'

  const getDefaultAvailableDate = () => {
    const today = new Date()
    const defaultDate = new Date(today)
    let daysToAdd = 7
    let foundDate = false
    while (!foundDate && daysToAdd < 21) {
      defaultDate.setDate(today.getDate() + daysToAdd)
      const dayOfWeek = defaultDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        foundDate = true
      } else {
        daysToAdd++
      }
    }
    return defaultDate
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    if (checkDate <= today) {
      return false
    }
    const daysDifference = Math.floor((checkDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDifference <= 6) {
      return false
    }
    const dayOfWeek = checkDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false
    }
    return true
  }

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay() || 7
    const days: Array<Date | null> = []
    for (let i = 1; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date) && canOrder) {
      setSelectedDate(date)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDayName = (date: Date) => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    return days[date.getDay()]
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  if (!service) return null

  const isOwnService = service.id_user_executor === currentUserId
  const currentYear = currentMonth.getFullYear()
  const currentMonthNum = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonthNum)

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

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
                mass: 0.5
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
                    {!isOwnService && (
                      <>
                        {!canOrder ? (
                          <motion.div
                            className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <h3 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
                              <div className="p-1.5 bg-red-500/20 rounded-lg">
                                <Ban className="w-4 h-4 text-red-500" />
                              </div>
                              Недоступно для заказа
                            </h3>
                            <div className="space-y-3">
                              <p className="text-[var(--text)]/80">
                                Заказывать услуги могут только Заказчики.
                                {userRole === 'EXECUTOR' ? ' Вы зарегистрированы как исполнитель.' :
                                 userRole === 'ADMIN' ? ' Вы администратор.' : ' Ваша роль не позволяет заказывать услуги.'}
                              </p>
                              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                <p className="text-sm text-red-500">
                                  <strong>Как стать клиентом?</strong>
                                  <br />
                                  Создайте новый аккаунт заказчика.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
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
                              Выбор даты выполнения
                            </h3>
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-[var(--bg)]/80 to-transparent rounded-xl p-4 border border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                                <div className="flex items-center justify-between mb-4">
                                  <button
                                    onClick={handlePrevMonth}
                                    className="p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
                                  >
                                    <ChevronLeft className="w-5 h-5 text-[var(--text)]" />
                                  </button>
                                  <div className="text-center">
                                    <div className="text-lg font-semibold text-[var(--text)]">
                                      {monthNames[currentMonthNum]} {currentYear}
                                    </div>
                                    <div className="text-sm text-[var(--muted)]">
                                      Выберите будний день (не ближайшие 6 дней)
                                    </div>
                                  </div>
                                  <button
                                    onClick={handleNextMonth}
                                    className="p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
                                  >
                                    <ChevronRight className="w-5 h-5 text-[var(--text)]" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                  {weekDays.map((day, index) => (
                                    <div
                                      key={day}
                                      className={`text-center py-2 text-sm font-medium ${index >= 5 ? 'text-red-500' : 'text-[var(--muted)]'}`}
                                    >
                                      {day}
                                    </div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                  {daysInMonth.map((date, index) => {
                                    if (!date) {
                                      return <div key={`empty-${index}`} className="h-10" />
                                    }
                                    const isToday = date.toDateString() === new Date().toDateString()
                                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                                    const isAvailable = isDateAvailable(date)
                                    const isWeekendDay = isWeekend(date)
                                    const dayName = getDayName(date)
                                    return (
                                      <button
                                        key={date.toISOString()}
                                        onClick={() => handleDateSelect(date)}
                                        disabled={!isAvailable}
                                        className={`
                                          h-10 rounded-lg flex flex-col items-center justify-center text-xs font-medium relative
                                          transition-all duration-200 group
                                          ${isToday ? 'bg-blue-500/10 text-blue-500' : ''}
                                          ${isSelected ? 'bg-gradient-to-r from-[var(--accent)] to-purple-500 text-white shadow-lg' : ''}
                                          ${!isSelected && isAvailable ? 'hover:bg-[var(--bg)] text-[var(--text)]' : ''}
                                          ${!isAvailable || isWeekendDay ? 'opacity-30 cursor-not-allowed text-[var(--muted)]' : ''}
                                          ${isWeekendDay ? 'text-red-500/70' : ''}
                                        `}
                                      >
                                        <span>{date.getDate()}</span>
                                        <span className={`text-[10px] ${isSelected ? 'text-white/90' : isWeekendDay ? 'text-red-500/70' : 'text-[var(--muted)]'}`}>
                                          {dayName}
                                        </span>
                                        {!isAvailable && !isWeekendDay && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-0.5 bg-red-400 rotate-45 opacity-60"></div>
                                          </div>
                                        )}
                                      </button>
                                    )
                                  })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                                  <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500"></div>
                                      <span className="text-[var(--muted)]">Сегодня</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div>
                                      <span className="text-[var(--muted)]">Выходные (недоступны)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded bg-gray-500/20 border border-gray-500"></div>
                                      <span className="text-[var(--muted)]">Ближайшие 6 дней (недоступны)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {selectedDate && (
                                <div className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-green-500" />
                                    <div>
                                      <p className="text-sm text-[var(--muted)]">Выбранная дата</p>
                                      <p className="font-semibold text-[var(--text)]">
                                        {formatDate(selectedDate)}
                                      </p>
                                      <p className="text-sm text-[var(--muted)] mt-1">
                                        Будний день, доступен для заказа
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-[var(--text)]">Итого:</span>
                                  <span className="text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
                                    {service.price.toLocaleString('ru-RU')} ₽
                                  </span>
                                </div>
                                <motion.button
                                  onClick={handleCreateOrder}
                                  disabled={isSubmitting || !selectedDate}
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
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
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