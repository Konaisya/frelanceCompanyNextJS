import { Specialization } from "./specialization"

export interface Executor {
  id: number
  name: string
  image: string
  role: 'EXECUTOR' | 'CUSTOMER' | 'ADMIN'
  email: string
  balance: number
  specialization: Specialization
  contacts: string
  experience: number
  skills: string
  hourly_rate: number
  description: string
  rating?: number
  completed_orders?: number
  services_count?: number
  price_range?: [number, number]
  specializations_list?: string[]
}

export interface UserResponse {
  id: number
  name: string
  image: string
  role: string
  description?: string
  specialization?: Specialization
  skills?: string
  experience?: number
}

export interface Review {
  id: number
  id_user_target: number
  rating: number
  comment: string
  created_at: string
}