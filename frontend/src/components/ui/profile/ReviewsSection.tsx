'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Review } from '@/types/profile'
import { Star, User, Calendar } from 'lucide-react'

interface ReviewsSectionProps {
  reviews: Review[]
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text">Отзывы</h2>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-xl font-bold text-text">{averageRating.toFixed(1)}</span>
          <span className="text-muted">({reviews.length})</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted">Отзывов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-accent/10 rounded-xl p-4 hover:border-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-text">Пользователь #{review.id_user_author}</p>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Calendar className="w-3 h-3" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-text/80">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ReviewsSection