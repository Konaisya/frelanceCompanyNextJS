'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Plus } from 'lucide-react'
import { profileAPI } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'
import { AxiosError } from 'axios'

interface ApiErrorResponse {
  detail?: string | {
    message?: string
  }
}

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: number
  onSuccess: () => void
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardExpiry, setCardExpiry] = useState<string>('')
  const [cardCvc, setCardCvc] = useState<string>('')
  const { showToast } = useToast()

 const handleSubmit = async () => {
  if (loading) return

  const depositAmount = parseFloat(amount)
  if (!depositAmount || depositAmount <= 0) {
    showToast({
      title: 'Ошибка',
      description: 'Введите корректную сумму',
      type: 'error'
    })
    return
  }

  if (depositAmount > 100000) {
    showToast({
      title: 'Ошибка',
      description: 'Максимальная сумма пополнения - 100 000 ₽',
      type: 'error'
    })
    return
  }

  if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
    showToast({
      title: 'Ошибка',
      description: 'Введите корректный номер карты (16 цифр)',
      type: 'error'
    })
    return
  }

  if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
    showToast({
      title: 'Ошибка',
      description: 'Введите срок действия карты в формате ММ/ГГ',
      type: 'error'
    })
    return
  }

  if (!cardCvc || cardCvc.length !== 3) {
    showToast({
      title: 'Ошибка',
      description: 'Введите корректный CVC код (3 цифры)',
      type: 'error'
    })
    return
  }

  setLoading(true)

  try {
    await profileAPI.createTransaction({
      id_order: 0,
      id_user_recipient: currentUserId,
      amount: depositAmount,
      type: 'DEPOSIT'
    })

    showToast({
      title: 'Баланс пополнен!',
      description: `${depositAmount.toLocaleString('ru-RU')} ₽ успешно зачислены на ваш счет`,
      type: 'success'
    })

    setAmount('')
    setCardNumber('')
    setCardExpiry('')
    setCardCvc('')

    onSuccess()
    onClose()
  } catch (err) {
    let errorMessage = 'Не удалось пополнить баланс'

    const error = err as AxiosError<ApiErrorResponse>

    if (error.response?.data?.detail) {
      const detail = error.response.data.detail

      if (typeof detail === 'string') {
        errorMessage = detail
      } else if (detail.message) {
        errorMessage = detail.message
      }
    }

    showToast({
      title: 'Ошибка',
      description: errorMessage,
      type: 'error'
    })
  } finally {
    setLoading(false)
  }
}


  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.substring(0, 16)
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(value)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.substring(0, 4)
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2)
    }
    setCardExpiry(value)
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 3) value = value.substring(0, 3)
    setCardCvc(value)
  }

  // const formatCardNumber = (num: string) => {
  //   return num.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  // }

  if (!isOpen) return null

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
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Plus className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Пополнение баланса</h3>
                    <p className="text-sm text-muted">Зачислите средства на ваш счет</p>
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
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Сумма пополнения (₽)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      min="1"
                      max="100000"
                      step="1"
                      className="w-full px-4 py-3 bg-bg border border-accent/30 rounded-xl text-text text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                      ₽
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Минимум 1 ₽, максимум 100 000 ₽
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-text">Данные карты</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Номер карты
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-bg border border-accent/30 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Срок действия
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="ММ/ГГ"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-bg border border-accent/30 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 bg-bg border border-accent/30 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text mb-1">Безопасная оплата</p>
                      <p className="text-xs text-muted">
                        Данные карты используются только для пополнения баланса и не сохраняются на наших серверах.
                      </p>
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
                    onClick={handleSubmit}
                    disabled={loading || !amount || !cardNumber || !cardExpiry || !cardCvc}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Пополнить {amount ? `${parseFloat(amount).toLocaleString('ru-RU')} ₽` : 'баланс'}
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

export default DepositModal