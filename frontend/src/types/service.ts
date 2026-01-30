export interface Service {
  id: number
  name: string
  description: string
  price: number
  delivery_time: number
  id_user_executor: number
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
}
