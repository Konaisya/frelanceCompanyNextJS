export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  role: 'EXECUTOR' | 'CUSTOMER';
  specialization?: {
    id: number;
    name: string;
  };
  contacts?: string;
  experience?: number;
  skills?: string;
  hourly_rate?: number;
  description?: string;
  balance?: number;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  id_specialization: number;
  id_user_executor: number;
  price: number;
  delivery_time: number;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  id_user_author: number;
  id_user_target: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface Specialization {
  id: number;
  name: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  id_specialization: number;
  price: number;
  delivery_time: number;
}


export interface UpdateUserRequest {
  user: {
    name?: string;
    email?: string;
    password?: string;
    balance?: number;
  };
  executor_profile?: {
    id_specialization?: number;
    contacts?: string;
    experience?: number;
    skills?: string;
    hourly_rate?: number;
    description?: string;
  };
  customer_profile?: {
    company?: string;
    contacts?: string;
  };
}

export interface Specialization {
  id: number;
  name: string;
}