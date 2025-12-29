'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import ProfileHeader from './ProfileHeader'
import ProfileStats from './ProfileStats'
import ServicesSection from './ServicesSection'
import ReviewsSection from './ReviewsSection'
import OrdersSection from './OrdersSection' // Добавляем импорт
import CreateServiceModal from './CreateServiceModal'
import EditProfileModal from './EditProfileModal'
import { Service, CreateServiceData } from '@/types/profile'

const ProfilePage: React.FC = () => {
  const {
    user,
    services,
    servicesLoading,
    reviews,
    loading,
    error,
    updateAvatar,
    createService,
    updateService,
    deleteService,
    updateProfileData,
    refreshData
  } = useProfile()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [localServices, setLocalServices] = useState<Service[]>(services || [])

  React.useEffect(() => {
    setLocalServices(services)
  }, [services])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted">Загрузка профиля...</p>
      </div>
    </div>
  )

  if (error || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="card p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Ошибка</h2>
        <p className="text-muted mb-6">{error || 'Пользователь не найден'}</p>
        <button
          onClick={refreshData}
          className="px-6 py-2 bg-accent text-accent-text rounded-lg hover:opacity-90 transition-opacity"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )

  const handleCreateService = async (data: CreateServiceData) => {
    if (!user) return null

    const newServiceData: Omit<Service, 'id'> = {
      ...data,
      id_user_executor: user.id
    }

    const newService = await createService(newServiceData)
    if (newService) {
      setLocalServices(prev => [...prev, newService])
      setIsCreateModalOpen(false)
      return newService
    }

    return null
  }

  const handleProfileUpdate = (updatedUser: any) => {
    updateProfileData(updatedUser)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-bg py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <ProfileHeader 
            user={user} 
            onAvatarUpdate={updateAvatar}
            onEditClick={() => setIsEditProfileModalOpen(true)}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <ProfileStats user={user} reviews={reviews} services={localServices} />
              
              {/* Секция заказов - для всех пользователей */}
              <OrdersSection 
                userId={user.id} 
                isExecutor={user.role === 'EXECUTOR'} 
              />
              
              {user.role === 'EXECUTOR' && (
                <ServicesSection
                  services={localServices}
                  loading={servicesLoading}
                  onUpdate={updateService}
                  onDelete={deleteService}
                  onCreate={() => setIsCreateModalOpen(true)}
                />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <ReviewsSection reviews={reviews} />
            </div>
          </div>
        </div>

        {user.role === 'EXECUTOR' && (
          <CreateServiceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateService}
          />
        )}
      </motion.div>

      <EditProfileModal
        user={user}
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleProfileUpdate}
      />
    </>
  )
}

export default ProfilePage