'use client'

import { useState } from 'react'
import { profileAPI } from '@/lib/api/axios'
import { User, UpdateUserRequest, Specialization } from '@/lib/api/axios' // Изменено импорт
import { useToast } from '@/components/ui/ToastProvider'

interface ApiError {
  response?: {
    data?: {
      detail?: string
      message?: string
    }
  }
  message?: string
}

export const useEditProfile = (user: User) => {
  const [isLoading, setIsLoading] = useState(false)
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const { showToast } = useToast()

  const loadSpecializations = async () => {
    try {
      const response = await profileAPI.getSpecializations()
      setSpecializations(response.data)
    } catch (error) {
      console.error('Error loading specializations:', error)
      showToast({
        title: 'Ошибка',
        description: 'Не удалось загрузить специализации',
        type: 'error'
      })
    }
  }

  const updateProfile = async (data: UpdateUserRequest): Promise<boolean> => {
    setIsLoading(true)
    try {
      await profileAPI.updateUser(user.id, data)
      
      showToast({
        title: 'Успешно',
        description: 'Профиль обновлен',
        type: 'success'
      })
      
      return true
    } catch (error: unknown) {
      console.error('Error updating profile:', error)
      
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.detail || 
                          apiError.response?.data?.message || 
                          'Не удалось обновить профиль'
      
      showToast({
        title: 'Ошибка',
        description: errorMessage,
        type: 'error'
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserInfo = async (name: string, email: string): Promise<boolean> => {
    const updateData: UpdateUserRequest = {
      user: {
        name,
        email
      }
    }
    
    return updateProfile(updateData)
  }

  const updateExecutorProfile = async (
    id_specialization: number,
    contacts: string,
    experience: number,
    skills: string,
    hourly_rate: number,
    description: string
  ): Promise<boolean> => {
    const updateData: UpdateUserRequest = {
      user: {},
      executor_profile: {
        id_specialization,
        contacts,
        experience,
        skills,
        hourly_rate,
        description
      }
    }
    
    return updateProfile(updateData)
  }

  const updateCustomerProfile = async (
    company: string,
    contacts: string
  ): Promise<boolean> => {
    const updateData: UpdateUserRequest = {
      user: {},
      customer_profile: {
        company,
        contacts
      }
    }
    
    return updateProfile(updateData)
  }

  return {
    isLoading,
    specializations,
    loadSpecializations,
    updateUserInfo,
    updateExecutorProfile,
    updateCustomerProfile,
    updateProfile
  }
}