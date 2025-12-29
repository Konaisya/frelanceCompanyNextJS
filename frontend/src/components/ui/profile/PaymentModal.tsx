'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, Lock } from 'lucide-react'
import { profileAPI } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: number
    name: string
    price: number
    user_executor: {
      id: number
      name: string
    }
  }
  onSuccess: () => void
}

interface ApiError {
  response?: {
    data?: {
      detail?: unknown
      message?: string
    }
    status?: number
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [userBalance, setUserBalance] = useState<number | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen) fetchUserBalance()
  }, [isOpen])

  const fetchUserBalance = async () => {
    try {
      const response = await profileAPI.getMe()
      setUserBalance(response.data.balance || 0)
    } catch (err) {
      console.error('Ошибка загрузки баланса:', err)
    }
  }

  const calculateTotalAmount = () => {
    const price = order.price
    const commission = price * 0.01
    return price + commission
  }

  const handlePayment = async () => {
    if (loading) return
    const totalAmount = calculateTotalAmount()

    if (userBalance !== null && userBalance < totalAmount) {
      showToast({
        title: 'Недостаточно средств',
        description: `На вашем балансе ${userBalance.toLocaleString('ru-RU')} ₽. Требуется ${totalAmount.toLocaleString('ru-RU')} ₽`,
        type: 'error'
      })
      return
    }

    setLoading(true)
    try {
      await profileAPI.createTransaction({
        id_order: order.id,
        id_user_recipient: order.user_executor.id,
        amount: order.price,
        type: 'PAYMENT' as const
      })

      await profileAPI.updateOrderStatus(order.id, 'COMPLETED')

      showToast({
        title: 'Оплата успешна!',
        description: `Заказ "${order.name}" оплачен и завершен. Комиссия 1% удержана.`,
        type: 'success'
      })

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const error = err as ApiError
      let errorMessage = 'Не удалось завершить оплату'

      const detail = error.response?.data?.detail
      if (detail) {
        if (typeof detail === 'string') errorMessage = detail
        else if (Array.isArray(detail)) {
          errorMessage = detail
            .map(d => (d && typeof d === 'object' && 'msg' in d ? (d as { msg: string }).msg : ''))
            .join(', ')
        } else if (typeof detail === 'object') {
          if ('message' in detail) errorMessage = (detail as { message: string }).message
          else if ('detail' in detail) errorMessage = (detail as { detail: string }).detail
        }
      }

      showToast({
        title: 'Ошибка оплаты',
        description: errorMessage,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) onClose()
  }

  if (!isOpen) return null

  const totalAmount = calculateTotalAmount()
  const commission = order.price * 0.01

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div className="flex items-center justify-center min-h-full p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Оплата заказа</h3>
                    <p className="text-sm text-muted">#{order.id} - {order.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-bg rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-bg/50 border border-accent/20">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-text">Стоимость заказа:</span>
                        <span className="font-medium text-text">{order.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Комиссия сервиса (1%):</span>
                        <span className="text-muted">{commission.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="pt-2 border-t border-accent/20">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-text">Итого к списанию:</span>
                          <span className="text-2xl font-bold text-green-600">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Исполнитель:</span>
                      <span className="font-medium text-text">{order.user_executor.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-accent/10">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-accent/30 text-accent rounded-xl hover:bg-accent/10 transition-colors disabled:opacity-50"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading || (userBalance !== null && userBalance < totalAmount)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Оплатить {totalAmount.toLocaleString('ru-RU')} ₽
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default PaymentModal
