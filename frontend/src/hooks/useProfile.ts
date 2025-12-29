'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Service, Review } from '@/types/profile'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuth } from '@/components/ui/login/AuthProvider'
import { profileAPI } from '@/lib/api/axios'

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { isAuth, isLoading, logout } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (isLoading) return

    if (!isAuth) {
      router.push('/login')
      return
    }

    fetchProfileData()
  }, [isAuth, isLoading])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userResponse = await profileAPI.getMe()
      const userData = userResponse.data
      setUser(userData)

      const reviewsResponse = await profileAPI.getReviews({
        id_user_target: userData.id
      })
      setReviews(reviewsResponse.data)

      if (userData.role === 'EXECUTOR') {
        setServicesLoading(true)
        try {
          const servicesResponse = await profileAPI.getServices({
            id_user_executor: userData.id
          })
          setServices(servicesResponse.data)
        } finally {
          setServicesLoading(false)
        }
      } else {
        setServices([])
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
        setError('Сессия истекла. Пожалуйста, войдите снова.')
      } else {
        setError(err.response?.data?.message || 'Не удалось загрузить данные профиля')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateAvatar = async (imageFile: File) => {
    if (!user) return false

    try {
      const response = await profileAPI.updateAvatar(user.id, imageFile)

      setUser(prev =>
        prev
          ? { ...prev, image: response.data.image }
          : response.data
      )

      showToast({
        title: 'Успешно',
        description: 'Аватар обновлен',
        type: 'success'
      })

      return true
    } catch {
      showToast({
        title: 'Ошибка',
        description: 'Не удалось обновить аватар',
        type: 'error'
      })
      return false
    }
  }

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      const response = await profileAPI.createService(serviceData)
      const newService = response.data
      
      if (!newService.id) {
        newService.id = Date.now()
      }
      
      setServices(prev => [newService, ...prev])
      showToast({
        title: 'Успешно',
        description: 'Сервис создан',
        type: 'success'
      })
      return newService
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
      } else {
        showToast({
          title: 'Ошибка',
          description: 'Не удалось создать сервис',
          type: 'error'
        })
      }
      return null
    }
  }

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    try {
      await profileAPI.updateService(id, serviceData)
      setServices(prev => prev.map(service => 
        service.id === id ? { ...service, ...serviceData } : service
      ))
      showToast({
        title: 'Успешно',
        description: 'Сервис обновлен',
        type: 'success'
      })
      return true
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
      } else {
        showToast({
          title: 'Ошибка',
          description: 'Не удалось обновить сервис',
          type: 'error'
        })
      }
      return false
    }
  }

  const deleteService = async (id: number) => {
    try {
      await profileAPI.deleteService(id)
      setServices(prev => prev.filter(service => service.id !== id))
      showToast({
        title: 'Успешно',
        description: 'Сервис удален',
        type: 'success'
      })
      return true
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
      } else {
        showToast({
          title: 'Ошибка',
          description: 'Не удалось удалить сервис',
          type: 'error'
        })
      }
      return false
    }
  }

  const updateProfileData = async (updatedUser: User) => {
    setUser(updatedUser)
  }

  return {
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
    refreshData: fetchProfileData
  }
}