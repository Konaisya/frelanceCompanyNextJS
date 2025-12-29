import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const profileAPI = {
  getMe: () => api.get('/users/me'),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
  updateAvatar: (userId: number, imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.patch(`/users/${userId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getServices: (params?: any) => api.get('/services/', { params }),
  createService: (data: any) => api.post('/services/', data),
  updateService: (id: number, data: any) => api.put(`/services/${id}`, data),
  deleteService: (id: number) => api.delete(`/services/${id}`),

  createTransaction: (data: {
    id_order: number
    id_user_recipient: number
    amount: number
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'CORRECTION'
  }) => api.post('/transactions/', data),

  // Отзывы
  getReviews: (params?: any) => api.get('/reviews/', { params }),
  createReview: (data: {
    id_order: number
    id_user_target: number
    rating: number
    comment: string
  }) => api.post('/reviews/', data),

  // Специализации
  getSpecializations: () => api.get('/specializations/'),

  // Заказы
  getOrders: (params?: any) => api.get('/orders/', { params }),
  createOrder: (data: {
    id_user_executor: number
    id_service: number
    price: number
    name: string
    description: string
    deadline: string
  }) => api.post('/orders/', data),
  
  updateOrderStatus: (id: number, status: string) => 
    api.put(`/orders/${id}/`, { status }),

  cancelOrder: (id: number) => api.delete(`/orders/${id}`),
  
  getOrderDetails: (id: number) => api.get(`/orders/${id}`),
  getExecutors: (params?: any) => api.get('/users/', { params: { ...params, role: 'EXECUTOR' } })
}

export default api