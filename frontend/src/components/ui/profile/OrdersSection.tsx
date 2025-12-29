'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, User, CheckCircle, XCircle, AlertCircle, Package, PlayCircle, CreditCard, ThumbsUp } from 'lucide-react'
import { profileAPI } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'
import Button from '@/components/ui/Button'

interface Order {
  id: number
  name: string
  description: string
  price: number
  deadline: string
  status: 'PENDING' | 'ACCEPTED' | 'IN_WORK' | 'AWAITING_PAYMENT' | 'COMPLETED' | 'CANCELLED'
  created_at: string
  service?: {
    name: string
  }
  user_executor?: {
    id: number
    name: string
    image: string
  }
  user_customer?: {
    id: number
    name: string
    image: string
  }
}

interface OrdersSectionProps {
  userId: number
  isExecutor?: boolean
  onStatusUpdate?: () => void
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ userId, isExecutor = false, onStatusUpdate }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [userId, isExecutor])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = isExecutor 
        ? { id_user_executor: userId }
        : { id_user_customer: userId }
      
      const response = await profileAPI.getOrders(params)
      setOrders(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить заказы')
      showToast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заказы',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'ACCEPTED':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'IN_WORK':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'AWAITING_PAYMENT':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'ACCEPTED':
        return <ThumbsUp className="w-4 h-4" />
      case 'IN_WORK':
        return <PlayCircle className="w-4 h-4" />
      case 'AWAITING_PAYMENT':
        return <CreditCard className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает подтверждения'
      case 'ACCEPTED':
        return 'Принят исполнителем'
      case 'IN_WORK':
        return 'В работе'
      case 'AWAITING_PAYMENT':
        return 'Ожидает оплаты'
      case 'COMPLETED':
        return 'Завершен'
      case 'CANCELLED':
        return 'Отменен'
      default:
        return status
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

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      await profileAPI.updateOrderStatus(orderId, newStatus)
      
      showToast({
        title: 'Статус обновлен',
        description: `Статус заказа изменен на "${getStatusText(newStatus)}"`,
        type: 'success'
      })
      
      fetchOrders()
      onStatusUpdate?.()
    } catch (err: any) {
      showToast({
        title: 'Ошибка',
        description: err.response?.data?.message || 'Не удалось обновить статус',
        type: 'error'
      })
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getAvailableActions = (order: Order, isExecutor: boolean) => {
    const actions = []
    
    if (isExecutor) {
      // Действия для исполнителя
      switch (order.status) {
        case 'PENDING':
          actions.push(
            { label: 'Принять', status: 'ACCEPTED', variant: 'primary' },
            { label: 'Отклонить', status: 'CANCELLED', variant: 'secondary' }
          )
          break
        case 'ACCEPTED':
          actions.push(
            { label: 'Начать работу', status: 'IN_WORK', variant: 'primary' }
          )
          break
        case 'IN_WORK':
          actions.push(
            { label: 'Завершить', status: 'AWAITING_PAYMENT', variant: 'primary' }
          )
          break
        case 'AWAITING_PAYMENT':
          actions.push(
            { label: 'Подтвердить оплату', status: 'COMPLETED', variant: 'primary' }
          )
          break
      }
    } else {
      // Действия для заказчика
      switch (order.status) {
        case 'PENDING':
          actions.push(
            { label: 'Отменить', status: 'CANCELLED', variant: 'secondary' }
          )
          break
        case 'AWAITING_PAYMENT':
          actions.push(
            { label: 'Оплатить', status: 'COMPLETED', variant: 'primary' }
          )
          break
      }
    }
    
    return actions
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted">Загрузка заказов...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-accent text-accent-text rounded-lg hover:opacity-90 transition-opacity"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text">
            {isExecutor ? 'Мои заказы' : 'История заказов'}
          </h3>
          <p className="text-sm text-muted mt-1">
            {isExecutor ? 'Заказы от клиентов' : 'Все ваши заказы'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
            {orders.length} заказов
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            title="Обновить"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text mb-2">
            {isExecutor ? 'Заказов пока нет' : 'У вас еще нет заказов'}
          </h4>
          <p className="text-muted max-w-md mx-auto">
            {isExecutor 
              ? 'Когда клиенты закажут ваши услуги, они появятся здесь'
              : 'Найдите интересную услугу и создайте первый заказ'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const availableActions = getAvailableActions(order, isExecutor)
            const isUpdating = updatingOrderId === order.id
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl border border-accent/10 hover:border-accent/20 transition-colors bg-bg/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-text">{order.name}</h4>
                      {order.service && (
                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                          {order.service.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted line-clamp-2">{order.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-sm text-muted">Стоимость</p>
                      <p className="font-semibold text-text">
                        {order.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-sm text-muted">Дедлайн</p>
                      <p className="font-semibold text-text">
                        {formatDate(order.deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted" />
                    <div>
                      <p className="text-sm text-muted">
                        {isExecutor ? 'Заказчик' : 'Исполнитель'}
                      </p>
                      <p className="font-semibold text-text">
                        {isExecutor 
                          ? order.user_customer?.name || 'Клиент'
                          : order.user_executor?.name || 'Исполнитель'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                {availableActions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-accent/10">
                    <div className="flex flex-wrap gap-2">
                      {availableActions.map((action, index) => (
                        <Button
                          key={index}
                          onClick={() => handleStatusUpdate(order.id, action.status)}
                          disabled={isUpdating}
                          className={`text-sm ${
                            action.variant === 'secondary' 
                              ? 'bg-transparent border border-accent/30 text-accent hover:bg-accent/10'
                              : ''
                          }`}
                        >
                          {isUpdating ? 'Обновление...' : action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-accent/10">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      Создан: {formatDate(order.created_at)}
                    </span>
                    <span className="text-accent font-medium">
                      ID: #{order.id}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default OrdersSection