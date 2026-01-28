'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Edit, Settings, Wallet, Plus } from 'lucide-react'
import { User as UserType } from '@/lib/api/axios' // Изменено импорт
import Image from 'next/image'
import DepositModal from './DepositModal'

interface ProfileHeaderProps {
  user: UserType
  onAvatarUpdate: (file: File) => Promise<boolean>
  onEditClick?: () => void
  onBalanceUpdate?: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  onAvatarUpdate,
  onEditClick,
  onBalanceUpdate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(user.image || '/placeholder.png')
  const [showDepositModal, setShowDepositModal] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const success = await onAvatarUpdate(file)
      if (success) {
        setAvatarUrl(URL.createObjectURL(file))
      }
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'EXECUTOR':
        return 'Исполнитель'
      case 'CUSTOMER':
        return 'Заказчик'
      case 'ADMIN':
        return 'Администратор'
      default:
        return role
    }
  }

  const handleDepositSuccess = () => {
    setShowDepositModal(false)
    if (onBalanceUpdate) {
      onBalanceUpdate()
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mt-16"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <div className="relative w-full h-full rounded-2xl border-4 border-accent/10 overflow-hidden">
                <Image
                  src={avatarUrl.startsWith('http') ? avatarUrl : `${process.env.NEXT_PUBLIC_IMAGE_URL}${avatarUrl}`}
                  alt={user.name || 'User avatar'}
                  fill
                  className="object-cover"
                />
              </div>

              <button
                onClick={handleAvatarClick}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
              >
                <Edit className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-accent text-accent-text rounded-full text-sm font-medium">
              {getRoleLabel(user.role)}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-text">{user.name}</h1>
                  {user.role === 'EXECUTOR' && user.specialization && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      {user.specialization.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-muted mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.experience !== undefined && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{user.experience} лет опыта</span>
                    </div>
                  )}
                </div>

                {user.description && (
                  <p className="text-text/80 max-w-2xl">{user.description}</p>
                )}

                {user.skills && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-bg text-text rounded-full text-sm border border-accent/20"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-xl">
                    <Wallet className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted">Баланс</p>
                      <p className="text-xl font-bold text-accent">
                        {user.balance?.toLocaleString('ru-RU') || '0'} ₽
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Пополнить
                  </button>
                </div>
              </div>

              <button
                onClick={onEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors self-start"
              >
                <Settings className="w-4 h-4" />
                Редактировать
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        currentUserId={user.id}
        onSuccess={handleDepositSuccess}
      />
    </>
  )
}

export default ProfileHeader