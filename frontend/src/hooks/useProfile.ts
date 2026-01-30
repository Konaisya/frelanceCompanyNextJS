'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, Service, Review, CreateServiceData } from '@/lib/api/axios'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuth } from '@/components/ui/login/AuthProvider'
import { profileAPI } from '@/lib/api/axios'

interface ApiError {
  response?: {
    status: number
    data?: {
      message?: string
    }
  }
  message?: string
}

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

  const fetchProfileData = useCallback(async () => {
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
    } catch (err: unknown) {
      const error = err as ApiError
      if (error.response?.status === 401) {
        logout()
        setError('Сессия истекла. Пожалуйста, войдите снова.')
      } else {
        setError(error.response?.data?.message || 'Не удалось загрузить данные профиля')
      }
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    if (isLoading) return

    if (!isAuth) {
      router.push('/login')
      return
    }

    fetchProfileData()
  }, [isAuth, isLoading, router, fetchProfileData])

  const updateAvatar = async (imageFile: File) => {
    if (!user) return false

    try {
      const response = await profileAPI.updateAvatar(user.id, imageFile)
      setUser(prev => prev ? { ...prev, image: response.data.image } : response.data)

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

  const createService = async (
    serviceData: CreateServiceData & { id_user_executor: number }
  ) => {
    try {
      await profileAPI.createService(serviceData)
      await fetchProfileData()

      showToast({
        title: 'Успешно',
        description: 'Сервис создан',
        type: 'success'
      })

      return true
    } catch (err: unknown) {
      const error = err as ApiError
      if (error.response?.status === 401) logout()

      showToast({
        title: 'Ошибка',
        description: 'Не удалось создать сервис',
        type: 'error'
      })
      return false
    }
  }

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    try {
      await profileAPI.updateService(id, serviceData as Partial<CreateServiceData>)
      await fetchProfileData()

      showToast({
        title: 'Успешно',
        description: 'Сервис обновлен',
        type: 'success'
      })

      return true
    } catch (err: unknown) {
      const error = err as ApiError
      if (error.response?.status === 401) logout()

      showToast({
        title: 'Ошибка',
        description: 'Не удалось обновить сервис',
        type: 'error'
      })
      return false
    }
  }

  const deleteService = async (id: number) => {
    try {
      await profileAPI.deleteService(id)
      await fetchProfileData()

      showToast({
        title: 'Успешно',
        description: 'Сервис удален',
        type: 'success'
      })

      return true
    } catch (err: unknown) {
      const error = err as ApiError
      if (error.response?.status === 401) logout()

      showToast({
        title: 'Ошибка',
        description: 'Не удалось удалить сервис',
        type: 'error'
      })
      return false
    }
  }

  const updateProfileData = (updatedUser: User) => {
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
