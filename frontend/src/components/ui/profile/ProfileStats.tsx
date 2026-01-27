'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Package, Star } from 'lucide-react'
import { Review, Service } from '@/types/profile'

interface User {
  id: number
  name: string
  email: string
  balance?: number
  description?: string
  role: string
}

interface ProfileStatsProps {
  user: User
  reviews?: Review[]
  services?: Service[]
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ 
  user, 
  reviews = [], 
  services = [] 
}) => {
  const isExecutor = user.role === 'EXECUTOR'

  if (!isExecutor) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-xl font-bold text-text mb-6">Баланс</h3>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted">Текущий баланс</p>
            <p className="text-3xl font-bold text-text">
              {user.balance?.toLocaleString('ru-RU') || '0'} ₽
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const totalServices = services.length
  const totalReviews = reviews.length
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const stats = [
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Услуги',
      value: totalServices,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Отзывы',
      value: totalReviews,
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Рейтинг',
      value: averageRating,
      color: 'bg-green-500/10 text-green-600 border-green-500/20'
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Баланс',
      value: user.balance?.toLocaleString('ru-RU') || '0',
      suffix: ' ₽',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <h3 className="text-xl font-bold text-text mb-6">Статистика</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${stat.color} flex items-center gap-3`}
          >
            <div className="p-2 bg-white/20 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="text-xl font-bold text-text">
                {stat.value}
                {stat.suffix && <span className="text-sm ml-1">{stat.suffix}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ProfileStats
