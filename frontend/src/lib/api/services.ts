import { Service } from '@/types/service'
import api from './axios'


export const ServicesAPI = {
  async getAll(params?: {
    name?: string | null
    id_specialization?: number | null
    id_user_executor?: number | null
    price?: number | null
    delivery_time?: number | null
  }) {
    const response = await api.get<Service[]>('/services/', { params })
    return response.data
  },

  async getById(id: number) {
    const response = await api.get<Service>(`/services/${id}/`)
    return response.data
  },

  async create(data: Partial<Service>) {
    const response = await api.post<Service>('/services/', data)
    return response.data
  },

  async update(id: number, data: Partial<Service>) {
    const response = await api.put<Service>(`/services/${id}/`, data)
    return response.data
  },

  async delete(id: number) {
    await api.delete(`/services/${id}/`)
  },
}
