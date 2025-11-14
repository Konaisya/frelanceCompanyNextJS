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
}