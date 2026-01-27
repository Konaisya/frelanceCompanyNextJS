'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, User } from 'lucide-react'
import { profileAPI } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'
import type { AxiosError } from 'axios'

interface CreateReviewModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: number
  targetUserId: number
  targetUserName: string
  onSuccess: () => void
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  targetUserId,
  targetUserName,
  onSuccess
}) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (comment.trim().length < 10) {
      showToast({
        title: 'Слишком короткий отзыв',
        description: 'Пожалуйста, напишите отзыв минимум из 10 символов',
        type: 'error'
      })
      return
    }

    setLoading(true)
    try {
      await profileAPI.createReview({
        id_order: orderId,
        id_user_target: targetUserId,
        rating: rating,
        comment: comment.trim()
      })

      showToast({
        title: 'Отзыв отправлен!',
        description: 'Спасибо за ваш отзыв',
        type: 'success'
      })

      onSuccess()
      onClose()
      resetForm()
   } catch (error) {
    const err = error as AxiosError<{ detail?: string }>
    showToast({
      title: 'Ошибка',
      description: err.response?.data?.detail ?? 'Не удалось отправить отзыв',
      type: 'error'
    })
  }
  finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setRating(5)
    setComment('')
    setHoveredRating(0)
  }

  const handleClose = () => {
    resetForm()
    onClose()
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
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Оставить отзыв</h3>
                    <p className="text-sm text-muted">Заказ #{orderId}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-bg rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 rounded-xl bg-bg/50 border border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted">Отзыв для</p>
                      <p className="font-semibold text-text">{targetUserName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-4">
                    Ваша оценка
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hoveredRating || rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-4 text-lg font-bold text-text">
                      {rating}.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Ваш отзыв
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Расскажите о вашем опыте работы с исполнителем..."
                    rows={4}
                    className="w-full px-4 py-3 bg-bg border border-accent/20 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                    required
                    minLength={10}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted">
                      Минимум 10 символов
                    </span>
                    <span className={`text-xs ${
                      comment.length > 500 ? 'text-red-500' : 'text-muted'
                    }`}>
                      {comment.length}/500
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-accent/10">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-accent/30 text-accent rounded-xl hover:bg-accent/10 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading || comment.trim().length < 10}
                    className="flex-1 px-4 py-3 bg-accent text-accent-text rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-accent-text border-t-transparent rounded-full animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Отправить отзыв
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

export default CreateReviewModal