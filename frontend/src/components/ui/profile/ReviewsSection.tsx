'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, User, MessageSquare, Calendar } from 'lucide-react'
import { profileAPI } from '@/lib/api/axios'

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  user_author?: {
    name: string
    image: string
  }
  order?: {
    name: string
  }
}

interface ReviewsSectionProps {
  userId: number
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await profileAPI.getReviews({ id_user_target: userId })
        setReviews(response.data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Не удалось загрузить отзывы')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return parseFloat((sum / reviews.length).toFixed(1))
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <p className="text-red-500 text-center">{error}</p>
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
          <h3 className="text-xl font-bold text-text">Отзывы обо мне</h3>
          <p className="text-sm text-muted mt-1">{reviews.length} отзывов</p>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-text">{getAverageRating()}</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted">Отзывов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl border border-accent/10 bg-bg/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">
                      {review.user_author?.name || 'Аноним'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.created_at)}
                </div>
              </div>

              <p className="text-text/80 leading-relaxed">{review.comment}</p>

              {review.order && (
                <div className="mt-3 pt-3 border-t border-accent/10">
                  <p className="text-xs text-muted">Заказ: {review.order.name}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ReviewsSection