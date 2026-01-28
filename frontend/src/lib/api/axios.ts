import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Типы для данных
export type UserRole = 'CUSTOMER' | 'EXECUTOR' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  image: string
  role: UserRole
  specialization?: {
    id: number
    name: string
  }
  contacts?: string
  experience?: number
  skills?: string
  hourly_rate?: number
  description?: string
  balance?: number
  rating?: number
  completed_orders?: number
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  delivery_time: number
  id_user_executor: number
  id_specialization: number
  specialization: {
    id: number
    name: string
  }
  user_executor: {
    id: number
    name: string
    image: string
    rating?: number
    completed_orders?: number
  }
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: number
  id_user_author: number
  id_user_target: number
  id_order: number
  rating: number
  comment: string
  created_at: string
  updated_at: string
  author_name?: string
}

export interface Specialization {
  id: number
  name: string
}

export interface Order {
  id: number
  name: string
  description: string
  price: number
  deadline: string
  status: string
  id_user_customer: number
  id_user_executor: number
  id_service: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  id_order: number
  id_user_recipient: number
  amount: number
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'CORRECTION'
  created_at: string
}

export interface CreateServiceData {
  name: string
  description: string
  id_specialization: number
  price: number
  delivery_time: number
}

export interface UpdateUserRequest {
  user: {
    name?: string
    email?: string
    password?: string
    balance?: number
  }
  executor_profile?: {
    id_specialization?: number
    contacts?: string
    experience?: number
    skills?: string
    hourly_rate?: number
    description?: string
  }
  customer_profile?: {
    company?: string
    contacts?: string
  }
}

export interface Executor extends User {
  specialization: {
    id: number
    name: string
  }
  services_count?: number
  price_range?: [number, number]
}

// Интерфейсы для параметров запросов
interface GetServicesParams {
  id_user_executor?: number
  id_specialization?: number
  min_price?: number
  max_price?: number
  search?: string
}

interface GetOrdersParams {
  id_user_customer?: number
  id_user_executor?: number
  status?: string
}

interface GetReviewsParams {
  id_user_target?: number
  id_order?: number
}

interface GetExecutorsParams {
  id_specialization?: number
  min_rating?: number
  max_hourly_rate?: number
  search?: string
}

interface CreateTransactionData {
  id_order: number
  id_user_recipient: number
  amount: number
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'CORRECTION'
}

interface CreateReviewData {
  id_order: number
  id_user_target: number
  rating: number
  comment: string
}

interface CreateOrderData {
  id_user_executor: number
  id_service: number
  price: number
  name: string
  description: string
  deadline: string
}

// Создание экземпляра axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Интерцепторы
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname

        const isPublicPage =
          pathname.startsWith('/login') ||
          pathname.startsWith('/signup') ||
          pathname.startsWith('/executors')

        if (!isPublicPage) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// API методы
export const profileAPI = {
  getMe: (): Promise<AxiosResponse<User>> => api.get('/users/me'),
  updateUser: (id: number, data: UpdateUserRequest): Promise<AxiosResponse<User>> => api.put(`/users/${id}`, data),
  updateAvatar: (userId: number, imageFile: File): Promise<AxiosResponse<User>> => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.patch(`/users/${userId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getServices: (params?: GetServicesParams): Promise<AxiosResponse<Service[]>> => 
    api.get('/services/', { params }),
  createService: (data: CreateServiceData): Promise<AxiosResponse<Service>> => 
    api.post('/services/', data),
  updateService: (id: number, data: Partial<CreateServiceData>): Promise<AxiosResponse<Service>> => 
    api.put(`/services/${id}`, data),
  deleteService: (id: number): Promise<AxiosResponse> => 
    api.delete(`/services/${id}`),

  createTransaction: (data: CreateTransactionData): Promise<AxiosResponse<Transaction>> => 
    api.post('/transactions/', data),

  getReviews: (params?: GetReviewsParams): Promise<AxiosResponse<Review[]>> => 
    api.get('/reviews/', { params }),
  createReview: (data: CreateReviewData): Promise<AxiosResponse<Review>> => 
    api.post('/reviews/', data),

  getSpecializations: (): Promise<AxiosResponse<Specialization[]>> => 
    api.get('/specializations/'),

  getOrders: (params?: GetOrdersParams): Promise<AxiosResponse<Order[]>> => 
    api.get('/orders/', { params }),
  createOrder: (data: CreateOrderData): Promise<AxiosResponse<Order>> => 
    api.post('/orders/', data),
  
  updateOrderStatus: (id: number, status: string): Promise<AxiosResponse<Order>> => 
    api.put(`/orders/${id}/`, { status }),

  cancelOrder: (id: number): Promise<AxiosResponse> => 
    api.delete(`/orders/${id}`),
  
  getOrderDetails: (id: number): Promise<AxiosResponse<Order>> => 
    api.get(`/orders/${id}`),
  
  getExecutors: (params?: GetExecutorsParams): Promise<AxiosResponse<Executor[]>> => 
    api.get('/users/', { params: { ...params, role: 'EXECUTOR' } })
}

export default api