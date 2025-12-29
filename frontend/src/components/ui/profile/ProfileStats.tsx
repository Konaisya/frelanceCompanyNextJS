'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Service, Review } from '@/types/profile'
import { Star, Briefcase, Clock, Award } from 'lucide-react'

interface ProfileStatsProps {
  user: User
  reviews: Review[]
  services: Service[]
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user, reviews, services }) => {
  const stats = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: 'Сервисы',
      value: services.length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Отзывы',
      value: reviews.length,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Рейтинг',
      value: reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Опыт',
      value: user.experience ? `${user.experience} лет` : 'Нет опыта',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  const skills = user.skills?.split(',').map(skill => skill.trim()) || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Навыки</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {user.contacts && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Контакты</h3>
          <p className="text-text">{user.contacts}</p>
        </motion.div>
      )}
    </div>
  )
}

export default ProfileStats