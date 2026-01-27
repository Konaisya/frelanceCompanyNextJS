export type UserRole = 'CUSTOMER' | 'EXECUTOR' | 'ADMIN'

export interface UserSignup {
  name: string
  role: UserRole
  email: string
  password: string
}

export interface ExecutorProfile {
  id_specialization: number
  contacts: string
  experience: number
  skills: string
  hourly_rate: number
  description: string
}

export interface CustomerProfile {
  company: string
  contacts: string
}

export interface SignupData {
  user: UserSignup
  executor_profile?: ExecutorProfile | null
  customer_profile?: CustomerProfile | null
}

export interface LoginData {
  email: string
  password: string
}
